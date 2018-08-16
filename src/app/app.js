import { h } from 'react-hyperscript-helpers';
import styled from 'styled-components';

import { SearchBarConn, SearchTokenChipConn } from '../token/components';

const AppDiv = styled.div`
  min-height: 90vh;
  max-width: 700px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DEFAULT_TEXT = 'Hello, world!\nThis is some default text.';

export const App = () =>
h(AppDiv, [
  h(SearchBarConn, { defaultQuery: DEFAULT_TEXT, disableTyping: true }),
  h(SearchTokenChipConn),
]);
