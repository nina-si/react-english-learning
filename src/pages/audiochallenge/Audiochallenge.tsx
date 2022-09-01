import React, {
  FC, MouseEventHandler, useEffect, useState,
} from 'react';
import { Button } from 'antd';
import OptionsContainer from './optionsContainer';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  changeAnswerColor,
  checkAnswer, getAnswerOptions, getAnswerText,
} from './audioChallengeGame';
import ENV from '../../config/config';
import ResultGame from '../../components/result-game';
import ConfirmModal from '../../components/shared/modal/confirm-modal';
import LeaveGameButton from '../../components/shared/button/leave-game-button';
import rightAnswerSound from '../../assets/sounds/right-answer.mp3';
import wrongAnswerSound from '../../assets/sounds/wrong-answer.mp3';
import {
  clearCurrentGame,
  addRightAnswer,
  addWrongAnswer,
  changeCombo,
  Answer,
} from '../../store/slices/currentGame';
import AudioBtn from './audioBtn';
import RightAnswerCard from './rightAnswerCard';
import './audiochallenge.scss';
import { updateWord } from '../statistics/helpers';
import { updateUserWordFromTextbook } from '../../store/thunks';
import { selectIsLogged, selectUser } from '../../store/slices/auth';

export type addAnswersToSliceArgs = { isRight: boolean; answer: Answer };

const Audiochallenge: FC = () => {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector(selectIsLogged);
  const user = useAppSelector(selectUser);
  const {
    words, randomWords, rightAnswers, wrongAnswers, maxCombo,
  } = useAppSelector((state) => state.currentGame);
  const [wordIndex, setWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(words[wordIndex]);
  const [answerOptions, setAnswerOptions] = useState([...getAnswerOptions(currentWord, randomWords), "Don't know"]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isVisibleLeaveModal, setVisibleLeaveModal] = useState(false);
  const [combo, setCombo] = useState(0);
  const [learned, setLearned] = useState(0);
  const wordAudio = `${ENV.BASE_URL}${currentWord.audio}`;
  const rightAnswerAudio = new Audio(rightAnswerSound);
  const wrongAnswerAudio = new Audio(wrongAnswerSound);

  const clearOptionsId = () => {
    const optionButtons = Array.from(document.querySelectorAll('.option-btn')) as HTMLElement[];
    optionButtons.forEach((option) => {
      option.removeAttribute('id');
    });
  };

  useEffect(() => {
    setCurrentWord(words[wordIndex]);
  }, [wordIndex]);

  useEffect(() => {
    setAnswerOptions([...getAnswerOptions(currentWord, randomWords), "Don't know"]);
    clearOptionsId();
  }, [currentWord]);

  const restartGame = () => {
    dispatch(clearCurrentGame());
    setWordIndex(0);
    setIsGameFinished(false);
  };

  const updateAnswersData = (rightAnswers: Answer[], wrongAnswers: Answer[]) => {
    rightAnswers.forEach(answer => {
      const updatedData = updateWord({ isRight: true, answer }, 'audiochallenge');
      if (updatedData.newLearned) {
        setLearned(learned + 1);
      }
      dispatch(updateUserWordFromTextbook({ userId: user.userId, token: user.token, wordId: answer.id, userWord: { ...updatedData.newStatistic } }))
    })
    wrongAnswers.forEach(answer => {
      const updatedData = updateWord({ isRight: false, answer }, 'audiochallenge');
      dispatch(updateUserWordFromTextbook({ userId: user.userId, token: user.token, wordId: answer.id, userWord: { ...updatedData.newStatistic } }))
    })
  }

  const addAnswersToSlice = (answerArr: addAnswersToSliceArgs) => {
    const { isRight } = answerArr;
    if (isRight) {
      rightAnswerAudio.play();
      dispatch(addRightAnswer(answerArr.answer));
      setCombo(combo + 1);
    } else {
      wrongAnswerAudio.play();
      dispatch(addWrongAnswer(answerArr.answer));
      if (combo > maxCombo) {
        dispatch(changeCombo(combo));
      }
      setCombo(0);
    }
  };

  const nextWord = () => {
    if (wordIndex < words.length - 1 && wordIndex < 20) {
      setWordIndex(wordIndex + 1);
    } else {
      setIsGameFinished(true);
    }
    const nextBtn = document.querySelector('.audiochallenge__btn-next');
    if (nextBtn) {
      nextBtn.setAttribute('disabled', 'true');
    }
    setIsAnswered(false);
  };

  const handleAnswer = (userAnswer: string) => {
    let answer = userAnswer;
    let isRightAnswer: boolean;
    if (answer === "Don't know") {
      isRightAnswer = false;
      answer = '-';
    } else {
      isRightAnswer = checkAnswer(answer, currentWord.wordTranslate);
    }
    addAnswersToSlice({
      isRight: isRightAnswer,
      answer: {
        answer,
        ...currentWord,
      },
    });
    changeAnswerColor(isRightAnswer, answer, currentWord.wordTranslate);
    setIsAnswered(true);
    const nextBtn = document.querySelector('.audiochallenge__btn-next');
    if (nextBtn) {
      nextBtn.removeAttribute('disabled');
      nextBtn.addEventListener('click', nextWord);
    }
  };

  const handleClick: MouseEventHandler = (e) => {
    e.preventDefault();
    const answer = getAnswerText(e as unknown as MouseEvent);
    if (answer) {
      handleAnswer(answer);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'Digit1':
      case 'Numpad1':
        handleAnswer(answerOptions[0]);
        break;
      case 'Digit2':
      case 'Numpad2':
        handleAnswer(answerOptions[1]);
        break;
      case 'Digit3':
      case 'Numpad3':
        handleAnswer(answerOptions[2]);
        break;
      case 'Digit4':
      case 'Numpad4':
        handleAnswer(answerOptions[3]);
        break;
      case 'Digit5':
      case 'Numpad5':
        handleAnswer(answerOptions[4]);
        break;
      case 'Digit6':
      case 'Numpad6':
        handleAnswer("Don't know");
        break;
      case 'Enter':
      case 'NumpadEnter':
        nextWord();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      {!isGameFinished ? (
        <section className="game game--audiochallenge">
          <h2>Audiochallenge Page</h2>
          <div className="audio">
            <AudioBtn src={wordAudio} />
          </div>
          {isAnswered && <RightAnswerCard word={currentWord} />}
          <OptionsContainer options={answerOptions} clickHandler={(e) => handleClick(e)} />
          <Button type="primary" disabled className="audiochallenge__btn-next">Next word</Button>
        </section>
      ) : (
        <ResultGame
          rightWords={rightAnswers}
          wrongWords={wrongAnswers}
          clickHandler={restartGame}
        />
      )}
      <div className="leave-btn">
        <LeaveGameButton setVisible={setVisibleLeaveModal} />
        {
          isVisibleLeaveModal
          && (
            <ConfirmModal
              isVisible={isVisibleLeaveModal}
              setVisible={setVisibleLeaveModal}
            />
          )
        }
      </div>

    </>
  );
};

export default Audiochallenge;
