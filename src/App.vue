<template>
  <div id="app">
    <el-container class="page">
      <el-header class="header">
        <TheHeader class="headerFixed" />
      </el-header>
      <el-container class="content">
        <!-- <el-aside class="aside">
          <TheNavMenu class="navFixed" />
        </el-aside>-->

        <el-main class="el-main">
          <router-view v-if="isRouterAlive" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import TheHeader from "@/components/TheHeader";
// import TheNavMenu from "@/components/TheNavMenu";
export default {
  name: "app",
  components: {
    TheHeader
    // ,TheNavMenu
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  computed: {
    // ...mapState({
    //   isLogged: state => state.system.isLogged
    // })
  },
  mounted() {
    require("./assets/css/base.less");
    require("./assets/css/elementUI.less");
    require("./assets/css/reset.css");
    require("./assets/css/bootstrap.css");
  },
  methods: {
    reload() {
      // this.isRouterAlive = false;
      // this.$nextTick(function() {
      //   this.isRouterAlive = true;
      // });
    }
  }
};
</script>
<style lang="less">
#app {
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 14px;
}
.page {
  position: relative;
  height: 100%;
  .header {
    padding: 0px !important;
  }
  .el-main {
    padding: 10px !important;
  }
}
</style>
