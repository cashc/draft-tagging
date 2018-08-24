import { createStore } from 'redux';

const setupApp = (initialState = {}, reducer = (state = {}) => state) =>
  createStore(reducer, initialState);

export const createStoreOptions = (initialState, reducer) => {
  const store = setupApp(initialState, reducer);
  return { context: { store } };
};
