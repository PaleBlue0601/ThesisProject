const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,

  pages: {
    index: {
      entry: 'src/main.ts', // 入口文件
      title: '个人藏品交换管理系统'
    }
  },

  devServer: {
    proxy: {
      '/apis': {
        target: 'http://localhost:3000',  //要解决跨域的接口的域名
        secure:false,           //如果是https接口，需要配置这个参数
        changeOrigin: true,  // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/apis': ''  // 路径重写
        }
      },
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, "./src/common/common.less"),
      ]
    }
  }
})
