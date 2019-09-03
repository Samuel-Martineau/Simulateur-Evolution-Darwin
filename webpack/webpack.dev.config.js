const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'recherche.html',
      template: './src/research/research.html',
      inject: false,
      minify: {
        removeComments: false,
        collapseWhitespace: false
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index/index.html',
      inject: false,
      minify: {
        removeComments: false,
        collapseWhitespace: false
      }
    })
  ]
});
