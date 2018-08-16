import { camelCase } from 'lodash';
import defaultTheme from './theme';

export const THEMES = {
  default: camelCaseThemeKeys(defaultTheme()),
};

function camelCaseThemeKeys(theme) {
  // camel casing keys here to keep compatibility with css files which use dash casing
  // this function should only ever be called once per theme at runtime
  return Object.keys(theme).reduce((out, key) => {
    const ccKey = camelCase(key); // for perf
    /* eslint-disable no-param-reassign */ out[ccKey] = theme[key];
    return out;
  }, {});
}
