import Vue from "vue";
import Vuex from "vuex";
import system from "./modules/system";
import persist from "./persist";
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    // 注册modules中的模块
    system
  },
  plugins: [persist]
});
