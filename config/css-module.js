const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const theme = require('./theme.json')

const { NODE_ENV } = process.env
const isDev = NODE_ENV === 'development'

const styleLoeader = {
  loader: isDev
    ? require.resolve('style-loader')
    : MiniCssExtractPlugin.loader
}

const cssModuleLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: '[local]___[hash:base64:5]',
      exportLocalsConvention: 'camelCase',
    },
  }
}

const cssNormalLoader = {
  loader: 'css-loader'
}

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        require('postcss-flexbugs-fixes'),
        autoprefixer({
          overrideBrowserslist: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9',
          ],
          flexbox: 'no-2009',
        }),
      ],
    }
  },
}

const lessLoader = {
  loader: 'less-loader',
  options: {
    lessOptions: {
      modifyVars: theme,
      javascriptEnabled: true
    }
  }
}

exports.cssNormal = [
  styleLoeader,
  cssNormalLoader,
  postcssLoader,
  lessLoader
]

exports.cssModule = [
  styleLoeader,
  cssModuleLoader,
  postcssLoader,
  lessLoader
]
