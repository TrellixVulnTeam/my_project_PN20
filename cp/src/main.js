import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

/*引入资源请求插件*/
import VueResource from "vue-resource";

import {
  Layout,
  Icon,
  Menu,
  ConfigProvider,
  Table,
  Button,
  Pagination,
  Form,
  Input,
  Modal,
  Tooltip,
  Collapse,
  Drawer,
  InputNumber,
  Row,
  Col,
  Divider,
  Affix,
} from "ant-design-vue";
Vue.use(Layout)
  .use(Icon)
  .use(Menu)
  .use(ConfigProvider)
  .use(Table)
  .use(Button)
  .use(Form)
  .use(Input)
  .use(Modal)
  .use(Tooltip)
  .use(Collapse)
  .use(Drawer)
  .use(InputNumber)
  .use(Row)
  .use(Col)
  .use(Divider)
  .use(Affix)
  .use(Pagination);

Vue.config.productionTip = false;

/*使用插件*/
Vue.use(VueResource);

// 如果我们通过全局配置了，请求的数据接口 根域名，则在每次单独发起 http 请求的时候，请求的 url 路径，应该以相对路径开头，前面不能带 /  ，否则 不会启用根路径做拼接；
//Vue.http.options.root = "https://sp0.baidu.com/";
Vue.http.options.root = "http://127.0.0.1:9330/";
// 全局启用 emulateJSON 选项
Vue.http.options.emulateJSON = true;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
