import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import '@/assets/less/index.less'
import "@/assets/js/viewport.js"

// import { AjaxPlugin,WechatPlugin } from 'vux'

// const FastClick = require('fastclick')
// FastClick.attach(document.body)

// Vue.use(AjaxPlugin) // $http
// Vue.use(WechatPlugin) // $wechat
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
