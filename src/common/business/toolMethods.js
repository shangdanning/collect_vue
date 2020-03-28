/**
 * Created by shangdanning on 2019/11/21.
 * 常用的工具方法
 */
// Vuex
import store from "@/store";
import moment from "moment";
const methods = {
  // 根据value值返回显示文本
  // 参数依次为  value，dictCodeName，是否为多选
  // 比如( "2,3,4","prodromicSymptomCode", 1 ) 或者 ( "2","beginIllType" )
  // 返回值依次为 "癫痫发作,近事记忆下降/认知倒退,睡眠障碍"  、  "亚急性"
  reDicValue(value, dictCodeName, isMultiCheck) {
    var result = "";
    if (value) {
      if (!isMultiCheck) {
        // 如果是单选
        store.state.system.dicData[dictCodeName].forEach(item => {
          if (item.dictDataValue === value) {
            result = item.dictDataName;
          }
        });
      } else {
        // 如果是多选
        var tempArray = value;
        if (typeof value === "string") {
          tempArray = value.split(",");
        }
        tempArray.forEach(temp => {
          store.state.system.dicData[dictCodeName].forEach(item => {
            if (item.dictDataValue === temp) {
              result += item.dictDataName + ",";
            }
          });
        });
        result = result.substring(0, result.length - 1);
      }
    }
    return result;
  },
  // 用于精简get请求参数，将为空的字符串过滤掉
  filterGetParams(obj) {
    var result = {};
    var type = ""; // 值类型
    for (var key in obj) {
      // 默认值都不传递
      if (
        (key === "pageSize" && obj[key] === 10) ||
        (key === "pageNumber" && obj[key] === 1) ||
        (key === "orderMrowTime" && obj[key] === 0)
      ) {
        continue;
      }
      type = typeof obj[key];
      switch (type) {
        case "string":
          if (obj[key].trim() !== "") {
            result[key] = obj[key];
          }
          break;
        case null:
          break;
        default:
          result[key] = obj[key];
          break;
      }
    }
    return result;
  },
  // 用于计算两个时间的年龄差，返回类似 10岁零2个月  的字符串
  computeDetailAge(fromTime, endTime) {
    var fromArray = fromTime.split("-");
    var endArray = endTime.split("-");
    var diffArray = [];
    var result = "";
    fromArray[1] = parseInt(fromArray[1]);
    endArray[1] = parseInt(endArray[1]);
    // 先算月份差
    if (fromArray[1] > endArray[1]) {
      endArray[0] -= 1;
      endArray[1] += 12;
    }
    diffArray.push(endArray[0] - fromArray[0]);
    diffArray.push(endArray[1] - fromArray[1]);
    diffArray[0] && (result += diffArray[0] + "岁");
    diffArray[1] &&
      (result += (diffArray[0] ? "零" : "") + diffArray[1] + "个月");
    return result;
  },
  // 用于计算两个时间的时间差-单位为天数
  computeDiffDays(fromTime, endTime) {
    return moment(endTime).diff(fromTime, "days");
  }
};
export default methods;
