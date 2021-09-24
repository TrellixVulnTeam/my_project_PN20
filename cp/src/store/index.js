import Vue from "vue";
import Vuex from "vuex";
import SummaryStore from "./modules/SummaryStore";
import TableStore from "./modules/TableStore";
import EchartsStore from "./modules/EchartsStore";
import QuotientStore from "./modules/QuotientStore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: { SummaryStore, TableStore, EchartsStore, QuotientStore },
});
