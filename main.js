import Vue from 'vue'
import App from './App'
import uView from 'uview-ui';
import { tipsUtils } from '@/utils/tips.js'
import { jumpUtils } from '@/utils/jump.js'
import { utils } from '@/utils/util.js'
import store from '@/store'
import NavBar from "@/components/NavBar";

Vue.prototype.$store = store
Vue.prototype.$jumpUtils = jumpUtils
Vue.prototype.$tipsUtils = tipsUtils
Vue.prototype.$utils = utils
Vue.component("nav-bar", NavBar);
Vue.config.productionTip = false

// 获取系统设备信息
uni.getSystemInfo({
  success: function (res) {
    Vue.prototype.$systemInfo = res
  }
});

Vue.use(uView);

App.mpType = 'app'
const app = new Vue({
  store,
  ...App
})
app.$mount()
