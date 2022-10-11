import Vue from 'vue'
import VueRouter from 'vue-router'
import FullCalendar from "vue-full-calendar";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
// lazy-loaded
const Profile = () => import("../components/Profile.vue")

Vue.use(VueRouter)

const routes = [
   {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/profile",
    name: "profile",
    // lazy-loaded
    component: Profile,
  },

  {
    path: '/',
    name: 'producer',
    component: () =>
    import(/* webpackChunkName: "about" */ "../views/Producer.vue")
  },
  {
    path: '/weeklyPlanner',
    name: 'weeklyPlanner',
    component: () =>
    import(/* webpackChunkName: "about" */ "../views/WeeklyPlanner.vue")
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
  },
  {
    path: '/editproduct',
    name: 'editproduct',
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/EditProduct.vue")
  },

  {
    path: '/paramcontract',
    name: 'paramcontract',
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ParamContract.vue")
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
