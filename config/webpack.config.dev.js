// 引入基础配置文件
const webpackBase = require('./webpack.config.base')
// 引入 webpack-merge 插件
const webpackMerge = require('webpack-merge')
// 引入配置文件
const config = require('./config')
// 合并配置文件
module.exports = webpackMerge(webpackBase, {
  // 配置 webpack-dev-server
  devServer: {
    // 项目根目录
    contentBase: config.devServerOutputPath,
    disableHostCheck:true,
    // 错误、警告展示设置
    overlay: {errors: true, warnings: true},
    proxy: {
      '/apis': { // 将http://carwash1.eveabc.com/印射为/apis
        target: 'http://carwash1.eveabc.com/', // 接口域名
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/apis': '', // 需要rewrite的,
        },
      },
    },
  },
})

