import { auth } from "./auth.module";
import Vue from 'vue';
import axios from "axios";
import Vuex from 'vuex';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
    productLabels: [],
    productOrigins: [],
    productTypes : []
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    SET_PRODUCT_LABELS(state, productLabels) {
      state.productLabels = productLabels;
    },
    SET_PRODUCT_ORIGINS(state, productOrigins) {
      state.productOrigins = productOrigins;
    },
    SET_PRODUCT_TYPES(state, productTypes) {
      state.productTypes = productTypes;
    }
  },
  actions: {

    async fetchProducts({ commit }) {
      try {
        const data = await axios.get('/products')
        commit('SET_PRODUCTS', data.data)
      }
      catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async fetchProductLabels({ commit }) {
      try {
        const data = await axios.get('/productLabels')
        commit('SET_PRODUCT_LABELS', data.data)
      }
      catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async fetchProductOrigins({ commit }) {
      try {
        const data = await axios.get('/productOrigins')
        commit('SET_PRODUCT_ORIGINS', data.data)
      }
      catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async fetchProductTypes({ commit }) {
      try {
        const data = await axios.get('/productTypes')
        commit('SET_PRODUCT_TYPES', data.data)
      }
      catch (error) {
        alert(error)
        console.log(error)
      }
    },

  },
  getters: {
    products: state => { state.products },
    productLabels : state => {state.productLabels},
    productOrigins : state => {state.productOrigins},
    productTypes : state => {state.productTypes}
  },


  modules: {
    auth,
  },
});


