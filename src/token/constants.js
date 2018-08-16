export const MIN_QUERY_LENGTH = 3;
export const NEW_TOKEN_CATEGORY = 'new_token';
export const DELETE_TOKEN_CATEGORY = 'delete_token';

export const CATEGORY_TYPES = {
  CITY: 'city',
  STATE: 'state',
  COMPANY: 'company',
  DOMAIN: 'domain',
  EMAIL: 'email',
  INTERNAL_TAG: 'internal_tag',
  USER_TAG: 'user_tag',
  JOB_TITLE: 'job_title',
  USER_FIRST: 'user_first',
  USER_LAST: 'user_last',
  USER_NAME: 'user_name',
};

export const CATEGORY_TYPES_SUPPORTED = {
  [CATEGORY_TYPES.CITY]: true,
  [CATEGORY_TYPES.STATE]: true,
  [CATEGORY_TYPES.COMPANY]: true,
  [CATEGORY_TYPES.DOMAIN]: true,
  [CATEGORY_TYPES.JOB_TITLE]: true,
  [CATEGORY_TYPES.USER_NAME]: true,
  [CATEGORY_TYPES.EMAIL]: false,
  [CATEGORY_TYPES.INTERNAL_TAG]: false,
  [CATEGORY_TYPES.USER_TAG]: false,
  [CATEGORY_TYPES.USER_FIRST]: false,
  [CATEGORY_TYPES.USER_LAST]: false,
};

export const CATEGORY_TITLES = {
  [CATEGORY_TYPES.CITY]: 'City',
  [CATEGORY_TYPES.STATE]: 'State / Province',
  [CATEGORY_TYPES.COMPANY]: 'Company Name',
  [CATEGORY_TYPES.DOMAIN]: 'Domain',
  [CATEGORY_TYPES.JOB_TITLE]: 'Job Title',
  [CATEGORY_TYPES.USER_NAME]: 'Name',
};

export const CATEGORY_TYPES_RANKED = {
  [CATEGORY_TYPES.USER_NAME]: 1,
  [CATEGORY_TYPES.JOB_TITLE]: 2,
  [CATEGORY_TYPES.COMPANY]: 3,
  [CATEGORY_TYPES.CITY]: 4,
  [CATEGORY_TYPES.STATE]: 5,
  [CATEGORY_TYPES.DOMAIN]: 6,
};
