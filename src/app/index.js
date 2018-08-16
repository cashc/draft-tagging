import ReactDOM from 'react-dom';
import { h } from 'react-hyperscript-helpers';

import { Provider } from './provider';
import configureStore from './store';
import { rootReducer, rootSaga, packages } from './packages';
import { App } from './app';

const init = () => {
  const store = configureStore(
    {},
    rootReducer,
    rootSaga,
  );
  window.reduxStore = store;

  ReactDOM.render(
    h(Provider, { store, useRouter: false }, [
      h(App, { modals: packages.modals }),
    ]),
    document.getElementById('app'),
  );
};

export default init;
