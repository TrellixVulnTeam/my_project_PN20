import Vue from "vue";
import VueRouter from "vue-router";
import Index from "@/views/Index.vue";
import Summary from "@/views/Summary.vue";
import ColdAndHot from "@/views/ColdAndHot.vue";
import KillNumber from "@/views/KillNumber.vue";
import Quotient from "@/views/Quotient.vue";
import Surplus from "@/views/Surplus.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
  },
  {
    path: "/Summary", //汇总
    name: "Summary",
    component: Summary,
  },
  {
    path: "/ColdAndHot", //冷热分析
    name: "ColdAndHot",
    component: ColdAndHot,
  },
  {
    path: "/Surplus", //取余分析
    name: "Surplus",
    component: Surplus,
  },
  {
    path: "/Quotient", //取商分析
    name: "Quotient",
    component: Quotient,
  },
  {
    path: "/KillNumber", //杀号分析
    name: "KillNumber",
    component: KillNumber,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};

export default router;
