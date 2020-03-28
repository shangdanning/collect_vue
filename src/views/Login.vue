<template>
  <div class="login">
    <div class="login-bg"></div>
    <div class="loginContent">
      <div class="loginCon">
        <h1>智能安防社区数据接入平台</h1>
        <div class="loginCon-box">
          <div class="input-con user-input">
            <input
              type="text"
              class="form-control"
              v-model="user.account"
              placeholder="请输入用户名"
            />
          </div>
          <div class="input-con password-input">
            <input
              type="password"
              class="form-control"
              v-model="user.password"
              placeholder="请输入密码"
              @keydown.down.13="keyEnter()"
            />
          </div>
          <div class="remember-user">
            <input
              type="checkbox"
              v-model="isRememberUser"
              @change="rememberUser()"
            />
            <span>记住用户名</span>
          </div>
          <button class="btn-login" @click="loginClick()">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { mapActions } from "vuex";
import { AC_SYS_DIC_DATA } from "@/common/business/constants";
export default {
  name: "Login",
  data() {
    return {
      isRememberUser: false,
      user: {
        account: "",
        password: ""
      }
    };
  },
  mounted() {
    if (localStorage.getItem("currentSaveUsr")) {
      this.user.account = localStorage.getItem("currentSaveUsr");
      this.user.password = "";
      this.isRememberUser = true;
    }
  },
  methods: {
    keyEnter() {
      this.loginClick();
    },
    rememberUser() {
      if (this.isRememberUser) {
        localStorage.setItem("currentSaveUsr", this.user.account);
      } else {
        localStorage.removeItem("currentSaveUsr");
      }
    },

    // 登录
    loginClick() {
      const self = this;
      // 记住用户名
      if (this.isRememberUser) {
        localStorage.setItem("currentSaveUsr", this.user.account);
      }

      if (this.user.account.trim() === "") {
        this.$message({
          message: "请填写正确的用户名！",
          type: "error"
        });
        return;
      }
      if (this.user.password.trim() === "") {
        this.$message({
          message: "密码不为空！",
          type: "error"
        });
        return;
      }

      var req = {
        account: this.user.account,
        password: md5(this.user.password)
      };

      this.$http("systemAPI", "userLogin", req)
        .then(resp => {
          if (resp.data.data.status == "success") {
            self.$router.push({ path: "/DataCollect" });
            self.$message({
              message: "登陆成功",
              type: "success"
            });
            self.$parent.$data.userName = self.user.account;
            this.getDicInfo();
          } else {
            self.$message({
              message: resp.data.data.status,
              type: "error"
            });
          }
        })
        .catch(function() {
          self.$message({
            message: "登陆失败",
            type: "error"
          });
        })
        .finally(function() {});
    },
    ...mapActions({
      getDicInfo: AC_SYS_DIC_DATA
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  height: 100% !important;
}
.login-bg {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: url(../assets/img/login_bg.png) no-repeat;
  background-size: cover;
  z-index: -1;
}
.loginContent .loginCon {
  position: absolute;
  width: 649px;
  left: 50%;
  top: 20%;
}
.loginContent .loginCon h1 {
  font-size: 40px;
  font-weight: bold;
  color: #fff;
  text-align: center;
}
.loginContent .loginCon-box {
  width: 330px;
  margin: 60px auto 0;
}
.loginContent .loginCon-box .input-con {
  width: 330px;
  height: 40px;
  border-radius: 8px;
  background: #fff;
  margin: 20px auto;
  position: relative;
}
.loginContent .loginCon-box .input-con input {
  background: transparent;
  width: 100%;
  height: 100%;
  font-size: 14px;
  border-radius: 8px;
  padding-left: 53px;
}
.loginContent .loginCon-box .input-con:before {
  position: absolute;
  content: "";
  width: 20px;
  height: 25px;
  left: 15px;
  top: 8px;
  background: url(../assets/img/login_icon.png) no-repeat;
}
.loginContent .loginCon-box .user-input:before {
  background-position: 0 0;
}
.loginContent .loginCon-box .password-input:before {
  background-position: 0 -25px;
}
.loginContent .loginCon-box .remember-user {
  color: #fff;
  text-align: left;
}
.loginContent .loginCon-box .remember-user input {
  display: inline-block;
  vertical-align: middle;
  margin: 0 10px 0 10px;
}
.loginContent .loginCon-box .btn-login {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 8px;
  font-size: 20px;
  margin-top: 50px;
  background: -webkit-linear-gradient(to right, #f4bb32, #a4d4af);
  background: linear-gradient(to right, #f4bb32, #a4d4af);
  background: -ms-linear-gradient(to right, #f4bb32, #a4d4af);
}
</style>
