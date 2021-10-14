import Vue from 'vue'
import VueRouter from 'vue-router'
import Agenda from '../views/Agenda.vue'
import FullCalendar from "vue-full-calendar";


import 'fullcalendar/dist/fullcalendar.css'
Vue.use(FullCalendar);

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'theoretical',
    component: () =>
    import(/* webpackChunkName: "about" */ "../views/Theoretical.vue")
  },
  {
    path: '/product',
    name: 'Product',
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Product.vue")
  },
  {
    path: '/request',
    name: 'Request',
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Request.vue")
  },
  {
    path: '/theoretical',
    name: 'theoretical',
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Theoretical.vue")
  },
  {
    path: '/producer',
    name: 'producer',
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Producer.vue")
  },
  {
    path: '/season',
    name: 'season',
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Season.vue")
  },
  {
    path: '/addproducer',
    name: 'addproducer',
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AddProducer.vue")
  },
  {
    path: '/addproduct',
    name: 'addproduct',
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AddProduct.vue")
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
