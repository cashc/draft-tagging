import { Component } from 'react';
import {
  Editor,
  EditorState,
  CompositeDecorator,
  SelectionState,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import lodash from 'lodash';
const { debounce } = lodash;
import { h } from 'react-hyperscript-helpers';
import styled from 'styled-components';

import { queryHasToken } from '../util';
import { NEW_TOKEN_CATEGORY } from '../constants';
import { SearchTokenConn } from './search-token';

const TOKEN_ENTITY_TYPE = 'TOKEN';
const QUERY_TOKEN_DEBOUNCE = 1000;
const HIGHLIGHT_SELECTION_DEBOUNCE = 300;
const HANDLED = 'handled';
const DRAFT_JS_DIV = 'public-DraftStyleDefault-block';
const RIGHT_HANDLE = 'draggable-handle right-handle';
const LEFT_HANDLE = 'draggable-handle left-handle';
const PLACEHOLDER_TEXT = 'Search Connections';

const SearchContainer = styled.div`
  display: flex;
  min-height: 48px;
  border: 2px solid ${({ theme }) => theme.borderPrimary};
  border-radius: 7px;
`;

const SearchInput = styled.div`
  width: calc(100% - 40px);
  overflow: hidden;
  padding: 12px 32px 13px 32px;
  font-size: 18px;
  letter-spacing: -0.5px;
  text-align: left;
  color: ${(props) => {
    if (props.hasText) return props.theme.foregroundPrimary;
    return props.theme.foregroundPlaceholder;
  }};
`;

const EditorParent = styled.div``;

export class HighlightedSearchTokens extends Component {
  static defaultProps = {
    query: '',
    tokens: [],
    handleSearch: () => {},
    updateToken: () => {},
    disableTyping: false,
  };

  state = {
    editorState: EditorState.createEmpty(editorDecorators),
    displayTokens: false,
    tokenBeingResized: null,
    resizedToken: null,
  };

  componentWillMount() {
    const { editorState } = this.state;
    const { query } = this.props;

    const block = { text: query };
    const newContentState = convertFromRaw({ blocks: [block], entityMap: {} });
    const newEditorState = EditorState.push(editorState, newContentState);

    this.onChange(newEditorState);
  }

  componentWillReceiveProps() {
    this.highlightTokensTrailing();
  }

  componentDidMount() {
    document.addEventListener('selectionchange', this.onSelectionChangeHandle);
    if (this.element)
      this.element.addEventListener('mouseup', this.onMouseUpHandle);
  }

  componentWillUnmount() {
    document.removeEventListener(
      'selectionchange',
      this.onSelectionChangeHandle,
    );

    this.highlightTokensTrailing.cancel();

    if (this.element)
      this.element.removeEventListener('mouseup', this.onMouseUpHandle);
  }

  highlightTokens = (displayTokens, newEditorState = null) => {
    const { editorState } =
      newEditorState === null ? this.state : newEditorState;
    const { tokens } = this.props;
    const text = getTextFromEditorState(editorState);

    const clearedEditorState = clearEntities(editorState);
    if (!shouldRenderEntities(text, tokens, displayTokens)) {
      const clearedFocusedEditorState = EditorState.acceptSelection(
        clearedEditorState,
        editorState.getSelection(),
      );
      this.setState({ editorState: clearedFocusedEditorState });
      return clearedFocusedEditorState;
    }

    const highlightedEditorState = applyEntitiesToTokens(
      clearedEditorState,
      tokens,
      { onHandleMouseDown: this.onHandleMouseDown },
    );

    const highlightedFocusedEditorState = EditorState.acceptSelection(
      highlightedEditorState,
      editorState.getSelection(),
    );

    this.setState({ editorState: highlightedFocusedEditorState });

    return highlightedFocusedEditorState;
  };

  // triggered on the trailing edge to allow new props to be set before calling
  highlightTokensTrailing = debounce(() => {
    const { displayTokens } = this.state;
    this.highlightTokens(displayTokens);
  }, 0);

  onChange = (newEditorState) => {
    const { handleSearch, query, disableTyping } = this.props;
    const { editorState } = this.state;

    const text = getTextFromEditorState(editorState);
    const newText = getTextFromEditorState(newEditorState);

    const textIsIdentical = newText === text && newText === query;

    if (disableTyping) {
      if (text !== '' && newText !== text) {
        return;
      }
    }

    if (textIsIdentical) {
      const { start, end } = getSelectionStartAndEnd(newEditorState);
      // check to see if anchor and focus are in the same position
      if (start !== end) {
        this.highlightSelectionOnChange(newEditorState);
      } else {
        this.highlightTokensTrailing();
      }

      // need to set state immediately to see selection range highlighting
      this.setState({ editorState: newEditorState });
      return;
    }

    // if you select something, press delete immediately, cancel before painting new token
    this.highlightSelectionOnChange.cancel();

    const clearedEditorState = clearEntities(newEditorState);
    this.setState({ editorState: clearedEditorState, displayTokens: false });

    if (newText !== query) handleSearch(newText);
    this.highlightTokensOnChange();
  };

  highlightTokensOnChange = debounce(() => {
    this.setState({ displayTokens: true });
    this.highlightTokens(true);
  }, QUERY_TOKEN_DEBOUNCE);

  highlightSelection = (newEditorState) => {
    const { displayTokens } = this.state;
    const editorState = this.highlightTokens(displayTokens, {
      editorState: newEditorState,
    });

    const { start, end } = getSelectionStartAndEnd(editorState);
    const text = getTextFromEditorState(editorState);
    const token = text.substr(start, end - start);
    const newTokenSelection = {
      token,
      start,
      end,
      category: NEW_TOKEN_CATEGORY,
    };

    const selectedEditorState = applyEntityToToken(
      editorState,
      newTokenSelection,
    );
    const focusedEditorState = EditorState.acceptSelection(
      selectedEditorState,
      newEditorState.getSelection(),
    );

    return focusedEditorState;
  };

  highlightSelectionOnChange = debounce((editorState) => {
    this.setState({ editorState: this.highlightSelection(editorState) });
  }, HIGHLIGHT_SELECTION_DEBOUNCE);

  onHandleMouseDown = (isLeft, token) => {
    this.setState({
      tokenBeingResized: token,
      resizedToken: { ...token, isLeft },
    });
  };

  onMouseUpHandle = () => {
    const { tokenBeingResized, resizedToken } = this.state;
    const { updateToken } = this.props;

    if (tokenBeingResized === null) return;

    // dispatch action setting resizedToken
    updateToken(tokenBeingResized, resizedToken);
    this.setState({ tokenBeingResized: null });
  };

  onSelectionChangeHandle = () => {
    const { tokenBeingResized, resizedToken } = this.state;
    if (tokenBeingResized === null) return;

    const selection = window.getSelection();
    const focus = getSelectionFocus(selection, this.element);
    if (isNaN(focus)) return;

    const { start, end } = resizedToken;
    // only update token if focus has moved from token start/end
    if (start === focus || end === focus) return;
    // make selection at single point, instead of a range
    selection.collapse(selection.focusNode, selection.focusOffset);

    const { query } = this.props;
    const { editorState } = this.state;

    const newResizedToken = getResizedToken(query, resizedToken, focus);

    const newEditorState = updateTokenEntity(
      editorState,
      resizedToken,
      newResizedToken,
      focus,
    );

    this.setState({
      resizedToken: newResizedToken,
      editorState: newEditorState,
    });
  };

  reset = () => {
    const { handleSearch } = this.props;
    handleSearch('');

    this.highlightTokensOnChange.cancel();
    const editorState = EditorState.createEmpty(editorDecorators);
    const selection = editorState.getSelection();
    const focusedEditorState = EditorState.forceSelection(
      editorState,
      selection,
    );
    this.setState({ editorState: focusedEditorState });
  };

  searchOnClick = () => {
    const { editorState } = this.state;
    const { handleSearch } = this.props;
    const text = getTextFromEditorState(editorState);
    handleSearch(text, false);
  };

  editorHandleReturn = () => {
    this.searchOnClick();
    return HANDLED;
  };

  setElementRef = (c) => {
    if (!c) return;
    const children = c.getElementsByClassName(DRAFT_JS_DIV);
    if (children.length > 0) this.element = children[0];
  };

  render() {
    const { editorState } = this.state;
    const hasText = editorState.getCurrentContent().hasText();
    return h(SearchContainer, [
      h(SearchInput, { hasText }, [
        h(
          EditorParent,
          {
            innerRef: (c) => this.setElementRef(c),
          },
          [
            h(Editor, {
              editorState,
              onChange: this.onChange,
              handleReturn: this.editorHandleReturn,
              placeholder: PLACEHOLDER_TEXT,
            }),
          ],
        ),
      ]),
    ]);
  }
}

export const editorDecorators = new CompositeDecorator([
  { strategy: tokenStrategy, component: Token },
]);

function Token(props) {
  const { entityKey, contentState, children } = props;
  const { data } = contentState.getEntity(entityKey);

  return h(SearchTokenConn, { children, ...data });
}

// create a token from the query with the provided start and end indicies
export const createToken = (startIndex, endIndex, query, category) => {
  const start = startIndex >= 0 ? startIndex : 0;
  const end = endIndex < query.length ? endIndex : query.length;
  const length = end - start;
  const token = query.substr(start, length);
  return { start, end, token: token, category };
};

export const getResizedToken = (query, token, focus) => {
  const { isLeft } = token;
  let focusWithinEntityRange;
  let start;
  let end;

  if (isLeft) {
    focusWithinEntityRange = focus < token.end;
    start = focusWithinEntityRange ? focus : token.end;
    end = focusWithinEntityRange ? token.end : focus;
  } else {
    focusWithinEntityRange = focus > token.start;
    start = focusWithinEntityRange ? token.start : focus;
    end = focusWithinEntityRange ? focus : token.start;
  }

  const resizedToken = createToken(start, end, query, token.category);
  return { ...resizedToken, isLeft: focusWithinEntityRange ? isLeft : !isLeft };
};

// Returns editor state with resized token at new start and end indicies.
export const updateTokenEntity = (
  editorState,
  currentToken,
  resizedToken,
  focus,
) => {
  let contentState = editorState.getCurrentContent();
  const block = contentState.getFirstBlock();
  const blockKey = block.getKey();
  const selectionState = SelectionState.createEmpty(blockKey);
  const entityKey = block.getEntityAt(currentToken.start);

  if (
    currentToken.start < resizedToken.start ||
    currentToken.end > resizedToken.end
  ) {
    const tokenSelection = selectionState.merge({
      anchorOffset: currentToken.start,
      focusOffset: currentToken.end,
    });
    const clearedContentState = Modifier.applyEntity(
      contentState,
      tokenSelection,
      null,
    );
    contentState = clearedContentState;
  }

  const resizedTokenSelection = selectionState.merge({
    anchorOffset: resizedToken.start,
    focusOffset: resizedToken.end,
  });
  const newContentState = Modifier.applyEntity(
    contentState,
    resizedTokenSelection,
    entityKey,
  );

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'update-entity-selection',
  );

  const focusedSelection = selectionState.merge({
    anchorOffset: focus,
    focusOffset: focus,
  });

  // must set editorState focus to match window.getSelection() focus
  const newFocusedEditorState = EditorState.forceSelection(
    newEditorState,
    focusedSelection,
  );

  return newFocusedEditorState;
};

function tokenStrategy(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    if (entityKey === null) return false;

    const entity = contentState.getEntity(entityKey);
    const entityType = entity.getType();

    return entityType === TOKEN_ENTITY_TYPE;
  }, callback);
}

export const highlightSelection = (newEditorState) => {
  const { start, end } = getSelectionStartAndEnd(newEditorState);
  const text = getTextFromEditorState(newEditorState);
  const token = text.substr(start, end - start);
  const newTokenSelection = { token, start, end, category: NEW_TOKEN_CATEGORY };

  const editorState = applyEntityToToken(newEditorState, newTokenSelection);
  const focusedEditorState = EditorState.forceSelection(
    editorState,
    newEditorState.getSelection(),
  );

  return focusedEditorState;
};

export const applyEntitiesToTokens = (editorState, tokens, props) =>
  tokens.reduce(
    (stateAccumulator, token) =>
      applyEntityToToken(stateAccumulator, token, props),
    editorState,
  );

const applyEntityToToken = (editorState, token, props = {}) => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    TOKEN_ENTITY_TYPE,
    'MUTABLE',
    { token, ...props },
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const { start, end } = token;
  const blockKey = contentStateWithEntity.getFirstBlock().getKey();
  const selectionState = SelectionState.createEmpty(blockKey);
  const tokenSelection = selectionState.merge({
    anchorOffset: start,
    focusOffset: end,
  });
  const newContentState = Modifier.applyEntity(
    contentStateWithEntity,
    tokenSelection,
    entityKey,
  );

  const updatedEditorState = EditorState.push(
    editorState,
    newContentState,
    TOKEN_ENTITY_TYPE,
  );
  return updatedEditorState;
};

export const shouldRenderEntities = (query, tokens = [], displayTokens) => {
  if (!displayTokens) return false;
  if (tokens.length === 0) return false;
  if (!query) return false;
  if (!queryHasToken(query, tokens)) return false;
  return true;
};

export const clearEntities = (editorState) => {
  if (!shouldClearEntities(editorState)) return editorState;

  const editorTextLength = getTextFromEditorState(editorState).length;
  const contentState = editorState.getCurrentContent();
  const blockKey = contentState.getFirstBlock().getKey();
  const selectionState = SelectionState.createEmpty(blockKey);

  const tokenSelection = selectionState.merge({
    anchorOffset: 0,
    focusOffset: editorTextLength,
  });

  const newContentState = Modifier.applyEntity(
    contentState,
    tokenSelection,
    null,
  );

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    TOKEN_ENTITY_TYPE,
  );

  const focusedEditorState = EditorState.forceSelection(
    newEditorState,
    editorState.getSelection(),
  );

  return focusedEditorState;
};

export const shouldClearEntities = (editorState) => {
  const text = getTextFromEditorState(editorState);
  if (!text) return false;

  const rawContent = convertToRaw(editorState.getCurrentContent());
  if (!Object.keys(rawContent.entityMap).length) return false;

  return true;
};

export const getTextFromEditorState = (editorState) => {
  const contentState = editorState.getCurrentContent();
  return contentState.getPlainText();
};

export const getSelectionStartAndEnd = (editorState) => {
  const selection = editorState.getSelection();
  const start = selection.getStartOffset();
  const end = selection.getEndOffset();
  return { start, end };
};

/*
  Returns location of focusOffset in draft-js search div.
   - Necessary because window.getSelection() returns focusOffset within a single Node.
   - We want the focusOffset within the parent div (draft-js search div).
*/
const getSelectionFocus = (selection, searchElement) => {
  // children of searchElement are the <span>s in the search div
  const searchChildren = searchElement.children;
  if (!searchElement.contains(selection.focusNode)) return;

  // loops through the div, adding the span's length to counter until we hit the span with focus
  let focus = 0;
  for (let index = 0; index < searchChildren.length; index++) {
    const span = searchChildren[index];
    const hasEntity = span.children.length > 1;
    const node = hasEntity ? span.children[2].children[0] : span.children[0];
    // when focus node found, we check which part of span has focus to tell where focusOffset is
    if (span.contains(selection.focusNode)) {
      // focus in left handle means add 0, focus in right handle means add entire length of span
      if (selection.focusNode.className === RIGHT_HANDLE)
        focus += node.innerHTML.length;
      else if (selection.focusNode.className !== LEFT_HANDLE)
        // focus in text means add focusOffset
        focus += selection.focusOffset;
      break;
    }
    focus += node.innerHTML.length;
  }

  return focus;
};
