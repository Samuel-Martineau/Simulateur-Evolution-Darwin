const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'simulator.html',
      template: './src/index.html',
      inject: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    })
  ],
  devtool: 'source-map'
});
