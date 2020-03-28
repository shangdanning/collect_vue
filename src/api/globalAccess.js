/**
 * Created by shangdanning on 2019/11/06.
 * 全局访问api模块
 */
import Http from "@/common/utils/http";
import { collectAPI } from "./collectAPI";
import { systemAPI } from "./systemAPI";
// 在数组中查找所有出现的 x ，并返回一个包含匹配索引的数组
function findAll(a, x) {
  var results = [];
  var len = a.length;
  var pos = 0;
  while (pos < len) {
    pos = a.indexOf(x, pos); // 搜索
    if (pos === -1) break;
    results.push(pos);
    pos = pos + 1; // 从下一位置开始搜索
  }
  return results;
}
// 替换字符串中指定index的value
function replaceAt(str, index, replacement) {
  return str.substr(0, index) + replacement + str.substr(index + 1);
}
/**
 *service函数的形参依次为以下：
 *apiModule: api 模块
 *apiName: api接口名称
 *data: 请求参数
 *restParams: url中的参数
 */
export const service = function(apiModule, apiName, data, ...restParams) {
  // 先存映射表，为了将字符串value映射成模块
  var apiArray = { collectAPI: collectAPI, systemAPI: systemAPI };
  var requestModule = apiArray[apiModule];
  let apiConfig = requestModule[apiName];
  // 将请求信息深拷贝
  var requestConfig = JSON.parse(JSON.stringify(apiConfig));
  // 如果是get请求，将参数放在params里;如果是post请求，将参数放在data里
  if (requestConfig.method === "get") {
    data && (requestConfig.params = data);
  } else {
    requestConfig.data = data;
  }
  // 处理url中带参数的情况
  if (requestConfig.urlParams) {
    // 用倒序的index赋值，不然url的索引对不上了
    let indexArray = findAll(requestConfig.url, "*").reverse();
    // 将未提供对应url参数的值设为空
    for (
      let index = 0;
      index < indexArray.length - restParams.length;
      index++
    ) {
      restParams.push("");
    }
    restParams = restParams.reverse();
    indexArray.forEach((item, index) => {
      requestConfig.url = replaceAt(requestConfig.url, item, restParams[index]);
    });
  }

  // 处理Mock的情况
  if (apiConfig.mock && process.env.NODE_ENV !== "production") {
    requestConfig.url += "Mock";
  }
  return Http(requestConfig);
};
