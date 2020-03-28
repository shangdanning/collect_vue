<template>
  <div class="dataMapping">
    <div class="headLine">
      <h5 class="title">字段映射</h5>
    </div>
    <div class="block">
      <div class="topContent">
        <div class="searchBox">
          <div class="searchItem">
            <label>厂家类型：</label>
            <el-select v-model="searchData.factoryCode" size="small" clearable>
              <el-option
                v-for="item in factoryCode"
                :key="item.id"
                :label="item.dictDataName"
                :value="item.dictDataValue"
              ></el-option>
            </el-select>
          </div>
          <div class="searchItem">
            <label>数据类型：</label>
            <el-select v-model="searchData.dataType" size="small" clearable>
              <el-option
                v-for="item in dataType"
                :key="item.id"
                :label="item.dictDataName"
                :value="item.dictDataValue"
              ></el-option>
            </el-select>
          </div>
          <div class="flex-button-box">
            <el-button
              class="flex-button-item"
              type="primary"
              size="small"
              @click="queryList"
              >查询</el-button
            >
          </div>
        </div>
      </div>
      <div class="content">
        <el-form
          v-for="(mapDataColumn, index) in mapData"
          :model="
            index === 0
              ? form0
              : index === 1
              ? form1
              : index === 2
              ? form2
              : index === 3
              ? form3
              : ''
          "
          :key="index"
          :rules="rules[index]"
          :ref="'form' + index"
          label-width="110px"
          class="formStyle"
        >
          <el-form-item
            v-for="item in mapDataColumn['form' + index]"
            :key="item.beanValue"
            :label="item.beanName + '：'"
            :prop="item.beanValue"
          >
            <el-input
              v-if="index === 0"
              :disabled="pageStatus === 'see'"
              v-model="form0[item.beanValue]"
            ></el-input>
            <el-input
              v-if="index === 1"
              :disabled="pageStatus === 'see'"
              v-model="form1[item.beanValue]"
            ></el-input>
            <el-input
              v-if="index === 2"
              :disabled="pageStatus === 'see'"
              v-model="form2[item.beanValue]"
            ></el-input>
            <el-input
              v-if="index === 3"
              :disabled="pageStatus === 'see'"
              v-model="form3[item.beanValue]"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="flex-button-box" v-show="pageStatus === 'edit'">
        <el-button class="flex-button-item" type="primary" @click="submit()"
          >提交</el-button
        >
        <el-button class="flex-button-item" @click="cancle()">取消</el-button>
      </div>
      <div class="flex-button-box" v-show="pageStatus === 'see'">
        <el-button class="flex-button-item" type="primary" @click="edit()"
          >编辑</el-button
        >
      </div>
    </div>
    <div
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(0, 0, 0, 0)"
    ></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import toolMethods from "@/common/business/toolMethods";
export default {
  name: "DataMapping",
  data() {
    return {
      // 页面有两种状态 edit/see
      pageStatus: "see",
      fullscreenLoading: false,
      columnNum: 4,
      searchData: {
        factoryCode: "",
        dataType: ""
      },
      searchedData: {
        factoryCode: "",
        dataType: ""
      },
      //从服务端获取的源数组
      originData: [],
      //页面中的-四列的二维数组
      mapData: [],
      //原始表单，用于取消操作
      originForm: {},
      //页面中的-实际操作的四个表单
      form0: {},
      form1: {},
      form2: {},
      form3: {},
      rules: []
    };
  },
  computed: {
    ...mapState({
      factoryCode: state => state.system.dicData.factoryCode,
      dataType: state => state.system.dicData.dataType
    })
  },
  created() {
    // this.searchData.factoryCode = this.factoryCode[0].dictDataValue;
    // this.searchData.dataType = this.dataType[0].dictDataValue;
    this.queryList();
  },
  methods: {
    edit() {
      this.pageStatus = "edit";
    },
    cancle() {
      for (let index = 0; index < this.columnNum; index++) {
        this["form" + index] = JSON.parse(
          JSON.stringify(this.originForm["form" + index])
        );
      }
      this.pageStatus = "see";
    },
    queryList() {
      var mapData = [];
      this.fullscreenLoading = true;
      this.$http(
        "collectAPI",
        "getMappingList",
        toolMethods.filterGetParams(this.searchData)
      )
        .then(data => {
          // mapData=data.data.data;
          if (typeof data === "string") {
            data = JSON.parse(data);
          }
          mapData = data;
          //获取报错,弹出消息框
          // if (data.data.code !== 200) {
          //   this.$message({
          //     message: data.data.message,
          //     type: "error"
          //   });
          //   return;
          // }
          //赋值源数组
          this.originData = JSON.parse(JSON.stringify(mapData));
          let arrayList = this.grouping(mapData);
          let ruleList = this.setRules(arrayList);
          this.mapData = arrayList;
          //赋值规则
          this.rules = ruleList;
          //赋值已经查询的条件,后续保存时用
          this.searchedData.factoryCode = this.searchData.factoryCode;
          this.searchedData.dataType = this.searchData.dataType;
        })
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //设置规则
    setRules(arrayList) {
      //from: [  [ {
      //   beanValue: "villageName5",
      //   externalValue: "name5",
      //   beanName: "小区名称5",
      //   notNull: 1
      // }],[],[],[]]
      //to: [
      //   {
      //     villageCode: [
      //       { required: true, message: "请输入小区编码", trigger: "blur" }
      //     ]
      //   },
      //   {}, {}, {} ]
      var rulesList = [];
      var rulesItem = {};
      arrayList.forEach((array, index) => {
        rulesItem = {};
        array["form" + index].forEach(item => {
          if (item.notNull) {
            rulesItem[item.beanValue] = [
              {
                required: true,
                message: "请输入" + item.beanName,
                trigger: "blur"
              }
            ];
          }
        });
        rulesList.push(rulesItem);
      });
      return rulesList;
    },
    //分组
    grouping(arrayList) {
      arrayList.forEach(item => {
        item[item.beanValue] = item.externalValue;
      });
      // 共有几行
      var oneLength = Math.round(arrayList.length / this.columnNum);
      //取余
      var leftNum = arrayList.length % this.columnNum;
      // 每一列的数量 [2,2,1,1]
      var eachColumnNum = [];
      for (let index = 0; index < this.columnNum; index++) {
        if (index < leftNum) {
          eachColumnNum.push(oneLength);
        } else {
          eachColumnNum.push(oneLength - 1);
        }
      }
      //填充二维数组
      var arrayNew = [];
      var startItemIndex = 0;
      for (let index = 0; index < this.columnNum; index++) {
        let arrayItemTemp = arrayList.slice(
          startItemIndex,
          startItemIndex + eachColumnNum[index]
        );
        startItemIndex = startItemIndex + eachColumnNum[index];
        let obj = {};
        obj["form" + index] = arrayItemTemp;
        arrayNew.push(obj);
      }
      //赋值数组真值
      arrayNew.forEach((array, index) => {
        array["form" + index].forEach(item => {
          this.$set(
            this["form" + index],
            item.beanValue,
            item.externalValue ? item.externalValue : ""
          );
        });
      });
      //备份源数组真值
      for (let index = 0; index < this.columnNum; index++) {
        this.originForm["form" + index] = JSON.parse(
          JSON.stringify(this["form" + index])
        );
      }
      return arrayNew;
    },
    //提交表单
    async submit() {
      //多表单启动验证
      let formNameList = ["form0", "form1", "form2", "form3"];
      var result = true;
      for (let index = 0; index < formNameList.length; index++) {
        await this.$refs[formNameList[index]][0].validate(e => {
          result = e;
        });
        if (!result) break;
      }
      if (!result) {
        return;
      } else {
        //保存表单
        this.saveMapping();
      }
    },
    saveMapping() {
      this.fullscreenLoading = true;
      var request = {
        factoryCode: this.searchedData.factoryCode,
        dataType: this.searchedData.dataType,
        jsonStr: ""
      };
      //遍历四个表单，填充原始数组  this.originData
      for (let index = 0; index < this.originData.length; index++) {
        let key = this.originData[index]["beanValue"];
        for (let i = 0; i < this.columnNum; i++) {
          if (this["form" + i][key] !== undefined) {
            this.originData[index]["externalValue"] = this["form" + i][key];
          }
        }
      }
      request.jsonStr = JSON.stringify(this.originData);
      console.log(request);
      this.$http("collectAPI", "saveMappingList", request)
        .then(data => {
          // data=data.data.data;
          if (typeof data === "string") {
            data = JSON.parse(data);
          }
          if (data.status == "success") {
            this.$message({
              message: "保存成功!",
              type: "success"
            });

            this.queryList();
            this.pageStatus = "see";
          } else {
            this.$message({
              message: "保存失败!",
              type: "error"
            });
          }
        })
        .finally(() => {
          this.fullscreenLoading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.dataMapping {
  position: relative;
  height: 100%;
  // margin: 70px 10px 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  .headLine {
    .title {
      padding: 0 16px;
      margin: 0;
      line-height: 45px;
      border-bottom: #e1e1e1 solid 1px;
      text-align: left;
      font-size: 16px;
      color: #666;
    }
  }
  .block {
    padding: 20px 30px;
    .topContent {
      .searchBox {
        display: flex;
        flex-wrap: wrap;
        padding-left: 20px;
        .searchItem {
          margin: 0 40px 10px 0;
        }
      }
      .flex-button-box {
        padding-right: 0px !important;
        margin-bottom: 10px;
        .flex-button-item {
          margin-left: 0px !important;
        }
      }
    }
    .content {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
  }
}
</style>
