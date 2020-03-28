/**
 * Created by shangdanning on 2020/1/2.
 * 思想：用更少的代码，解决更多的问题
 * mock相关的接口注入
 */
import { collectAPI } from "../api/collectAPI";
import { systemAPI } from "../api/systemAPI";
const Mock = require("mockjs");

var apiArray = [
  { name: "collectAPI", value: collectAPI },
  { name: "systemAPI", value: systemAPI }
];
/*
  将mock请求的api与json模拟数据绑定
*/
apiArray.forEach(api => {
  var value = api.value;
  for (let key in value) {
    if (value[key].mock) {
      Mock.mock(value[key].url + "Mock", value[key].method, () => {
        console.log(value[key].url + "Mock", value[key].method);
        return require("./json/" + api.name)[key + "Mock"]["data"];
      });
    }
  }
});
