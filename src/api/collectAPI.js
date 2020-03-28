/**
 * Created by shangdanning on 2019/12/31.
 * 推荐使用restful风格
 * 采集相关接口
 */

/**
 *urlParams :url上是否有参数
 *mock：是否使用Mock请求数据
 */
export const collectAPI = {
  /** api 案例
  baseInfo: {
    url: "/ftfj/intelligence/baseInfo",
    method: "post",

  },
  importData: {
    url: "/ftfj/intelligence/importData",
    method: "post",
    timeout: 15000,
    headers: {
      "Content-type": "multipart/form-data"
    }
  },  **/
  // 添加患者临床症状
  // addClinical: {
  //   // 真正的请求url
  //   url: "/hosp/patient/*/symptom",
  //   // 本地Mock测试使用的url
  //   // url: "/hosp/patient/symptom",
  //   method: "post",
  //   urlParams: 1
  // }

  // 获取数据源列表
  getDataSourceListByParam: {
    url: "/zhsq/dataSource/getDataSourceListByParam",
    method: "get"
  },
  // 新增数据源
  addDataSource: {
    url: "/zhsq/dataSource/addDataSource",
    method: "post"
  },
  // 更新数据源
  updateDataSource: {
    url: "/zhsq/dataSource/updateDataSource",
    method: "put"
  },
  // 删除数据源
  deleteDataSource: {
    url: "/zhsq/dataSource/deleteDataSource",
    method: "delete"
  },
  // 新增采集任务
  addCollectTask: {
    url: "/zhsq/collectTask/addCollectTask",
    method: "post"
  },
  // 删除采集任务
  deleteCollectTask: {
    url: "/zhsq/collectTask/deleteCollectTask",
    method: "delete"
  },
  // 获取采集任务列表
  getCollectTaskListByParam: {
    url: "/zhsq/collectTask/getCollectTaskListByParam",
    method: "post"
  },
  // 更新采集任务
  updateCollectTask: {
    url: "/zhsq/collectTask/updateCollectTask",
    method: "post"
  },
  // 获取动态数据库字段列
  getDynamicDbColumn: {
    url: "/zhsq/collectTask/getDynamicDbColumn",
    method: "post"
  },
  // 获取采集数据类型对应列表
  getCollectMappingList: {
    url: "/zhsq/collectTask/getCollectMappingList",
    method: "get"
  },
  // 获取中心服务地址
  getSysParams: {
    url: "/zhsq/system/getSysParams",
    method: "get"
  },
  // 修改中心服务地址
  updateSysParams: {
    url: "/zhsq/system/updateSysParams",
    method: "post"
  },
  // 启动停止
  updateCollectTaskRunStatus: {
    url: "/zhsq/collectTask/updateCollectTaskRunStatus",
    method: "post"
  },
  // 查询字段映射
  getMappingList: {
    url: "/zhsq/system/fieldTransform/mappingList",
    method: "get",
    mock: 1
  },
  // 保存字段映射
  saveMappingList: {
    url: "/zhsq/system/fieldTransform/saveMappingList",
    method: "post",
    mock: 1
  }
};
