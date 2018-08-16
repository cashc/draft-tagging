const hexToRgba = require('./util').hexToRgba;

const black = '#000000';
const white = '#ffffff';

const brand = {
  primary: '#4994e7',
  secondary: '#92d1ff',
  tertiary: '#c5ebff',
};

const gray = {
  dark: '#2c2b3f',
  medium: '#85849b',
  light: '#bebec6',
};

const paleGray = {
  dark: '#dce1ea',
  medium: '#e6eaf0',
  light: '#f0f2f7',
  veryLight: '#f9fafc',
};

const accent = {
  blue: '#4994e7',
  seaGreen: '#349e5e',
  appleGreen: '#40CB7C',
  red: '#eb5600',
  orange: '#fa9118',
};

module.exports = function() {
  return {
    'brand-primary': brand.primary,
    'brand-secondary': brand.secondary,
    'brand-tertiary': brand.tertiary,

    'foreground-primary': gray.dark,
    'foreground-secondary': gray.medium,
    'foreground-disabled': gray.light,
    'foreground-contrast': white,
    'foreground-link': accent.blue,
    'foreground-link-hover': brand.primary,
    'foreground-placeholder': paleGray.dark,
    'foreground-on-brand-primary': white,

    'background-primary': white,
    'background-accent': gray.medium,
    'background-contrast': gray.dark,
    'background-inactive': gray.light,
    'background-inactive-input': paleGray.light,
    'background-disabled': paleGray.light,
    'background-disabled-input': paleGray.veryLight,

    'border-primary': paleGray.medium,
    'border-secondary': paleGray.light,
    'border-faint': paleGray.veryLight,
    'border-input': paleGray.dark,
    'border-input-disabled': paleGray.light,

    info: accent.blue,
    success: accent.seaGreen,
    warning: accent.orange,
    danger: accent.red,
    grow: accent.appleGreen,

    'info-background': hexToRgba(accent.blue, 0.1),
    'success-background': hexToRgba(accent.seaGreen, 0.1),
    'warning-background': hexToRgba(accent.orange, 0.1),
    'danger-background': hexToRgba(accent.red, 0.1),

    'box-shadow': hexToRgba(gray.light, 0.25),
    overlay: hexToRgba(black, 0.2),

    shadowHeight1: `0 2px 2px 0 ${hexToRgba(
      gray.medium,
      0.08,
    )}, 0 1px 1px 0 ${hexToRgba(gray.medium, 0.1)}`,
    shadowHeight2: `0 2px 4px 0 ${hexToRgba(
      gray.medium,
      0.14,
    )}, 0 0 1px 0 ${hexToRgba(gray.medium, 0.1)}`,
    shadowHeight3: `0 4px 10px 0 ${hexToRgba(
      gray.medium,
      0.14,
    )}, 0 1px 1px 0 ${hexToRgba(gray.medium, 0.1)}`,
    shadowHeight4: `0 8px 14px 0 ${hexToRgba(
      gray.medium,
      0.16,
    )}, 0 0 2px 0 ${hexToRgba(gray.medium, 0.12)}`,
    shadowHeight5: `0 18px 20px 0 ${hexToRgba(
      gray.medium,
      0.16,
    )}, 0 0 2px 0 ${hexToRgba(gray.medium, 0.12)}`,

    /* Sidebar - ask design about this */
    'sidebar-top-bg-color': '#592732',
    'sidebar-divider-top': 'rgba(44, 43, 63, 0.4)',
    'sidebar-divider-bottom': 'rgba(44, 43, 63, 0.4)',
  };
};
