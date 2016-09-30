const autoprefixer = require('autoprefixer');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

function resolvePath(relativePath) {
  return path.resolve(relativePath);
}

module.exports = {
  devtool: 'eval',
  entry: [
    require.resolve('webpack-dev-server/client') + '?/',
    require.resolve('webpack/hot/dev-server'),
    path.join(resolvePath('src'), 'index')
  ],
  output: {
    path: resolvePath('build'),
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  resolveLoader: {
    root: resolvePath('node_modules'),
    moduleTemplates: ['*-loader']
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: resolvePath('src'),
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        include: resolvePath('src'),
        loader: 'babel',
        query: require('./babel.dev')
      },
      {
        test: /\.hbs$/,
        include: resolvePath('src'),
        loader: 'ractive'
      },
      {
        test: /\.css$/,
        include: [resolvePath('src'), resolvePath('node_modules')],
        loader: 'style!css!postcss'
      },
      {
        test: /\.scss$/,
        include: [resolvePath('src'), resolvePath('node_modules')],
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.json$/,
        include: [resolvePath('src'), resolvePath('node_modules')],
        loader: 'json'
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
        include: [resolvePath('src'), resolvePath('node_modules')],
        loader: 'file',
        query: {
          name: 'static/media/[name].[ext]'
        }
      },
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        include: [resolvePath('src'), resolvePath('node_modules')],
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[ext]'
        }
      }
    ]
  },
  eslint: {
    configFile: path.join(__dirname, 'eslint.js'),
    useEslintrc: false
  },
  postcss: function() {
    return [autoprefixer];
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: resolvePath('index.html')
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin()
  ]
};