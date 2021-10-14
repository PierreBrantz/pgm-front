<template>
  <b-container fluid>
    <b-row v-for="product in products" :key="product.id">
      <b-col cols="3">
        {{ product.name }}
      </b-col>
      
      <b-col
        cols="3"
        v-for="
          season in product.seasonInformation"
        :key="season.id"
        class="form-inline"
      >
        <b-card v-bind:id="'card' + season.id">
          <div class="form-inline">
            <b-form-datepicker
              v-model="season.startDate"
              size="sm"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              @input="get_data()"
            ></b-form-datepicker>

            <b-form-datepicker
              v-model="season.endDate"
              size="sm"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
            ></b-form-datepicker>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      products: [],
      value: ""
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
      this.products = json;
    },
    get_data(){
       console.log('this.season.startDate');
  
    }
  },
};
</script>

  <style>
  #card1 {
  border: solid;
  border-color: rgb(221, 21, 47);
  margin-top: 1px;
}
#card2 {
  border: solid;
  border-color: rgb(42, 42, 216);
  margin-top: 1px;
}
#card3 {
  border: solid;
  border-color: rgb(126, 216, 42);
  margin-top: 1px;
}

.card-body {
  padding: 0px;
}

.b-form-btn-label-control.form-control > .form-control {
  font-size: 0.7rem;
}
</style> 