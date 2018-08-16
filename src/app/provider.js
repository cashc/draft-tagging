import { h } from 'react-hyperscript-helpers';
import { Provider as RRProvider } from 'react-redux';
import { Children, createContext } from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { ThemeProvider } from 'styled-components';

import { THEMES } from './theme';

const RouteContext = createContext();
const RouteFillProvider = RouteContext.Provider;

function ThemeProviderConn({ theme = THEMES.default, children }) {
  return h(ThemeProvider, { theme }, [children]);
}

export function Provider({ store, useRouter = true, routes, children = [] }) {
  if (useRouter && !store.history)
    console.error('Must attach history to store.');
  const { history } = store;

  const providerChildren = useRouter
    ? [h(ConnectedRouter, { history }, Children.toArray(children))]
    : Children.toArray(children);

  return h(RRProvider, { store }, [
    h(ThemeProviderConn, [
      h(
        RouteFillProvider,
        { value: useRouter ? routes : {} },
        providerChildren,
      ),
    ]),
  ]);
}
