const path = require('path');
var webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const express = require('express');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const ReactLoadable = require('react-loadable/webpack');

const ReactLoadablePlugin = ReactLoadable.ReactLoadablePlugin;

var publicPathJS = '/';
var publicPathCSS = '/';

var plugins = [
  new webpack.DefinePlugin({ // <-- key to reducing React's size
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new ErrorOverlayPlugin(),

  new HtmlWebPackPlugin({
    template: './src/index.html',
    filename: './index.html'
  }),

  new ProgressBarPlugin({
    format:
      '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
    clear: false
  }),

  //new HardSourceWebpackPlugin(),

  // new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks


  new MiniCssExtractPlugin({
    path: path.resolve('build'),
    filename: 'static_files/css/[name]-[contenthash].css',
    chunkFilename: 'static_files/css/[name]-[contenthash].css',
    publicPath: publicPathCSS
  }),

  new CleanWebpackPlugin('build', { beforeEmit: true }),
  //  new webpack.HotModuleReplacementPlugin()

  new ReactLoadablePlugin({
    filename: './build/react-loadable.json'
  })
];
module.exports = (env, options) => {
  console.log(`This is the Webpack 4 'mode': ${options.mode}`);
  const devMode = options.mode !== 'production';

  if (options.mode == 'production') {
    console.log('Deployment for local server');

    publicPathJS = '/';
    publicPathCSS = '/';
  }
  return {
    entry: './src/index.jsx',
    output: {
      path: path.resolve('build'),
      filename: 'static/js/[name]-[contenthash].js',
      chunkFilename: 'static/js/[name]-[contenthash].js',
      publicPath: publicPathJS
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [
        {
          loader: 'babel-loader',
          exclude: /node_modules/,
          test: /\.jsx$/,
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false
                }
              ],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-async-to-generator',
              '@babel/plugin-transform-runtime'
            ]
          }
        },
        {
          test: /\.scss$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',

            'sass-loader'
          ]
        },

        {
          test: /\.less$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader'
            },
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',

            'sass-loader'
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg)/,
          use: ['file-loader?name=[name].[ext]&outputPath=../static/imgs']
        },
        {
          test: /\.html/,
          use: ['html-loader']
        }
      ]
    },
    plugins: plugins,
    devServer: {
      historyApiFallback: true,
      overlay: true,
      // hot: true,
      open: true,
      stats: { colors: true },
      inline: true,
      setup(app) {
        app.use(
          '/assets/',
          express.static(path.join(__dirname, 'dist', 'static', 'css'))
        );
      }
    },

    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            enforce: true,
            chunks: 'all'
          }
        }
      },
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },

        }),

        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.css$/,
          cssProcessorOptions: { discardComments: { removeAll: true } }
        })
      ]
    }
  };
};