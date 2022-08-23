import { createSelector } from 'reselect';
import { RootState } from '../../index';

const selectTextbookReducer = (state: RootState) => state.textbook;

export const selectCurrentPageData = createSelector(
  [selectTextbookReducer],
  (textbookSlice) => textbookSlice.currentPageData,
);

export const selectCurrentGroup = createSelector(
  [selectCurrentPageData],
  (currentPageData) => currentPageData.group,
);

export const selectCurrentPage = createSelector(
  [selectCurrentPageData],
  (currentPageData) => currentPageData.page,
);