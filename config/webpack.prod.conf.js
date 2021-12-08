const path = require('path')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    publicPath: '/'
  },

  resolve: {
    mainFields: ['module', 'browser', 'main']
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            beautify: false,
            comments: false,
          },
          compress: {
            drop_console: true,
            comparisons: false
          }
        }
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: ['default', {
            autoprefixer: { remove: false } // 添加对autoprefixer的配置
          }]
        }
      })
    ],
    sideEffects: true,
    concatenateModules: true,

    emitOnErrors: false,

    chunkIds: 'deterministic',
    mangleExports: 'deterministic',
    moduleIds: 'deterministic',

    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name(module, chunks) {
        const moduleFileName = module.identifier().split('/').reduceRight(item => item)
        const allChunksNames = chunks.map((item) => item.name).join('~')
        return `${allChunksNames}-${moduleFileName}`
      },
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  },

  plugins: [
    // 配置生产环境的全局变量
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // 生成自动引用文件的html模板
    new HtmlWebpackPlugin({
      template: require.resolve('../index.html'),
      inject: true,
      minify: { // 压缩生成的html
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css',
    })
  ]
})
