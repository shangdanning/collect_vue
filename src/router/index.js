import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import DataCollect from "../views/DataCollect.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/DataCollect",
    name: "DataCollect",
    component: DataCollect
  },
  {
    path: "/DataCollect/:serviceId",
    name: "DataCollect",
    component: DataCollect
  },
  {
    path: "/DataMapping",
    name: "DataMapping",
    component: () => import("../views/DataMapping")
  }
];

const router = new VueRouter({
  routes
});

export default router;
