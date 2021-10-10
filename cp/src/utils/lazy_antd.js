import Vue from "vue";

// base library
import {
  notification,
  message,
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
  Calendar,
  Switch,
  Space,
  DatePicker,
  Slider,
  List,
  Avatar,
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
  .use(Calendar)
  .use(Switch)
  .use(Space)
  .use(DatePicker)
  .use(Slider)
  .use(List)
  .use(Avatar)
  .use(Pagination);

Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;

process.env.NODE_ENV !== "production" &&
  console.warn("[jeecg-boot-vue] NOTICE: Antd use lazy-load.");
