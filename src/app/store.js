import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { BATCH } from 'redux-batched-actions';

function getSagaMiddleware() {
  const onError = (err) => console.error(err);
  const emitter = (emit) => (action) => {
    const { type, payload } = action;
    if (type === BATCH && Array.isArray(payload)) {
      payload.forEach(emit);
      return;
    }

    emit(action);
  };

  return createSagaMiddleware({ onError, emitter });
}

const sagaMiddleware = getSagaMiddleware();
const enhancer = compose(applyMiddleware(sagaMiddleware));

export default function configureStore(
  initialState = {},
  rootReducer,
  rootSaga,
) {
  const store = createStore(rootReducer, initialState, enhancer);
  store.close = () => store.dispatch(END);
  sagaMiddleware.run(rootSaga);
  return store;
}
