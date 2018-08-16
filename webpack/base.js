const path = require('path');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const getRootPath = require('./root-path');

const ROOT_PATH = getRootPath(__dirname);

module.exports = {
  name: 'Draft Tagging',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules(\/|\\)(?!@trove)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: [
                ['transform-runtime', { polyfill: false }],
                'syntax-dynamic-import',
                'babel-plugin-styled-components',
              ],
              presets: [
                ['env', { targets: { browsers: 'last 2 versions' } }],
                'react',
                'stage-0',
              ],
            },
          },
        ],
      },
    ],
  },
  target: 'web',
  entry: {
    'draft-tagging': [
      'babel-polyfill',
      path.join(ROOT_PATH, 'src', 'index.js'),
    ],
  },
  output: {
    path: path.join(ROOT_PATH, 'app/public/dist'),
    publicPath: 'dist/',
    filename: '[name].js',
  },
  resolve: {
    // Tell webpack what directories should be searched when resolving modules
    // https://webpack.js.org/configuration/resolve/#resolve-modules
    modules: ['node_modules', path.join(__dirname, 'node_modules')],
    alias: {
      'object-assign': path.join(ROOT_PATH, 'node_modules', 'object-assign'),
      'regenerator-runtime': path.join(
        ROOT_PATH,
        'node_modules',
        'regenerator-runtime',
      ),
      immutable: path.join(ROOT_PATH, 'node_modules', 'immutable'),
      inherits: path.join(ROOT_PATH, 'node_modules', 'inherits'),
      entities: path.join(ROOT_PATH, 'node_modules', 'entities'),
      'supports-color': path.join(ROOT_PATH, 'node_modules', 'supports-color'),
    },
  },
  plugins: [
    new webpack.DllReferencePlugin({
      /* eslint-disable import/no-unresolved */
      manifest: path.join(
        ROOT_PATH,
        'app',
        'public',
        'dist',
        'vendor-manifest.json',
      ),
      context: ROOT_PATH,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        PORT: JSON.stringify(process.env.PORT),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
      },
    }),
    new LodashModuleReplacementPlugin(),
    new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop'),
    new webpack.optimize.OccurrenceOrderPlugin(true),
  ],
};
