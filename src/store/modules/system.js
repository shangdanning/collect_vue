/**
 * Created by shangdanning on 2020/1/2.
 * 系统相关的状态管理
 */
import { MU_SYS_DIC_DATA, AC_SYS_DIC_DATA } from "@/common/business/constants";
import { service } from "@/api/globalAccess";
let state = {
  dicData: {}
};
let mutations = {
  [MU_SYS_DIC_DATA]: (state, data) => {
    state.dicData = data;
  }
};

let actions = {
  // 获取系统字典
  async [AC_SYS_DIC_DATA]({ commit }) {
    // let dictCodeArray = [
    //   "gender",
    //   "mogState",
    //   "beginIllType",
    //   "prodromicSymptomCode",
    //   "allSymptomCode",
    //   "centralHypoventilationType",
    //   "nmdaPositive",
    //   "chartAbnormal",
    //   "mogPositive",
    //   "overSymptom",
    //   "grug"
    // ];
    // 获取系统字典
    var data = await service("systemAPI", "getDic");
    let handleData = {};
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    data.forEach(item => {
      handleData[item.dictCode] = item.list;
    });

    commit(MU_SYS_DIC_DATA, handleData);
  }
};

export default {
  state,
  actions,
  mutations
};
