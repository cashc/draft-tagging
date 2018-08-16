import {
  FETCH_TOKENS,
  SUBMIT_TOKENS,
  SET_CONNECT_SEARCH_QUERY,
  SEARCH_CONNECT,
  STOP_CONNECT_SEARCH_LOADING,
  SET_CONNECT_SEARCH_TOKENS,
  SET_SELECTED_TOKEN,
  UPDATE_SELECTED_TOKEN,
  SET_SELECTED_TOKEN_CATEGORY,
  RESET_CONNECT_SEARCH,
  FETCH_SEARCH_CONNECT,
  OPEN_MODAL,
  CLOSE_MODAL,
} from './action-types';

export const fetchTokens = (payload) => ({
  type: FETCH_TOKENS,
  payload,
});

export const submitTokens = (payload) => ({
  type: SUBMIT_TOKENS,
  payload,
});

export function setConnectSearchQuery({ query }) {
  return {
    type: SET_CONNECT_SEARCH_QUERY,
    payload: { query },
  };
}

export function searchConnect({ query }) {
  return {
    type: SEARCH_CONNECT,
    payload: { query },
  };
}

export function fetchConnectSearch({ query }) {
  return {
    type: FETCH_SEARCH_CONNECT,
    payload: { query },
  };
}

export function stopConnectSearchLoading({ query }) {
  return {
    type: STOP_CONNECT_SEARCH_LOADING,
    payload: { query },
  };
}

export const setConnectSearchTokens = ({ query, tokens }) => ({
  type: SET_CONNECT_SEARCH_TOKENS,
  payload: { query, tokens },
});

export const setSelectedToken = ({ selectedToken }) => ({
  type: SET_SELECTED_TOKEN,
  payload: { selectedToken },
});

export const updateSelectedToken = ({ selectedToken, updatedToken }) => ({
  type: UPDATE_SELECTED_TOKEN,
  payload: { selectedToken, updatedToken },
});

export const setSelectedTokenCategory = ({ selectedToken, category }) => ({
  type: SET_SELECTED_TOKEN_CATEGORY,
  payload: { selectedToken, category },
});

export const resetConnectSearch = () => ({
  type: RESET_CONNECT_SEARCH,
});

export const openModal = ({ selectedToken }) => ({
  type: OPEN_MODAL,
  payload: { selectedToken },
});

export const closeModal = () => ({
  type: CLOSE_MODAL,
});
