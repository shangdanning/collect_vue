<template>
  <div class="topbarCon clearfix" v-if="this.$route.path !== '/'">
    <h2 class="pull-left">智能安防社区数据接入平台</h2>
    <ul class="topbar-r pull-right clearfix">
      <!-- <li class="pull-left topbar-r-list username">
					<span class="span-text user-text">超级管理员<i class="arrow-icon"></i></span>
					<span class="span-text" @click="changePassword()">修改密码</span>
				</li> -->
      <li class="pull-left topbar-r-list layout-text">
        <span class="span-text">超级管理员</span>
      </li>
      <li class="pull-left topbar-r-list version-text">
        <span class="span-text">版本信息</span>
        <div class="version">
          <div class="title">智能安防社区数据接入平台</div>
          <div class="title-english">
            Intelligent community collect system
          </div>
          <div class="version-num">版本号 V1.0</div>
          <span class="line-bg"></span>
          <img src="../assets/img/logo.png" />
          <div class="text-bottom">
            Copyright © 2018 NetPosa Technologies Ltd. All Rights Reserved
          </div>
        </div>
      </li>
      <li class="pull-left topbar-r-list layout-text">
        <!-- <span class="span-text" @click="loginout()">退出</span> -->
        <span class="span-text" @click="confirmLoginout()">退出</span>
      </li>
    </ul>
    <!--退出 start-->
    <el-dialog
      :visible.sync="loginoutDialog"
      width="25%"
      custom-class="loginoutDialog"
      :before-close="cancleLoginout"
    >
      <h4>确定退出系统吗？</h4>
      <span slot="footer" class="dialog-footer">
        <button class="btn btn-blue" @click="confirmLoginout()">确 定</button>
        <button class="btn" @click="cancleLoginout()">取 消</button>
      </span>
    </el-dialog>
    <!--退出 end-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginoutDialog: false,
      userName: ""
    };
  },
  methods: {
    // 退出登陆弹框
    loginout() {
      this.loginoutDialog = true;
    },
    // 确定退出
    confirmLoginout() {
      var self = this;
      this.loginoutDialog = false;
      if (!this.userName) {
        // 暂未登陆或已登陆超时
        this.$router.push({ path: "/" });
        return;
      }
      var request = {
        account: this.userName
      };
      this.$http("systemAPI", "goLogOut", request)
        .then(
          resp => {
            if (resp.data.code == 200 && resp.data.data.status == "success") {
              self.$router.push({ path: "/" });
              self.userName = "";
            }
          },
          () => {}
        )
        .catch(function() {})
        .finally(function() {});
    },
    // 取消退出
    cancleLoginout() {
      this.loginoutDialog = false;
    }
  }
};
</script>

<style scoped>
.topbarCon {
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background: #1c80ec;
  color: #fff;
  padding: 0 30px;
  z-index: 999;
}
.topbarCon h2 {
  font-size: 24px;
  font-weight: bold;
  line-height: 60px;
  margin: 0;
}
.topbarCon .topbar-r {
  margin: 0;
}
.topbarCon .topbar-r-list {
  cursor: pointer;
  font-size: 16px;
  position: relative;
}
.topbarCon .topbar-r-list .span-text {
  display: block;
  height: 60px;
  line-height: 60px;
  padding: 0 16px;
  text-align: center;
}
.topbarCon .topbar-r-list.username {
  padding: 0 10px;
  min-width: 118px;
  border: transparent solid 1px;
}
.topbarCon .username .user-text {
  border-bottom: transparent solid 1px;
  position: relative;
}
.topbarCon .username .arrow-icon {
  position: relative;
  width: 0px;
  height: 0px;
  border-width: 6px;
  border-style: solid;
  border-color: #fff transparent transparent transparent;
  top: 14px;
  margin-left: 6px;
}
.topbarCon .username .span-text:last-child {
  display: none;
}
.topbarCon .topbar-r-list.username:hover {
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-color: #ddd;
  border-top: none;
  color: #999;
}
.topbarCon .topbar-r-list.username:hover .user-text {
  border-color: #ddd;
}
.topbarCon .topbar-r-list.username:hover .user-text .arrow-icon {
  border-color: #999 transparent transparent transparent;
}
.topbarCon .topbar-r-list.username:hover .span-text:last-child {
  display: block;
}
.topbarCon .version {
  position: absolute;
  padding: 20px;
  top: 60px;
  right: -20px;
  width: 478px;
  height: 318px;
  text-align: center;
  background: #fff;
  border: #dbdbdb solid 1px;
  color: #333;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: none;
}
.topbarCon .version .title {
  font-size: 24px;
  margin: 30px 0 10px 0;
}
.topbarCon .version .title-english,
.topbarCon .version .version-num {
  font-size: 16px;
}
.topbarCon .version .version-num {
  margin: 30px 0 40px 0;
}
.topbarCon .version .text-bottom {
  font-size: 12px;
  color: #7d8493;
}
.topbarCon .version .line-bg {
  display: block;
  width: 386px;
  height: 1px;
  margin: 10px auto 18px auto;
  background: -webkit-radial-gradient(
    circle farthest-corner,
    rgba(0, 138, 255, 1),
    rgba(0, 138, 255, 0)
  );
  background: -moz-radial-gradient(
    circle farthest-corner,
    rgba(0, 138, 255, 1),
    rgba(0, 138, 255, 0)
  );
  background: -ms-radial-gradient(
    circle farthest-corner,
    rgba(0, 138, 255, 1),
    rgba(0, 138, 255, 0)
  );
  background: radial-gradient(
    circle farthest-corner,
    rgba(0, 138, 255, 1),
    rgba(0, 138, 255, 0)
  );
}
.topbarCon .version .text-bottom {
  margin-top: 10px;
}
.topbarCon .version-text:hover .version {
  display: block;
}
.changePWDialog .el-dialog__header {
  text-align: left;
}
.changePWDialog .el-dialog__body {
  padding-right: 50px;
}
.changePWDialog .el-dialog__footer {
  text-align: center;
}
.loginoutDialog .el-dialog__footer {
  text-align: center;
}
</style>
