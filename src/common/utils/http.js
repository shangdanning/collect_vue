/**
 * Created by shangdanning on 2019/11/06.
 * http模块
 */
import axios from "axios";
import Qs from "qs";
// import { Loading, Message } from "element-ui";
import { Message } from "element-ui";
const showStatus = status => {
  let message = "";
  // todo 待优化 可用对象的方式
  switch (status) {
    case 400:
      message = "请求错误(400)";
      break;
    case 401:
      message = "未授权，请重新登录(401)";
      break;
    case 403:
      message = "拒绝访问(403)";
      break;
    case 404:
      message = "请求出错(404)";
      break;
    case 408:
      message = "请求超时(408)";
      break;
    case 500:
      message = "服务器错误(500)";
      break;
    case 501:
      message = "服务未实现(501)";
      break;
    case 502:
      message = "网络错误(502)";
      break;
    case 503:
      message = "服务不可用(503)";
      break;
    case 504:
      message = "网络超时(504)";
      break;
    case 505:
      message = "HTTP版本不受支持(505)";
      break;
    default:
      message = `连接出错(${status})!`;
  }
  return `${message}，请检查网络或联系管理员！`;
};

const service = axios.create({
  // 联调
  // baseURL: process.env.NODE_ENV === "production" ? `/` : "/apis",
  //“transformRequest”允许在将请求数据发送到服务器之前对其进行更改,可以搭配headers进行修改
  transformRequest: [
    function(data) {
      data = Qs.stringify(data);
      return data;
    }
  ],
  // headers: {
  //   get: {
  //     "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  //   },
  //   post: {
  //     "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  //   }
  // },
  // 表示跨域请求时是否需要使用凭证
  // withCredentials: true,
  // timeout: 30000,
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true;
  },
  transformResponse: [
    data => {
      if (typeof data === "string" && data.startsWith("{")) {
        data = JSON.parse(data);
      }
      return data;
    }
  ]
});
// var loadinginstace, options;
// option配置见elementAPI
// options = {
//   fullscreen: true,
//   background: "rgba(0, 0, 0, 0.8)",
//   text: "拼命加载中",
//   spinner: "el-icon-loading",
//   lock: true
// };
// 请求拦截器
service.interceptors.request.use(
  config => {
    // element ui Loading方法
    // loadinginstace = Loading.service(options);
    return config;
  },
  error => {
    // loadinginstace.close();
    error.data = {};
    error.data.msg = "服务器异常，请联系管理员！";
    Message({
      message: error.data.msg,
      type: "error",
      duration: "1000"
    });
    // return Promise.resolve(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const status = response.status;
    let msg = "";
    debugger;
    if (status < 200 || status >= 300) {
      // 处理http错误
      msg = showStatus(status);
      if (typeof response.data === "string") {
        response.data = { msg };
      } else {
        response.data.msg = msg;
      }
      // loadinginstace.close();
      response.data.resultCode !== 200 &&
        (msg = response.data.message + "，" + msg);
      Message({
        message: msg,
        type: "error",
        duration: "2000"
      });
    } else {
      // loadinginstace.close();
      //message: "登录超时,请重新登录！" 直接跳到登录页
      if (response.data.code === 401) {
        location.href = "#/";
      }
      // 专为mock数据判定写的
      if (response.config.url.indexOf("Mock") !== -1) {
        // 返回Mock数据
        return response.data;
      } else {
        // 返回真实网络响应数据
        // return response.data.data;
        return response;
      }
    }
    // return response;
  },
  error => {
    error.data = {};
    error.data.msg = "请求超时或服务器异常，请检查网络或联系管理员！";
    // loadinginstace.close();
    Message({
      message: error.data.msg,
      type: "error",
      duration: "1000"
    });
    // return Promise.resolve(error);
  }
);

export default service;
