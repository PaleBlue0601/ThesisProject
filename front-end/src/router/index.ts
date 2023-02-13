import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('@/views/User.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/Chat.vue')
  },
  {
    path: '/peopleobject',
    name: 'peopleObject',
    component: () => import('@/views/PeopleObject.vue')
  },
  {
    path: '/user/settings',
    name: 'user_settings',
    component: () => import('@/views/user/UserSettings.vue'),
    children: [
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/user/Profile.vue'),
      },
      {
        path: 'deliver_address',
        name: 'deliver_address',
        component: () => import('@/views/user/DeliverAddress.vue'),
      }
    ]
  },
  {
    path: '/objectexchange',
    name: 'objectExchange',
    component: () => import('@/views/ObjectExchange.vue')
  },
  {
    path: '/objectdetail/:id',
    name: 'objectDetail',
    component: () => import('@/views/ObjectDetail.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
