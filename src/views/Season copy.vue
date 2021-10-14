<template>
  <div>
    <b-container fluid>
      <div>
        <b-table striped hover :items="products">
          <template #cell(startDate1)="data">
            <b-form-datepicker v-model="data.value"></b-form-datepicker>
          </template>
          <template #cell(endDate1)="data">
            <b-form-datepicker v-model="data.value"></b-form-datepicker>
          </template>
          <template #cell(startDate2)="data">
            <b-form-datepicker v-model="data.value"></b-form-datepicker>
          </template>
          <template #cell(endDate2)="data">
            <b-form-datepicker v-model="data.value"></b-form-datepicker>
          </template>
          <template #cell(startDate3)="data">
            <b-form-datepicker v-model="data.value"></b-form-datepicker>
          </template>
          <template #cell(endDate3)="data">
            <b-form-datepicker v-model="data.value"></b-form-datepicker>
          </template>
        </b-table>
      </div>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";


export default {
  components: {
    
  },
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      const json = await axios
        .get("/products")
        .then((response) => (this.requests = response.data));
      json.forEach((element) =>
        this.products.push({
          produit: element.name,
          startDate1: "",
          endDate1: "",
          startDate2: "",
          endDate2: "",
          startDate3: "",
          endDate3: "",
        })
      );
    },
    /*async fetchSeasons() {
      const json = await axios
        .get("/seasons")
        .then((response) => (this.requests = response.data));
      json.forEach((element) =>
      
        this.seasons.push(element)
       
      );
    
    },*/
  },
};
</script>

<style>
</style>