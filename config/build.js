const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const { argv } = require('yargs')
const webpack = require('webpack')
const webpackConfig = require('./webpack.prod.conf')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

if (argv.analyzer) {
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

console.log(chalk.yellow('\n  停机信号插拴抽出完毕\n  驾驶舱插入\n  驾驶舱固定终了\n  开始第一次结束\n  将水（LCL）注入驾驶舱\n  主电源接续动力传达所有回路\n'))

rm(path.join(__dirname, '../build'), err => {
  if (err) throw err
  webpack(webpackConfig, function (err1, stats) {
    if (err1) throw err1

    process.stdout.write(`${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    })}\n\n`)

    console.log(chalk.cyan('打包成功\n'))
  })
})
