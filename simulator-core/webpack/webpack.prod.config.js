const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.config.js');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = merge(webpackBaseConfig, {
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin(), new TerserPlugin()]
  }
});
