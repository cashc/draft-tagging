import {
  SET_CONNECT_SEARCH_QUERY,
  SEARCH_CONNECT,
  STOP_CONNECT_SEARCH_LOADING,
  SET_CONNECT_SEARCH_TOKENS,
  SET_SELECTED_TOKEN,
  UPDATE_SELECTED_TOKEN,
  SET_SELECTED_TOKEN_CATEGORY,
  RESET_CONNECT_SEARCH,
} from '../action-types';
import { DELETE_TOKEN_CATEGORY } from '../constants';
import { isSameToken, queryHasToken, filterSupportedTokens } from '../util';

export const connectSearchDefaultState = {
  query: '',
  loading: true,
  tokens: [],
  selectedToken: {},
  searchWithTokens: false,
  tokensHaveChanged: false,
};

export function connectSearch(state = connectSearchDefaultState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case SET_CONNECT_SEARCH_QUERY: {
      const { query } = payload;

      const queryHasChanged = query !== state.query;
      const tokens = queryHasChanged ? [] : state.tokens;
      const searchWithTokens = queryHasChanged ? false : state.searchWithTokens;

      return {
        ...state,
        loading: false,
        query,
        tokens,
        searchWithTokens,
        tokensHaveChanged: false,
      };
    }
    case SEARCH_CONNECT: {
      const { query } = payload;

      return {
        ...state,
        loading: true,
        query,
        selectedToken: {},
        tokensHaveChanged: false,
      };
    }
    case STOP_CONNECT_SEARCH_LOADING: {
      const { query } = payload;

      if (query === state.query) {
        return {
          ...state,
          loading: false,
          selectedToken: {},
        };
      }

      return state;
    }
    case SET_CONNECT_SEARCH_TOKENS: {
      const { query, tokens } = payload;

      if (query !== state.query) return state;

      if (!queryHasToken(query, tokens)) return state;

      const supportedTokens = filterSupportedTokens(tokens);

      return {
        ...state,
        tokens: supportedTokens,
      };
    }
    case SET_SELECTED_TOKEN: {
      const { selectedToken } = payload;
      return {
        ...state,
        selectedToken,
        tokensHaveChanged: true,
      };
    }
    case UPDATE_SELECTED_TOKEN: {
      const { tokens } = state;
      const { updatedToken } = payload;
      const selectedToken = payload.selectedToken;

      if (updatedToken === undefined) return state;

      const { start, end } = updatedToken;
      const shouldDeleteToken = start === end;

      const tokensToSet = tokens.reduce((accumulator, token) => {
        if (isSameToken(token, selectedToken)) {
          if (shouldDeleteToken) return accumulator;
          return [...accumulator, updatedToken];
        }
        return [...accumulator, token];
      }, []);
      return {
        ...state,
        selectedToken,
        tokens: tokensToSet,
        searchWithTokens: true,
        tokensHaveChanged: true,
      };
    }
    case SET_SELECTED_TOKEN_CATEGORY: {
      const { category } = payload;
      const { tokens } = state;
      const selectedToken = payload.selectedToken;

      let missing = true;
      const newToken = { ...selectedToken, category };
      if (newToken.token === undefined) return state;

      const tokensToSet = tokens.reduce((accumulator, token) => {
        if (isSameToken(token, selectedToken) || isSameToken(token, newToken)) {
          missing = false;
          if (category === DELETE_TOKEN_CATEGORY) return accumulator;
          return [...accumulator, newToken];
        }
        return [...accumulator, token];
      }, []);

      if (missing && category !== DELETE_TOKEN_CATEGORY)
        tokensToSet.push(newToken);

      return {
        ...state,
        selectedToken,
        tokens: tokensToSet,
        searchWithTokens: true,
        tokensHaveChanged: true,
      };
    }
    case RESET_CONNECT_SEARCH: {
      return {
        ...connectSearchDefaultState,
        loading: false,
      };
    }
    default:
      return state;
  }
}
