<template>
  <b-container fluid>
    <b-row class="rowLegend"
      ><b-col cols="4">
        <b-form-select
          v-model="selectedProduct"
          :options="products"
          v-on:change="changeProduct"
          class="m-2"
        ></b-form-select>
      </b-col>
      <b-col cols="4"></b-col>
      <b-col cols="3" class='legend-block'>
        <div class='my-legend'>
          <div class='legend-title'>Saisons</div>
          <div class='legend-scale'>
            <ul class='legend-labels'>
              <li><span style='background:#8DD3C7'></span>{{percents[0].name + " (" + percents[0].percent + "%)"}}</li>
               <li><span style='background:#cf750f'></span>{{percents[1].name + " (" + percents[1].percent + "%)"}}</li>
                <li><span style='background:#BEBADA'></span>{{percents[2].name + " (" + percents[2].percent + "%)"}}</li>
            </ul>
          </div>
        </div>
      </b-col>
     
    </b-row>
    <br><br><br>

    <b-row>

      
      <b-col
        cols="4"
        v-for="
          season in seasons"
        :key="season.seasonalityId"
        class="form-inline"
      >
        <b-card v-bind:id="'card' + season.seasonalityId">
          <div class="form-inline">
            <b-form-datepicker 
              v-model="season.startDate"
              size="sm"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              
            ></b-form-datepicker>

            <b-form-datepicker
              v-model="season.endDate"
              size="sm"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
            >
             
            </b-form-datepicker>
          </div>
        </b-card>
        
      </b-col>
      
    
    </b-row>
    <br><br><br><br><br><br>
    <b-row>
      <b-col cols="9"></b-col>
      <b-col v-if="selectedProduct != null">
        <b-button class="m-3" v-on:click="save()" variant="primary">Sauver</b-button>
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
      selectedProduct: null,
      seasons :[],
      product: null,
      products: [{ value: null, text: "Choisir un produit..." }],
      percents:[]
    };
  },
  beforeMount() {
    this.fetchProducts();
    this.fetchSeasonality();
     
  },
  methods: {
    async fetchSeasonality(){
      const json = await axios.get("/seasons").then((response) => (this.requests = response.data));
      this.percents = json;
    },
     async fetchProducts() {
      const json = await axios
        .get("/products")
        .then((response) => (this.requests = response.data));
      json.forEach((element) =>
        this.products.push({ value: element.id, text: element.name })
      );
    },
    async changeProduct(arg) {
      const json = await axios
        .get("/products/" + arg)
        .then((response) => (this.requests = response.data));
        this.product = json[0];
      this.seasons = json[0].seasonInformation;
    },
    save() {

      axios
        .put(
          "/products/" + this.product.id, 
             JSON.stringify({
            id: this.product.id,
            quantities : this.product.quantities,
    
            seasonInformation: [{
              seasonalityId: this.product.seasonInformation[0].seasonalityId,
              startDate: this.product.seasonInformation[0].startDate,
              endDate: this.product.seasonInformation[0].endDate
            },
            {
              seasonalityId: this.product.seasonInformation[1].seasonalityId,
              startDate: this.product.seasonInformation[1].startDate,
              endDate: this.product.seasonInformation[1].endDate
            },
            {
              seasonalityId: this.product.seasonInformation[2].seasonalityId,
              startDate: this.product.seasonInformation[2].startDate,
              endDate: this.product.seasonInformation[2].endDate
            }]
          })
          
        )
        .then((response) => (this.requests = response.data));
    },
  },
};
</script>

  <style>
  #card1 {
  border: solid;
  border-color: #8DD3C7;
  margin-top: 1px;
}
#card2 {
  border: solid;
  border-color: #cf750f;
  margin-top: 1px;
}
#card3 {
  border: solid;
  border-color: #BEBADA;
  margin-top: 1px;
}

.card-body {
  padding: 0px;
}


.b-form-btn-label-control.form-control > .form-control {
  font-size: 0.7rem;
}


.legend-block{
  border: 1px solid #999;
  margin-right: 0px;
   margin-left: 0px;
   margin-top: 5px;
  
}

.my-legend .legend-title{
  text-align: left;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 90%;
}

.my-legend .legend-scale ul{
  margin: 0;
  margin-bottom: 5px;
  padding:0;
  float: left;
  list-style: none;
}

.my-legend .legend-scale ul li{
  font-size: 80%;
  list-style: none;
  margin-left: 0;
  line-height: 18px;
  margin-bottom: 2px;
}

.my-legend ul.legend-labels li span{
  display: block;
  float: left;
  height: 16px;
  width: 30px;
  margin-right: 5px;
  margin-left: 0;
  border: 1px solid #999;

}

.rowLegend{
   border: 1px solid #999;
   padding-bottom: 25px;
}

</style> 