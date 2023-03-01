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
    productTypes : [],
    producers: [],
    producerLabels: [],
    producerOrigins: [],
    producerTypes: [],
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
    },
    SET_PRODUCERS(state, producers) {
      state.producers = producers;
    },
    SET_PRODUCER_LABELS(state, producerLabels) {
      state.producerLabels = producerLabels;
    },
    SET_PRODUCER_ORIGINS(state, producerOrigins) {
      state.producerOrigins = producerOrigins;
    },
    SET_PRODUCER_TYPES(state, producerTypes) {
      state.producerTypes = producerTypes;
    },
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
    async fetchProducers({ commit }) {
      try {
        const data = await axios.get('/producers')
        commit('SET_PRODUCERS', data.data)
      }
      catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async fetchProducerLabels({ commit }) {
      try {
        const data = await axios.get('/certificates')
        commit('SET_PRODUCER_LABELS', data.data)
      }
      catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async fetchProducerOrigins({ commit }) {
      try {
        const data = await axios.get('/producerOrigins')
        commit('SET_PRODUCER_ORIGINS', data.data)
      }
      catch (error) {
        alert(error)
        console.log(error)
      }
    },
    async fetchProducerTypes({ commit }) {
      try {
        const data = await axios.get('/producerTypes')
        commit('SET_PRODUCER_TYPES', data.data)
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
    productTypes : state => {state.productTypes},
    producers: state => { state.producers },
    producerLabels : state => {state.certificates},
    producerOrigins : state => {state.producerOrigins},
    producerTypes : state => {state.producerTypes},
  },


  modules: {
    auth,
  },
});


