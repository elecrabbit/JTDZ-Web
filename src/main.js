// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
Vue.use(Vuex)

import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}


import store from "./store/index";
import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.prototype.$axios = axios
Vue.use(VueAxios, axios)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import _ from 'lodash';
Vue.prototype._ = _;

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.meta.needLogin) {
    if(localStorage.getItem("token")){
      next();
    }else {
      next('/login');
    }
  }else {
      next();
    }
});


// import localStorage from './localStorage';
// Vue.prototype.localStorage=localStorage;

// import mqtt from 'mqtt'
// Vue.prototype.$mqtt = mqtt

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
