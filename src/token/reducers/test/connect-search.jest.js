import { connectSearch } from '../connect-search';
import {
  setConnectSearchQuery,
  searchConnect,
  stopConnectSearchLoading,
  setSelectedToken,
  updateSelectedToken,
  setSelectedTokenCategory,
  setConnectSearchTokens,
  resetConnectSearch,
} from '../../action-creators';
import { DELETE_TOKEN_CATEGORY, NEW_TOKEN_CATEGORY } from '../../constants';

describe('connectSearch', () => {
  const tokens = [
    { start: 0, end: 10, token: 'connectors', category: 'job_title' },
    { start: 13, end: 18, token: 'Trove', category: 'company' },
  ];

  it('returns default state', () => {
    expect(connectSearch({})).toEqual({});
  });

  describe('SET_CONNECT_SEARCH_QUERY', () => {
    it('changes query', () => {
      const startState = { query: 'hi cash', tokens };
      const query = 'hi tom';
      const newState = {
        loading: false,
        query,
        tokens: [],
        searchWithTokens: false,
        tokensHaveChanged: false,
      };

      expect(
        connectSearch(startState, setConnectSearchQuery({ query })),
      ).toEqual(newState);
    });

    it('changes the query to the same thing, which doesnt reset the tokens or searchWithTokens bool', () => {
      const startState = { query: 'hi tom', tokens, searchWithTokens: true };
      const query = 'hi tom';
      const newState = {
        loading: false,
        query,
        tokens,
        searchWithTokens: true,
        tokensHaveChanged: false,
      };

      expect(
        connectSearch(startState, setConnectSearchQuery({ query })),
      ).toEqual(newState);
    });
  });

  describe('SEARCH_CONNECT', () => {
    it('handles searching', () => {
      const startState = {
        query: 'hi cash',
        tokens,
        selectedToken: { start: 1 },
      };
      const query = 'yo yo yo';
      const newState = {
        loading: true,
        query,
        selectedToken: {},
        tokens,
        tokensHaveChanged: false,
      };

      expect(connectSearch(startState, searchConnect({ query }))).toEqual(
        newState,
      );
    });
  });

  describe('STOP_CONNECT_SEARCH_LOADING', () => {
    it('has same query and sets state', () => {
      const startState = {
        query: 'hi cash',
        tokens,
        selectedToken: { start: 1 },
      };
      const query = 'hi cash';
      const newState = {
        loading: false,
        query,
        tokens,
        selectedToken: {},
      };

      expect(
        connectSearch(startState, stopConnectSearchLoading({ query })),
      ).toEqual(newState);
    });

    it('has different query and does nothing', () => {
      const startState = {
        query: 'hi cash',
        tokens,
        selectedToken: { start: 1 },
      };
      const query = 'ih hsac';
      expect(
        connectSearch(startState, stopConnectSearchLoading({ query })),
      ).toEqual(startState);
    });
  });

  describe('SET_CONNECT_SEARCH_TOKENS', () => {
    it('handles setting the tokens for search', () => {
      const query = 'connectors a Trove';
      const startState = { query, tokens: [] };
      const newState = {
        ...startState,
        tokens,
      };

      expect(
        connectSearch(startState, setConnectSearchTokens({ query, tokens })),
      ).toEqual(newState);
    });

    it('handles setting the tokens when query doesnt have tokens', () => {
      const query = 'Trove a connectors';
      const startState = { query, tokens: [tokens[0]] };
      expect(
        connectSearch(startState, setConnectSearchTokens({ query, tokens })),
      ).toEqual(startState);
    });

    it('handles setting the tokens when no query', () => {
      const startState = { tokens: [tokens[0]] };
      expect(
        connectSearch(startState, setConnectSearchTokens({ tokens })),
      ).toEqual(startState);
    });

    it('handles setting the tokens when payload query !== state query', () => {
      const startState = { query: 'something', tokens: [tokens[0]] };
      const query = 'not something';
      expect(
        connectSearch(startState, setConnectSearchTokens({ query, tokens })),
      ).toEqual(startState);
    });

    it('handles filtering supported tokens', () => {
      const query = 'ian at trove';
      const startState = { query, tokens: [] };
      const queryTokens = [
        { start: 0, end: 2, token: 'ian', category: 'user_name' },
        { start: 7, end: 11, token: 'trove', category: 'internal_tag' },
        { start: 7, end: 11, token: 'trove', category: 'domain' },
      ];
      const newState = {
        ...startState,
        tokens: [queryTokens[0], queryTokens[2]],
      };
      expect(
        connectSearch(
          startState,
          setConnectSearchTokens({ query, tokens: queryTokens }),
        ),
      ).toEqual(newState);
    });
  });

  describe('SET_SELECTED_TOKEN', () => {
    it('handles selecting a token to modify it', () => {
      const startState = { selectedToken: { start: 2 }, tokens };
      const selectedToken = { start: 1, end: 2 };
      const newState = {
        selectedToken,
        tokens,
        tokensHaveChanged: true,
      };

      expect(
        connectSearch(startState, setSelectedToken({ selectedToken })),
      ).toEqual(newState);
    });
  });

  describe('UPDATE_SELECTED_TOKEN', () => {
    it('handles updating the selected token', () => {
      const startState = { tokens, searchWithTokens: false };
      const payload = {
        updatedToken: {
          start: 0,
          end: 2,
          token: 'hicash',
          category: 'user_name',
        },
        selectedToken: tokens[0],
      };
      const newState = {
        ...startState,
        selectedToken: payload.selectedToken,
        tokens: [payload.updatedToken, tokens[1]],
        searchWithTokens: true,
        tokensHaveChanged: true,
      };

      expect(connectSearch(startState, updateSelectedToken(payload))).toEqual(
        newState,
      );
    });

    it('handles updating the selected token to an empty selection', () => {
      const startState = { tokens };
      const payload = {
        updatedToken: {
          start: 0,
          end: 0,
          token: 'hicash',
          category: 'user_name',
        },
        selectedToken: tokens[0],
      };
      const newState = {
        ...startState,
        selectedToken: payload.selectedToken,
        tokens: [tokens[1]],
        searchWithTokens: true,
        tokensHaveChanged: true,
      };

      expect(connectSearch(startState, updateSelectedToken(payload))).toEqual(
        newState,
      );
    });
  });

  describe('SET_SELECTED_TOKEN_CATEGORY', () => {
    it('handles changing selected token category', () => {
      const startState = { tokens, query: 'connectors a Trove' };
      const category = 'dope';
      const payload = { selectedToken: tokens[0], category };
      const newToken = { ...tokens[0], category };
      const newState = {
        ...startState,
        selectedToken: tokens[0],
        tokens: [newToken, tokens[1]],
        searchWithTokens: true,
        tokensHaveChanged: true,
      };

      expect(
        connectSearch(startState, setSelectedTokenCategory(payload)),
      ).toEqual(newState);
    });

    it('handles deleting a token', () => {
      const startState = { tokens };
      const category = DELETE_TOKEN_CATEGORY;
      const payload = { selectedToken: tokens[0], category };
      const newState = {
        selectedToken: payload.selectedToken,
        tokens: [tokens[1]],
        searchWithTokens: true,
        tokensHaveChanged: true,
      };

      expect(
        connectSearch(startState, setSelectedTokenCategory(payload)),
      ).toEqual(newState);
    });

    describe('adding token', () => {
      it('adds a new token', () => {
        const selectedToken = {
          start: 0,
          end: 1,
          category: NEW_TOKEN_CATEGORY,
          token: 'test',
        };
        const startState = { tokens };
        const category = NEW_TOKEN_CATEGORY;
        const payload = { selectedToken, category };
        const newState = {
          selectedToken,
          tokens: [...tokens, selectedToken],
          searchWithTokens: true,
          tokensHaveChanged: true,
        };

        expect(
          connectSearch(startState, setSelectedTokenCategory(payload)),
        ).toEqual(newState);
      });

      describe('when start state has a query', () => {
        it('adds a new token', () => {
          const selectedToken = {
            start: 0,
            end: 1,
            category: NEW_TOKEN_CATEGORY,
            token: 'test',
          };
          const startState = { tokens, query: 'connectors a Trove' };
          const category = NEW_TOKEN_CATEGORY;
          const payload = { selectedToken, category };
          const newState = {
            ...startState,
            selectedToken,
            tokens: [...tokens, selectedToken],
            searchWithTokens: true,
            tokensHaveChanged: true,
          };

          expect(
            connectSearch(startState, setSelectedTokenCategory(payload)),
          ).toEqual(newState);
        });
      });

      describe('deleting new token via DELETE_TOKEN_CATEGORY', () => {
        it('does not add any token', () => {
          const selectedToken = {
            start: 0,
            end: 1,
            category: NEW_TOKEN_CATEGORY,
            token: 'test',
          };
          const startState = { tokens };
          const category = DELETE_TOKEN_CATEGORY;
          const payload = { selectedToken, category };
          const newState = {
            selectedToken,
            tokens,
            searchWithTokens: true,
            tokensHaveChanged: true,
          };

          expect(
            connectSearch(startState, setSelectedTokenCategory(payload)),
          ).toEqual(newState);
        });
      });

      describe('no token selected', () => {
        it('does nothing', () => {
          const selectedToken = {};
          const startState = { tokens };
          const category = NEW_TOKEN_CATEGORY;
          const payload = { selectedToken, category };

          expect(
            connectSearch(startState, setSelectedTokenCategory(payload)),
          ).toEqual(startState);
        });
      });

      it('handles adding a new token that is a duplicate', () => {
        const selectedToken = { ...tokens[0], category: NEW_TOKEN_CATEGORY };
        const startState = { tokens };
        const { category } = tokens[0];
        const payload = { selectedToken, category };
        const newState = {
          selectedToken,
          tokens,
          searchWithTokens: true,
          tokensHaveChanged: true,
        };

        expect(
          connectSearch(startState, setSelectedTokenCategory(payload)),
        ).toEqual(newState);
      });
    });
  });

  describe('RESET_CONNECT_SEARCH', () => {
    const startState = { loading: true, query: 'hi cash' };

    it('handles reset to default state', () => {
      expect(connectSearch(startState, resetConnectSearch())).toEqual({
        query: '',
        loading: false,
        tokens: [],
        selectedToken: {},
        searchWithTokens: false,
        tokensHaveChanged: false,
      });
    });
  });
});
