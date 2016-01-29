'use strict';

var webpack = require('webpack');
var path = require('path');

var client = path.join(__dirname, '/client');

module.exports = {
  context: client,
  devtool: 'sourcemap',
  entry: {
    app: ['babel-polyfill', './app.js']
  },
  output: {
    path: client,
    filename: 'bundle.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.styl$/,
        loader: 'style!css!stylus'
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file-loader?name=[path][name].[ext]'
      },
      {
        test: /\.tpl.html$/,
        loader: 'raw'
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'client')
        ],
        loader: 'babel',
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  }
};
