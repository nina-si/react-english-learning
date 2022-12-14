import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './auth';
import currentGameSlice from './currentGame';
import sprintGameSlice from './sprintGame';
import statisticSlice from './statistic';
import textbookSlice from './textbook';

export default combineReducers({
  auth: authSlice,
  currentGame: currentGameSlice,
  sprintGame: sprintGameSlice,
  textbook: textbookSlice,
  statistic: statisticSlice,
});
