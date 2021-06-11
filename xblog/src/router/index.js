import Vue from 'vue'
import Router from 'vue-router'
import index from '../views/index'

Vue.use(Router)

const routes = [
  {
    path:'/',
    redirect:'/index'
  },
  {
    path: '/index',
    name: 'index',
    component: index
  },

]

const router = new Router({
  routes,
  mode:'history'
})

export default router
