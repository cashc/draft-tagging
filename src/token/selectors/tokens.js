import { createSelector } from 'reselect';
import { get, sortBy } from 'lodash';

import { getCategoryTitle, rankCategory } from '../util';

export const getConnectSearch = (state) => state.connectSearch || {};
export const getSelectedToken = (state) => state.selectedToken;
export const getConnectSearchQuery = (state) =>
  getConnectSearch(state).query || '';
export const getConnectSearchLoading = (state) =>
  getConnectSearch(state).loading;
export const getConnectSearchTokens = (state) =>
  getConnectSearch(state).tokens || [];
export const getConnectSearchShouldUseTokens = (state) =>
  getConnectSearch(state).searchWithTokens;
export const getSearchTokensHaveChanged = (state) =>
  getConnectSearch(state).tokensHaveChanged;

export const getSortedTokens = createSelector(
  getConnectSearchTokens,
  (tokens) => sortBy(tokens, (token) => token.start),
);

export const getTokensForWords = createSelector(getSortedTokens, (tokens) => {
  const tokensByWord = tokens.reduce((tokenObjAccumulator, token) => {
    const tokenWord = token.token;
    if (!tokenWord) return tokenObjAccumulator;

    const existing = get(tokenObjAccumulator, tokenWord, []);
    const updated = [...existing, token];
    return { ...tokenObjAccumulator, [tokenWord]: updated };
  }, {});
  return Object.values(tokensByWord);
});

export const getTokensForWordsTransformed = createSelector(
  getTokensForWords,
  (tokensForWords) =>
    tokensForWords.map((tokensForWord) => tokensForWord.map(transformToken)),
);

function transformToken(token) {
  const { category } = token;
  const categoryTitle = getCategoryTitle(category);
  const newToken = {
    ...token,
    categoryTitle,
  };
  return newToken;
}

export const getTokensForWordsSorted = createSelector(
  getTokensForWordsTransformed,
  (tokensForWords) =>
    tokensForWords.map((tokensForWord) => sortBy(tokensForWord, rankToken)),
);

function rankToken(token) {
  const { category } = token;
  return rankCategory(category);
}
