import { shallow } from 'enzyme';
import { h } from 'react-hyperscript-helpers';
import {
  EditorState,
  ContentState,
  convertToRaw,
  SelectionState,
} from 'draft-js';
import { createStoreOptions } from '../../../util';

import {
  HighlightedSearchTokens,
  applyEntitiesToTokens,
  shouldRenderEntities,
  clearEntities,
  shouldClearEntities,
  getSelectionStartAndEnd,
  editorDecorators,
  createToken,
  getResizedToken,
  updateTokenEntity,
} from '../../components/highlighted-search-tokens';

jest.mock('draft-js/lib/generateRandomKey', () => () => '123');
jest.useFakeTimers();

describe('HighlightedSearchTokens', () => {
  describe('default state', () => {
    const wrapper = shallow(h(HighlightedSearchTokens), createStoreOptions());

    it('should have empty editor', () => {
      expect(
        wrapper
          .state('editorState')
          .getCurrentContent()
          .getPlainText(),
      ).toEqual('');
    });
  });

  describe('shouldRenderEntities', () => {
    it('should not render', () => {
      const displayTokens = false;
      const tokens = ['hi'];
      const query = 'hello';
      expect(shouldRenderEntities(query, tokens, displayTokens)).toEqual(false);
    });

    it('should not render', () => {
      const displayTokens = true;
      const tokens = [];
      const query = 'hello';
      expect(shouldRenderEntities(query, tokens, displayTokens)).toEqual(false);
    });

    it('should not render', () => {
      const displayTokens = true;
      const tokens = ['hi'];
      const query = '';
      expect(shouldRenderEntities(query, tokens, displayTokens)).toEqual(false);
    });

    it('should not render', () => {
      const displayTokens = true;
      const tokens = [{ start: 1, end: 2, token: 'hi' }];
      const query = 'hi';
      expect(shouldRenderEntities(query, tokens, displayTokens)).toEqual(false);
    });

    it('should render (true)', () => {
      const displayTokens = true;
      const tokens = [{ start: 0, end: 2, token: 'hi' }];
      const query = 'hi';
      expect(shouldRenderEntities(query, tokens, displayTokens)).toEqual(true);
    });
  });

  describe('when adding and removing entities', () => {
    it('should add entities', () => {
      const tokens = [
        { start: 0, end: 10, token: 'connectors', category: 'internal_tag' },
        { start: 13, end: 18, token: 'Trove', category: 'company' },
      ];
      const query = 'connectors a Trove';
      const editorState = EditorState.createWithContent(
        ContentState.createFromText(query),
      );
      const editorWithEntities = applyEntitiesToTokens(editorState, tokens);
      expect(shouldClearEntities(editorWithEntities)).toEqual(true);
    });

    it('should add entities and then clear all of them', () => {
      const tokens = [
        { start: 0, end: 10, token: 'connectors', category: 'internal_tag' },
        { start: 13, end: 18, token: 'Trove', category: 'company' },
      ];
      const query = 'connectors a Trove';
      const editorState = EditorState.createWithContent(
        ContentState.createFromText(query),
      );
      const editorWithEntities = applyEntitiesToTokens(editorState, tokens);
      const editorWithoutEntities = clearEntities(editorWithEntities);
      expect(shouldClearEntities(editorWithoutEntities)).toEqual(false);
    });
  });

  describe('when editor is changed', () => {
    const handleSearch = jest.fn();
    const wrapper = shallow(
      h(HighlightedSearchTokens, {
        handleSearch,
      }),
    );

    const editor = wrapper.find('DraftEditor');
    const es = EditorState.createWithContent(
      ContentState.createFromText('a'),
      editorDecorators,
    );
    const nextEditorState = EditorState.moveFocusToEnd(es);
    editor.props().onChange(nextEditorState);

    it('should update the editor state', () => {
      expect(
        wrapper
          .state('editorState')
          .getCurrentContent()
          .getPlainText(),
      ).toEqual('a');
    });

    it('should call handleSearch', () => {
      expect(handleSearch).toHaveBeenCalled();
    });
  });

  describe('when given query to render', () => {
    const handleSearch = jest.fn();
    const query = 'gimme people';
    const wrapper = shallow(
      h(HighlightedSearchTokens, {
        handleSearch,
        query,
      }),
    );

    const editor = wrapper.find('DraftEditor');
    const es = EditorState.createWithContent(
      ContentState.createFromText(query),
      editorDecorators,
    );
    const nextEditorState = EditorState.moveFocusToEnd(es);
    editor.props().onChange(nextEditorState);

    it('returns correct query', () => {
      expect(
        wrapper
          .state('editorState')
          .getCurrentContent()
          .getPlainText(),
      ).toEqual(query);
    });

    it('doesnt call handleSearch because query is same as new editor text', () => {
      expect(handleSearch).not.toHaveBeenCalled();
    });
  });

  describe('when resetting search bar', () => {
    const handleSearch = jest.fn();
    const query = 'gimme people';
    const wrapper = shallow(
      h(HighlightedSearchTokens, {
        handleSearch,
        query: '',
      }),
    );

    const editor = wrapper.find('DraftEditor');
    const es = EditorState.createWithContent(
      ContentState.createFromText(query),
      editorDecorators,
    );
    const nextEditorState = EditorState.moveFocusToEnd(es);
    editor.props().onChange(nextEditorState);

    it('resets content', () => {
      wrapper.instance().reset();
      expect(
        wrapper
          .state('editorState')
          .getCurrentContent()
          .getPlainText(),
      ).toEqual('');
      expect(handleSearch).toHaveBeenCalled();
    });
  });

  describe('when given tokens to render', () => {
    const tokens = [
      { start: 0, end: 10, token: 'connectors', category: 'internal_tag' },
      { start: 13, end: 18, token: 'Trove', category: 'company' },
    ];
    const query = 'connectors a Trove';
    const wrapper = shallow(
      h(HighlightedSearchTokens, {
        tokens,
        query,
      }),
    );
    const editor = wrapper.find('DraftEditor');
    const es = EditorState.createWithContent(
      ContentState.createFromText(query),
      editorDecorators,
    );
    const nextEditorState = EditorState.moveFocusToEnd(es);
    editor.props().onChange(nextEditorState);

    it('applies entites to tokens', () => {
      const editorState = wrapper.instance().highlightTokens(true);
      expect(wrapper.state().editorState).toBe(editorState);
    });
  });

  describe('when modifying query with tokens', () => {
    const tokens = [
      { start: 0, end: 10, token: 'connectors', category: 'internal_tag' },
      { start: 13, end: 18, token: 'Trove', category: 'company' },
    ];
    const query = 'connectors a Trove';
    const wrapper = shallow(
      h(HighlightedSearchTokens, {
        tokens,
        query: '',
      }),
    );
    const editor = wrapper.find('DraftEditor');
    const es = EditorState.createWithContent(
      ContentState.createFromText(query),
      editorDecorators,
    );
    const nextEditorState = EditorState.moveFocusToEnd(es);

    beforeEach(() => {
      editor.props().onChange(nextEditorState);
    });

    it('renders applied entites', () => {
      wrapper.instance().highlightTokens(true);
      const rawData = convertToRaw(
        wrapper.state('editorState').getCurrentContent(),
      );
      expect(rawData).toMatchSnapshot();
    });

    it('changes entity category', () => {
      wrapper.setProps({
        tokens: [tokens[0], { ...tokens[1], category: 'user_name' }],
      });
      wrapper.instance().highlightTokens(true);
      const rawData = convertToRaw(
        wrapper.state('editorState').getCurrentContent(),
      );
      expect(rawData.entityMap).toMatchSnapshot();
    });

    it('applies entites to one token', () => {
      wrapper.setProps({ tokens: [tokens[1]] });
      wrapper.instance().highlightTokens(true);
      const rawData = convertToRaw(
        wrapper.state('editorState').getCurrentContent(),
      );
      expect(Object.values(rawData.entityMap).length).toEqual(1);
    });

    it('doesnt apply entity because token not in query', () => {
      wrapper.setProps({ tokens: [{ ...tokens[1], start: 8 }] });
      wrapper.instance().highlightTokens(true);
      const rawData = convertToRaw(
        wrapper.state('editorState').getCurrentContent(),
      );
      expect(Object.values(rawData.entityMap).length).toEqual(0);
    });

    it('doesnt apply entity because no tokens', () => {
      wrapper.setProps({ tokens: [] });
      wrapper.instance().highlightTokens(true);
      const rawData = convertToRaw(
        wrapper.state('editorState').getCurrentContent(),
      );
      expect(Object.values(rawData.entityMap).length).toEqual(0);
    });
  });

  describe('when passing query as a prop', () => {
    const tokens = [
      { start: 0, end: 10, token: 'connectors', category: 'internal_tag' },
      { start: 13, end: 18, token: 'Trove', category: 'company' },
    ];
    const query = 'connectors a Trove';
    const wrapper = shallow(
      h(HighlightedSearchTokens, {
        tokens,
        query,
      }),
    );

    it('should set editorState text to the query', () => {
      expect(
        wrapper
          .state('editorState')
          .getCurrentContent()
          .getPlainText(),
      ).toEqual(query);
    });

    it('applies entites to two tokens', () => {
      wrapper.setProps({ tokens });
      wrapper.instance().highlightTokens(true);
      const rawData = convertToRaw(
        wrapper.state('editorState').getCurrentContent(),
      );
      expect(Object.values(rawData.entityMap).length).toEqual(2);
    });
  });

  describe('when the text has changed', () => {
    it('should set displayTokens to `false`', () => {
      const query = 'connectors a Trove';
      const wrapper = shallow(
        h(HighlightedSearchTokens, {
          query,
        }),
      );

      wrapper.setState({ displayTokens: true });

      const es = EditorState.createWithContent(
        ContentState.createFromText('another query'),
        editorDecorators,
      );
      wrapper.instance().onChange(es);

      expect(wrapper.state('displayTokens')).toEqual(false);
    });
  });

  describe('when highlighting', () => {
    const query = 'connectors a Trove';
    const wrapper = shallow(
      h(HighlightedSearchTokens, {
        tokens: [],
        query,
      }),
    );
    const editor = wrapper.find('DraftEditor');
    const nextEditorState = EditorState.moveFocusToEnd(
      EditorState.createWithContent(ContentState.createFromText(query)),
    );
    editor.props().onChange(nextEditorState);

    it('applies new token entity to selected area', () => {
      const key = nextEditorState.getSelection().getFocusKey();
      const emptySelection = SelectionState.createEmpty(key);
      const selection = emptySelection.merge({
        anchorOffset: 0,
        focusOffset: 5,
      });
      const focusedEditorState = EditorState.forceSelection(
        nextEditorState,
        selection,
      );
      const highlightedEditor = wrapper
        .instance()
        .highlightSelection(focusedEditorState);
      const rawData = convertToRaw(highlightedEditor.getCurrentContent());
      expect(rawData).toMatchSnapshot();
    });

    it('returns selection indicies', () => {
      const selection = nextEditorState.getSelection().merge({
        anchorOffset: 0,
        focusOffset: 5,
      });
      const focusedEditorState = EditorState.forceSelection(
        nextEditorState,
        selection,
      );
      const startAndEnd = getSelectionStartAndEnd(focusedEditorState);
      expect(startAndEnd).toEqual({ start: 0, end: 5 });
    });
  });

  describe('when resizing tokens', () => {
    describe('createToken', () => {
      const token = { token: 'Trove', category: 'company', start: 0, end: 5 };
      const query = 'Trove!';
      it('returns a new token from the provided text and indicies', () => {
        expect(createToken(0, 5, query, token.category)).toEqual(token);
      });
    });

    describe('getResizedToken', () => {
      const token = { token: 'Trove', category: 'company', start: 0, end: 5 };
      const query = 'Trove is awesome!';
      it('uses right handle and returns unmodified resized token', () => {
        const resizeToken = { ...token, isLeft: false };
        expect(getResizedToken(query, resizeToken, 5)).toEqual(resizeToken);
      });

      it('uses left handle and returns resized token', () => {
        const resizeToken = { ...token, isLeft: true };
        expect(getResizedToken(query, resizeToken, 2)).toEqual({
          ...resizeToken,
          start: 2,
          token: 'ove',
        });
      });

      it('uses left handle past end and returns resized token', () => {
        const resizeToken = { ...token, isLeft: true };
        expect(getResizedToken(query, resizeToken, 17)).toEqual({
          ...resizeToken,
          isLeft: !resizeToken.isLeft,
          start: 5,
          end: 17,
          token: ' is awesome!',
        });
      });
    });

    describe('updateTokenEntity', () => {
      const token = {
        start: 0,
        end: 10,
        token: 'connectors',
        category: 'internal_tag',
      };
      const query = 'connectors';
      const wrapper = shallow(
        h(HighlightedSearchTokens, {
          tokens: [token],
          query,
        }),
      );

      beforeEach(() => {
        wrapper.instance().highlightTokens(true);
      });

      it('returns editorState with new token', () => {
        const resizedToken = { ...token, end: 7, token: 'connect' };
        const editorState = wrapper.state('editorState');
        const updatedEditorState = updateTokenEntity(
          editorState,
          token,
          resizedToken,
          7,
        );
        expect(
          convertToRaw(updatedEditorState.getCurrentContent()),
        ).toMatchSnapshot();
      });
    });
  });

  describe('when disableTyping is `true`', () => {
    const query = 'Wow!  Great moves, Ethan!';
    const wrapper = shallow(
      h(HighlightedSearchTokens, {
        query,
        disableTyping: true,
      }),
    );

    it('should not change the text when simulating typing in input', () => {
      const es = EditorState.createWithContent(
        ContentState.createFromText('SOMETHING ELSE'),
        editorDecorators,
      );
      const nextEditorState = EditorState.moveFocusToEnd(es);
      wrapper.instance().onChange(nextEditorState);

      expect(
        wrapper
          .state('editorState')
          .getCurrentContent()
          .getPlainText(),
      ).toEqual(query);
    });
  });
});
