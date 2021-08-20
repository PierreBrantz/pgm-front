import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    events: [],
    products: [],
    productsForSelect: [],
    requests: []
  },
  getters: {
    getEvents(state){
      return state.events;
    },
    getProducts(state){
      return state.products;
    },
    getProductsForSelect(state){     
      return state.productsForSelect;
    },
    requests(state){
      return state.requests;
    }
    
  },
  mutations: {
    ADD_EVENT:(state, event) => {    
       state.events.push(event)
    },
    UPDATE_EVENT:(state, event) => {
      let eventToUpdate = state.events.find(item => {
        return item.id == event.id 
      })

      if(eventToUpdate){
        eventToUpdate.title = event.title;
        return;
      }

      state.events.push({
        eventToUpdate
      })

    },
    ADD_PRODUCT:(state, product) =>{
      state.products.push(product)
      state.productsForSelect.push({value: product.name, text: product.name})
    },
    SET_REQUESTS:(state, requests)=>{
      state.requests = requests;
    },
    SET_PRODUCTS:(state, products)=>{
      state.products = products       ;
    },
    ADD_REQUEST: (state, request) =>{
      state.requests.push(request)      
    },
    DELETE_REQUEST: (state, request) =>{      
      state.requests = state.requests.filter(item => {
        console.log(item);
        return item.id !== request.request.id;
      })  
    }
  },
  actions: {
   // async fetchRequests({ commit }){
   //   const json = await axios.get("/requests").then(response => this.requests = response.data);  
   //   commit("SET_REQUESTS", json);
   // },

    async fetchRequests({ commit }, month){
      
      const json = await axios.get("/requests/" + month.month).then(response => this.requests = response.data);  
      commit("SET_REQUESTS", json);
    },
    async created({ commit }, request) {

      const json = {
        id : request.request.id,
        name: request.request.name,
        startPeriod : request.request.startPeriod,
        endPeriod: request.request.endPeriod,
        quantity: request.request.quantity,
        unit: request.request.unit
      }
      const res = await axios.post("/requests", json).then(response => this.requests = response.data);
      commit("ADD_REQUEST", res);
    },
    async deleteRequest({ commit }, request) {
      const response = await axios.delete("/requests/" + request.request.id );
      commit("DELETE_REQUEST", request);
    },

    async fetchProducts({ commit }){
     console.log("TESTTEST");
      const json = await axios.get("/products").then(response => this.products = response.data);  
      console.log(json);
      commit("SET_PRODUCTS", json);
    },

  },
  modules: {
  }
})

