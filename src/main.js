import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import moment from 'moment-timezone'


moment.tz.setDefault('europe/berlin')

Date.prototype.toJSON = function(){ return moment(this).format(); }

axios.defaults.baseURL = "https://pgm-services.herokuapp.com/";
//axios.defaults.baseURL = "http://localhost:8081/";
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
