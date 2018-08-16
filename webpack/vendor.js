const webpack = require('webpack');
const path = require('path');
const getRootPath = require('./root-path');

const ROOT_PATH = getRootPath(__dirname);

module.exports = {
  name: 'Vendor Bundle',
  entry: {
    vendor: [
      'lodash',
      'react',
      'react-dom',
      'draft-js',
      'react-hyperscript-helpers',
    ],
  },

  output: {
    filename: '[name].bundle.js',
    path: path.join(ROOT_PATH, 'app/public/dist'),

    // The name of the global variable which the library's
    // require() function will be assigned to
    library: '[name]_lib',
  },

  plugins: [
    new webpack.DllPlugin({
      // The path to the manifest file which maps between
      // modules included in a bundle and the internal IDs
      // within that bundle
      path: path.join(ROOT_PATH, 'app/public/dist/[name]-manifest.json'),
      // The name of the global variable which the library's
      // require function has been assigned to. This must match the
      // output.library option above
      name: '[name]_lib',
      context: ROOT_PATH,
    }),
  ],
  mode: process.env.NODE_ENV,
};
