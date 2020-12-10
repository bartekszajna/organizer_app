const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {};

config.mode = 'development';

config.entry = {
  index: './src/scripts/index.js',
  signup: './src/scripts/signup.js',
  profile: './src/scripts/profile.js',
  account: './src/scripts/account.js',
  tasks: './src/scripts/tasks.js',
};

config.output = {
  filename: '[name].bundle.js',
  path: path.resolve(__dirname, 'dist'),
};

config.devtool = 'cheap-module-eva-source-map';

config.devServer = {
  contentBase: './dist',
  inline: true,
  open: true,
  port: 8000,
};

config.module = {
  rules: [
    {
      test: /\.html$/,
      use: ['html-loader'],
    },
    {
      test: /\.(svg|png|jpg|gif)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: './assets',
        },
      },
    },
    {
      test: /\.s(a|c)ss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    },
  ],
};

config.plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './src/index.html',
    inject: true,
    chunks: ['index'],
  }),
  new HtmlWebpackPlugin({
    filename: 'signup.html',
    template: './src/signup.html',
    inject: true,
    chunks: ['signup'],
  }),
  new HtmlWebpackPlugin({
    filename: 'profile.html',
    template: './src/profile.html',
    inject: true,
    chunks: ['profile'],
  }),
  new HtmlWebpackPlugin({
    filename: 'account.html',
    template: './src/account.html',
    inject: true,
    chunks: ['account'],
  }),
  new HtmlWebpackPlugin({
    filename: 'tasks.html',
    template: './src/tasks.html',
    inject: true,
    chunks: ['tasks'],
  }),
];

module.exports = config;
