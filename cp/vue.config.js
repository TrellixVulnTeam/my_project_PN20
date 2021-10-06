const path = require("path");
const { IgnorePlugin } = require("webpack");
function resolve(dir) {
  // path.join()方法用于连接路径
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: "./",
  configureWebpack: {
    plugins: [new IgnorePlugin(/^\.\/locale$/, /moment$/)],
    resolve: {
      alias: {
        "@ant-design/icons/lib/dist$": resolve("./src/antd/icons.js"),
      },
    },
  },
  devServer: {
    port: 8080,
    hotOnly: false,
    disableHostCheck: true,
  },
};
