<template>
  <b-modal id="theorical-add-product-to-producer-modal" :hide-footer="true" title="Produit" >
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
          
        <b-row v-for="producer in producers" :key="producer.id">
          <b-col>
              {{producer.name}} 
              {{findNbOfProductsByProducer(producer.id)}}


          </b-col>
         <!--
          <b-col>
              <b-form-input
                  v-model="product."
                  type="number"
                  size="sm"
                  @change="saveSeasons"
                ></b-form-input>
          </b-col>
          -->
        </b-row>

        <b-button class="m-3" type="submit" variant="primary">Sauver</b-button>
        <b-button class="m-3" type="reset" variant="danger">Annuler</b-button>
      </b-form>
    </b-container>
  </b-modal>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  props: ["product"],
  data(){
return {
 producers : null
}},
 mounted() {
     this.fetchProducers();
 },

  
  methods: {
      async findNbOfProductsByProducer(producerId){
          const json = await axios
        .get("/products/producer/" + producerId)
        .then((response) => (this.requests = response.data));      
        console.log(json);

        //  console.log(this.product);
      /*    this.product.producers.find((item) => {
            if (item.id === producerId){
                return item.
            }
          })*/
     
      },
    onSubmit(event) {
      console.log(this.product);
    //  console.log(this.producers);
      event.preventDefault();
     // axios.post("/seasons", this.seasons);

    //  this.$bvModal.hide("season-name-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("season-name-modal");
    },
    async fetchProducers() {
      const json = await axios
        .get("/producers")
        .then((response) => (this.requests = response.data));      
      this.producers = json;
    },
  },
};
</script>

<style>
</style>