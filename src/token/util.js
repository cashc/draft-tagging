import { sortBy } from 'lodash';
import {
  CATEGORY_TYPES,
  CATEGORY_TYPES_SUPPORTED,
  CATEGORY_TYPES_RANKED,
  CATEGORY_TITLES,
} from './constants';

export function getCategoryTypes() {
  return Object.values(CATEGORY_TYPES);
}

export function getCategoryTypesSupported() {
  const categoryTypes = getCategoryTypes();
  return categoryTypes.filter(isCategorySupported);
}

export function isCategorySupported(categoryType) {
  return CATEGORY_TYPES_SUPPORTED[categoryType];
}

export function getCategoryItemsSupported() {
  const categoryTypesSupported = getCategoryTypesSupported();
  return categoryTypesSupported.map(createCategoryItem);
}

function createCategoryItem(categoryType) {
  const categoryTitle = getCategoryTitle(categoryType);
  return { categoryType, categoryTitle };
}

export function getCategoryTitle(categoryType) {
  return CATEGORY_TITLES[categoryType];
}

export function getCategoryItemsSorted() {
  const categoryItems = getCategoryItemsSupported();
  return sortBy(categoryItems, rankCategoryItem);
}

function rankCategoryItem(categoryItem) {
  const { categoryType } = categoryItem;
  return rankCategory(categoryType);
}

export function rankCategory(category) {
  const rank = CATEGORY_TYPES_RANKED[category];
  return rank;
}

export const queryHasToken = (query = '', tokens = []) =>
  tokens.reduce((previous, token) => {
    if (previous) return true;
    const tokenWord = token.token;
    const tokenRangeFromQuery = query.substr(token.start, tokenWord.length);
    return tokenRangeFromQuery === tokenWord;
  }, false);
