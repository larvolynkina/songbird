const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },
  entry: {
    main: './src/pages/main/main.js',
    quiz: './src/pages/quiz/quiz.js',
    gallery: './src/pages/gallery/gallery.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/[name][ext]',
  },
  plugins: [
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: `./src/assets/icons/testimonial-icons/`,
    //       to: 'assets',
    //     },
    //     {
    //       from: `./src/assets/images/pets/`,
    //       to: 'assets',
    //     },
    //   ],
    // }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/pages/main/main.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      filename: 'quiz.html',
      template: './src/pages/quiz/quiz.html',
      chunks: ['quiz'],
    }),
    new HtmlWebpackPlugin({
      filename: 'gallery.html',
      template: './src/pages/gallery/gallery.html',
      chunks: ['gallery'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('postcss-preset-env')],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.(mp3)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
        type: 'asset/resource',
      },
      {
        test: /\.m?js$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  debug: false,
                  corejs: 3,
                  useBuiltIns: 'entry',
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
