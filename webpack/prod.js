const webpack = require('webpack');
const merge = require('webpack-merge');
const webBaseConfig = require('./base');

process.noDeprecation = true;

module.exports = merge(webBaseConfig, {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
      __REACT_PERF__: false,
    }),
  ],
  mode: 'production',
});
