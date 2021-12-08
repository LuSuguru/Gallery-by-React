const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack')
const path = require('path')

const baseWebpackConfig = require('./webpack.base.conf')
const utils = require('./utils')

module.exports = merge(baseWebpackConfig, {
  optimization: {
    moduleIds: 'named',
    chunkIds: 'named',
    splitChunks: {
      hidePathInfo: false,
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
    },
    emitOnErrors: true,
  },

  devtool: 'eval-cheap-module-source-map',

  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 600
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    pathinfo: true,
  },

  cache: {
    type: 'filesystem',
    cacheDirectory: path.join(__dirname, '../.temp_cache'),
    version: '0.0.1' // 更改配置后手动更改版本号，让缓存失效
  },

  infrastructureLogging: {
    level: 'none',
  },

  plugins: [
    new HotModuleReplacementPlugin(),

    // 生成自动引用文件的html模板
    new HtmlWebpackPlugin({
      template: require.resolve('../index.html'),
      inject: true,
    }),

    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],

  devServer: {
    compress: true,
    port: utils.port,
    historyApiFallback: true,
    hot: true,
    liveReload: false,
    open: false
  }
})
