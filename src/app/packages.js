import { enableBatching } from 'redux-batched-actions';
import { combineReducers } from 'redux';
import { spawn, all } from 'redux-saga/effects';

const prepSagas = (sagas = {}, options = []) =>
  Object.values(sagas).map((saga) => spawn(saga, ...options));

function sagaCreator(sagas) {
  return function* rootSaga(...options) {
    yield all(prepSagas(sagas, options));
  };
}

const packages = {
  reducers: {
    ...require('../token').reducers,
  },
  sagas: {
    ...require('../token').sagas,
  },
};

const rootReducer = enableBatching(combineReducers(packages.reducers));
const rootSaga = sagaCreator(packages.sagas);

export { packages, rootReducer, rootSaga };
