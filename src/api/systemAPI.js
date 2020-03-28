/**
 * Created by shangdanning on 2019/12/31.
 * 推荐使用restful风格
 * 系统相关接口
 */
export const systemAPI = {
  getDic: {
    url: "/zhsq/system/getDictionaryInfo",
    method: "get",
    mock: 1
  },
  // 登陆
  userLogin: {
    url: "/zhsq/system/login",
    method: "post"
    // mock: 1
  },
  // 登出[该接口应该为post]
  goLogOut: {
    url: "/zhsq/system/logout",
    method: "get"
    // mock: 1
  }
};
