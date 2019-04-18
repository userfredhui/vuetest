import Vue from 'vue'
import { 
  Button,
  Input,
  Table,
  TableColumn,Menu,
  Submenu,
  MenuItem,
  Message,
  MessageBox,
  Select,
  Option,
  Tag,
  Tabs,
  TabPane,
  Icon,
  Pagination,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Card,
  Switch,
  Popover
} from 'element-ui'

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Button)
Vue.use(Input)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.component(Message.name, Message)
Vue.component(MessageBox.name, MessageBox)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Icon)
Vue.use(Pagination)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Card)
Vue.use(Switch)
Vue.use(Popover)
Vue.prototype.$message = Message;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$confirm = MessageBox.confirm;