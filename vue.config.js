const host = "http://172.16.24.212:38081/zhsq/";
module.exports = {
  // cli3 代理是从指定的target后面开始匹配的，不是任意位置；配置pathRewrite可以做替换
  devServer: {
    port: 8082,
    proxy: {
      "/zhsq/": {
        target: host,
        changeOrigin: true,
        pathRewrite: {
          "^/zhsq/": "/"
        },
        logLevel: "debug"
      }
    }
  }
};
