import { h } from 'react-hyperscript-helpers';
import styled from 'styled-components';

import { SearchBarConn, SearchTokenChipConn, ChooseTokenCategoryConn } from '../token/components';

const AppDiv = styled.div`
  height: 100vh;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 700px;
  width: 90%;
`;

const DEFAULT_TEXT = 'Hello, world!\nThis is some default text.';

export const App = () =>
h(AppDiv, [
  h(Container, [
    h(SearchBarConn, { defaultQuery: DEFAULT_TEXT, disableTyping: true }),
    h(SearchTokenChipConn),
    h(ChooseTokenCategoryConn),
  ]),
]);
