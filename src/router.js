import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login,
      meta: {
        noLayout: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ './views/Register.vue')
    },
    {
      path: '/userlist',
      name: 'userlist',
      component: () => import(/* webpackChunkName: "userlist" */ './views/UserList.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "Home" */ './views/Home.vue')
    },
    {
      path: '/categorylist',
      name: 'categorylist',
      component: () => import(/* webpackChunkName: "categorylist" */ './views/CategoryList.vue')
    },
    {
      path: '/article/new',
      name: 'articlenew',
      component: () => import(/* webpackChunkName: "articleNew" */ './views/Article/New.vue')
    },
    {
      path: '/article/list',
      name: 'articlelist',
      component: () => import(/* webpackChunkName: "articlelist" */ './views/Article/List.vue')
    },
    {
      path: '/article/detail/:id',
      name: 'articledetail',
      component: () => import(/* webpackChunkName: "articledetail" */ './views/Article/Detail.vue')
    },
  ]
})
