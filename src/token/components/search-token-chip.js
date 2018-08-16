import { h } from 'react-hyperscript-helpers';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { getTokensForWordsSorted } from '../selectors';

const SearchTokenChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 5px 0 18px 31px;
  background-color: ${(props) => props.theme.backgroundPrimary};
`;

const HelpTextDiv = styled.div`
  margin-bottom: 4px;
  font-size: 13px;
  letter-spacing: 0.1px;
  text-align: left;
  color: ${(props) => props.theme.foregroundPrimary};
`;

const WordRowDiv = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 0;
`;

const WordDiv = styled.div`
  margin-right: 4px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.54;
  letter-spacing: 0.1px;
  text-align: left;
  color: ${(props) => props.theme.foregroundPrimary};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Chip = styled.div`
  display: flex;
  align-items: center;
  min-height: 22px;
  margin: 0 3px;
  padding-right: 2px;
  color: ${(props) => props.theme.foregroundLink};
  border-radius: 12px;
  box-shadow: 1px 1px 10px ${({ theme }) => theme.boxShadow};
  background-color: ${(props) => props.theme.backgroundDisabledInput};
  cursor: pointer;

  &:hover {
    text-shadow: 0 0 1px ${(props) => props.theme.infoBackground};
  }
`;

const Category = styled.span`
  padding: 0 1px 0 6px;
`;

const DropdownTriangle = styled.div`
  margin: 0px 3px -6px 2px;
  width: 0;
  height: 0;
  border: 4px solid transparent;
  border-top: 4px solid ${(props) => props.theme.foregroundLink};
`;

export const QueryHitsDiv = styled.div`
  font-size: 13px;
  letter-spacing: 0.1px;
  text-align: left;
  color: ${(props) => props.theme.foregroundSecondary};
  margin-top: 5px;
`;

export const SearchTokenChip = ({
  tokensForWords = [],
  chooseTokenCategory = () => {},
}) => {
  const tokensForWordsRows = tokensForWords.map((tokensForWord) => {
    const word = tokensForWord[0].token;
    const tokens = tokensForWord.map((token) =>
      TokenChip(token, { chooseTokenCategory }),
    );
    return h(WordRowDiv, [h(WordDiv, `${word}:`), ...tokens]);
  });

  return h(SearchTokenChipContainer, [
    h(HelpTextDiv, 'Highlight a selection you want to tag and then click on it to choose a tag.'),
    ...tokensForWordsRows,
  ]);
};

const TokenChip = (token, { chooseTokenCategory }) => {
  const { categoryTitle } = token;
  return h(
    Chip,
    {
      onClick: (event) => chooseTokenCategory(event, token),
    },
    [h(Category, categoryTitle), h(DropdownTriangle)],
  );
};

const mapStateToProps = (state) => ({
  tokensForWords: getTokensForWordsSorted(state),
});

export const mapDispatchToProps = () => ({
  chooseTokenCategory: (event, selectedToken) => {
    console.log('HIT', selectedToken);
  },
});

export const SearchTokenChipConn = connect(mapStateToProps, mapDispatchToProps)(
  SearchTokenChip,
);
