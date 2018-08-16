import { getSortedTokens } from '../tokens';

describe('getSortedTokens', () => {
  it('returns sorted array of tokens', () => {
    const tokens = [{ token: 'peter', start: 10 }, { token: 'paul', start: 0 }];
    const sortedTokens = [
      { token: 'paul', start: 0 },
      { token: 'peter', start: 10 },
    ];
    const data = getSortedTokens.resultFunc(tokens);
    expect(data).toEqual(sortedTokens);
  });
});
