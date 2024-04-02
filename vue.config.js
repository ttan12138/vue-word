const path = require("path");
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  pages: {
    index: {
      // 修改入口
      entry: "examples/main.js",
      template: "public/index.html",
      filename: "index.html",
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("js")
      .include.add("/packages")
      .end()
      .use("babel")
      .loader("babel-loader")
      .tap((options) => {
        return options;
      });
  },
  configureWebpack: {
    // map文件过大
    devtool: false
  }
};
