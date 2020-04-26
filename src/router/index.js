import Vue from 'vue'
import Router from 'vue-router'
import Login from './../components/login'
import TB from '@/components/tb'
import Home from './../components/home'
import UserCentre from './../components/userCentre'
import Encrytion from './../components/encrytion'
import Problemroom from './../components/problemroom'
import Kongtiao from './../components/kongtiao'
import Config from './../components/config'
import ConfigDetail from './../components/configDetail'
import Eqlist from './../components/eqlist'
import Second from './../components/second'
import Relay from './../components/relay'
import EquipmentList from './../components/equipmentList'
import Timing from '@/components/timing/timing'
import TimingList from '@/components/timingList'
import Select from './../components/timing/select'
import Selectroom from './../components/timing/selectroom'
import TimingControl from './../components/timing/timingControl'
import Setting from './../components/setting'

Vue.use(Router)


// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     next();
//   } else {
//     let token = localStorage.getItem('Authorization');

//     if (token === 'null' || token === '') {
//       next('/login');
//     } else {
//       next();
//     }
//   }
// });


export default new Router({
  routes: [{
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/',
      name: 'TB',
      component: TB,
      children: [{
          path: '/',
          name: 'Home',
          component: Home,
          meta: {
            needLogin: true //需要加校检判断的路由
          },
        },
        {
          path: '/home',
          name: 'Home',
          component: Home,
          meta: {
            needLogin: true //需要加校检判断的路由
          },
        },
        {
          path: '/userCentre',
          name: 'UserCentre',
          component: UserCentre
        },
        {
          path: '/setting',
          name: 'Setting',
          component: Setting
        },
        {
          path: '/encrytion',
          name: 'Encrytion',
          component: Encrytion
        },
        {
          path: '/second',
          name: 'Second',
          component: Second
        },
        {
          path: '/relay',
          name: 'Relay',
          component: Relay
        },
        {
          path: '/problemroom',
          name: 'Problemroom',
          component: Problemroom
        },
        {
          path: '/kongtiao',
          name: 'Kongtiao',
          component: Kongtiao
        },
        {
          path: 'timingList',
          name: 'TimingList',
          component: TimingList
        },
        {
          path: '/timing',
          name: 'Timing',
          component: Timing,
          children: [{
              path: '/timing/select',
              name: 'Select',
              component: Select,
            },
            {
              path: '/timing/selectroom',
              name: 'Selectroom',
              component: Selectroom,
            },
            {
              path: '/timing/timingControl',
              name: 'TimingControl',
              component: TimingControl,
            }
          ]
        },
        {
          path: '/config',
          name: 'Config',
          component: Config
        },

        {
          path: '/configDetail/:id',
          name: 'ConfigDetail',
          component: ConfigDetail
        },
        {
          path: '/eqlist/:id',
          name: 'Eqlist',
          component: Eqlist
        },
        {
          path: '/equipmentList/:id',
          name: 'EquipmentList',
          component: EquipmentList
        }

      ]
    }
  ]
})
