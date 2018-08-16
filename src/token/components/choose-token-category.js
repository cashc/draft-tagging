import { h } from 'react-hyperscript-helpers';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setSelectedTokenCategory, closeModal } from '../action-creators';
import { DELETE_TOKEN_CATEGORY } from '../constants';
import { getCategoryItemsSorted } from '../util';
import { getSelectedToken } from '../selectors';

function buildCategoryActions(onClick) {
  const categoryItems = getCategoryItemsSorted();
  const categoryActions = categoryItems.map((categoryItem) =>
    createCategoryItemAction(categoryItem, onClick),
  );

  const remover = {
    type: 'CONTEXT_MENU_ITEM_TYPE',
    label: 'Remove',
    name: DELETE_TOKEN_CATEGORY,
    onClick: () => onClick(DELETE_TOKEN_CATEGORY),
  };
  return [...categoryActions, remover];
}

function createCategoryItemAction(categoryItem, onClick) {
  const itemType = 'CONTEXT_MENU_ITEM_TYPE';
  const { categoryType, categoryTitle } = categoryItem;
  return {
    type: itemType,
    label: categoryTitle,
    name: categoryType,
    onClick: () => onClick(categoryType),
  };
}

const ModalContainer = styled.div`
  position: absolute;
  box-shadow: ${({ theme }) => theme.shadowHeight3};
  background-color: ${({ theme }) => theme.backgroundDisabledInput};
  padding: 10px;
  border-radius: 6px;
`;

const Category = styled.div`
  cursor: pointer;
  padding: 2px;
  margin: 1px;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundDisabled};
  }
`;

export function ChooseTokenCategory({
  selectedToken = false,
  handleChooseTokenCategory,
}) {
  if (!selectedToken) return null;

  const actions = buildCategoryActions(handleChooseTokenCategory);

  return h(ModalContainer, actions.map(({ onClick, label }) => h(Category, { onClick }, label)));
}

function mapStateToProps(state) {
  return {
    selectedToken: getSelectedToken(state),
  };
}

function mapDispatchToProps(dispatch, { selectedToken }) {
  return {
    handleChooseTokenCategory: (category) => {
      dispatch(setSelectedTokenCategory({ selectedToken, category }));
      dispatch(closeModal());
    },
  };
}

export const ChooseTokenCategoryConn = connect(mapStateToProps, mapDispatchToProps)(
  ChooseTokenCategory,
);
