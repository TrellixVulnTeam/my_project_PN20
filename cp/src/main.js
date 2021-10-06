import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueI18n from "vue-i18n";
import moment from "moment";
import "moment/locale/zh-cn";
import "./components/lazy_antd";
require("./utils/Prototype");

/*引入资源请求插件*/
import VueResource from "vue-resource";

Vue.config.productionTip = false;

/*使用插件*/
Vue.use(VueResource);
// 如果我们通过全局配置了，请求的数据接口 根域名，则在每次单独发起 http 请求的时候，请求的 url 路径，应该以相对路径开头，前面不能带 /  ，否则 不会启用根路径做拼接；
//Vue.http.options.root = "https://sp0.baidu.com/";
Vue.http.options.root = "http://127.0.0.1:9330/";
// 全局启用 emulateJSON 选项
Vue.http.options.emulateJSON = true;

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "zh", // 定义默认语言为中文
  messages: {
    zh: require("./VueI18n/language-zh"),
    en: require("./VueI18n/language-en"),
  },
});

// 设置本地时区
moment.locale("zh-cn");
Vue.prototype.$moment = moment;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
