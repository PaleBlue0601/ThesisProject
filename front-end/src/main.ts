import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import VueCookies from 'vue-cookies';
import 'ant-design-vue/dist/antd.css';
import socketApi from './utils/socked';

// 全局设置样式
import './common/common.css'

Vue.use(VueCookies)
Vue.use(Antd)
Vue.prototype.$socketApi = socketApi;
Vue.config.productionTip = false

// 设置路由全局前置守卫 
router.beforeEach((to, from, next) => {
  const { name } = to
  store.commit('indexPageNameUpdate', name)
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



