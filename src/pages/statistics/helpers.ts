import { IUserWord } from "../../interfaces/IUserWord";
import { gameType } from "../../store/slices/currentGame";
import { WordToTrain } from "../../store/types";
import { addAnswersToSliceArgs } from "../audiochallenge/Audiochallenge";

type UpdateWordType = {newLearned: boolean; newStatistic:IUserWord}

export const checkDate = (statDate:string, today: string) => {
  return statDate === today;
}

export const countNewWords = (data: WordToTrain[]) => {
  return data.filter(item => item.optional.isNew !== false).length;
}

export const updateWord = (data: addAnswersToSliceArgs, game: gameType):UpdateWordType => {
  const wasLearned = data.answer.optional.isLearned;
  const gamesStat = updateGamesStat(game, data);
  const newRightAnswersCounter = data.answer.optional.rightAnswersCounter + 1;
  const isLearned = checkIfLearned(newRightAnswersCounter, data.answer.difficulty === 'difficult');
  const newLearned = isLearned && !wasLearned;
  return {newLearned, newStatistic: {difficulty:data.answer.difficulty, optional: {isLearned, isNew: false, rightAnswersCounter:newRightAnswersCounter, ...gamesStat}}}
}

const updateGamesStat = (gameType:gameType, data: addAnswersToSliceArgs) => {
  let gamesStat = {sprint: data.answer.optional.sprint, audiochallenge: data.answer.optional.audiochallenge};
  if (gameType === 'audiochallenge' && data.isRight) {
    gamesStat = {sprint: {...data.answer.optional.sprint}, audiochallenge: {rightCounter: data.answer.optional.audiochallenge.rightCounter + 1,
      wrongCounter: data.answer.optional.audiochallenge.wrongCounter}}
  }
  if (gameType === 'audiochallenge' && !data.isRight) {
    gamesStat = {sprint: {...data.answer.optional.sprint}, audiochallenge: {rightCounter: data.answer.optional.audiochallenge.rightCounter,
      wrongCounter: data.answer.optional.audiochallenge.wrongCounter + 1}}
  }
  if (gameType === 'sprint' && data.isRight) {
    gamesStat = {sprint: {rightCounter: data.answer.optional.sprint.rightCounter + 1,
      wrongCounter: data.answer.optional.sprint.wrongCounter}, audiochallenge: {...data.answer.optional.audiochallenge}}
  }
  if (gameType === 'sprint' && !data.isRight) {
    gamesStat = {sprint: {rightCounter: data.answer.optional.sprint.rightCounter,
      wrongCounter: data.answer.optional.sprint.wrongCounter + 1}, audiochallenge: {...data.answer.optional.audiochallenge}}
  }
  return gamesStat;
}

const checkIfLearned = (counter: number, isDifficult: boolean) => {
  if (counter >= 3 && !isDifficult) {
    return true;
  } 
  if (counter >= 5 && isDifficult) {
    return true;
  }
  return false;
}
