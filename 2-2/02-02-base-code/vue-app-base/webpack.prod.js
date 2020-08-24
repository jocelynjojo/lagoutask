const common = require('./webpack.common')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CopyWebpackPlugin({ patterns: ['./src/assets/**', 'public'] }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    usedExports: true, // 标记未引用代码
    minimize: true, // 移除未使用代码
    splitChunks: {
      chunks: 'all'
    }
  }
})
