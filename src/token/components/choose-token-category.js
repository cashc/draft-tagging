import { h } from 'react-hyperscript-helpers';
import { connect } from 'react-redux';

import { setSelectedTokenCategory } from '../action-creators';
import { DELETE_TOKEN_CATEGORY } from '../constants';
import { getCategoryItemsSorted } from '../util';

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

export function ChooseTokenCategory({
  // clickPosition,
  // close = () => {},
  handleChooseTokenCategory,
}) {
  const actions = buildCategoryActions(handleChooseTokenCategory);

  return h('div', actions.map((a) => h('div', a.categoryTitle)));
}

function mapDispatchToProps(dispatch, { selectedToken, close }) {
  return {
    handleChooseTokenCategory: (category) => {
      dispatch(setSelectedTokenCategory({ selectedToken, category }));
      close();
    },
  };
}

export const ChooseTokenCategoryConn = connect(null, mapDispatchToProps)(
  ChooseTokenCategory,
);
