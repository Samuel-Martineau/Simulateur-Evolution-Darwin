const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    index: './src/index/index.ts',
    recherche: './src/research/research.ts'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  resolve: { extensions: ['.js', '.ts'] },
  module: {
    rules: [
      {
        test: [/\.js$|\.ts$/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/typescript'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: [/\.css$|\.scss$/],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          { loader: 'postcss-loader', options: { config: { path: './webpack' } } }
        ]
      },
      {
        test: /\.\/src\/assets\.png|jpg|gif|svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets'
            }
          }
        ]
      },
      {
        test: /\.md/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'recherche.html',
      template: './src/research/research.html',
      inject: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index/index.html',
      inject: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    }),
    new CopyWebpackPlugin([{ from: './src/assets', to: 'assets' }]),
    new CleanWebpackPlugin()
  ]
};