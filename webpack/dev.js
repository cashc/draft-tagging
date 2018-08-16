const path = require('path');
const merge = require('webpack-merge');
const webBaseConfig = require('./base');
const getRootPath = require('./root-path');

const ROOT_PATH = getRootPath(__dirname);

module.exports = merge(webBaseConfig, {
  mode: 'development',
  devServer: {
    port: process.env.PORT || 8080,
    contentBase: path.join(ROOT_PATH, 'app', 'public'),
    publicPath: '/dist/',
  },
  watch: true,
});
