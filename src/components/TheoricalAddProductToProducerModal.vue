<template>
  <b-modal
    id="theorical-add-product-to-producer-modal"
    :hide-footer="true"
    :title= product.name 
  >
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <b-row v-for="producer in product.producers" :key="producer.id">
          <b-col>            
            {{ producer.name }}
          </b-col>

          <b-col>
            <b-form-input
              :value="findNbOfProductsByProducer(producer.id)"
              @input="
                (event) => (nbOfProduct = setNbOfProduct(event, producer.id))
              "
              type="number"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>

        <b-button class="m-3" type="submit" variant="primary">Sauver</b-button>
        <b-button class="m-3" type="reset" variant="danger">Annuler</b-button>
      </b-form>
    </b-container>
  </b-modal>
</template>

<script>
export default {
  components: {},
  props: ["product", "products", "season"],
  data() {
    return {
      nbOfProduct: "0",
    };
  },
  mounted() {},

  methods: {
    findNbOfProductsByProducer(producerId) {
      let ret;
      this.product.realQuantities.find((item) => {
        if (item.producerId === producerId) {
         
          switch(this.season){
            case 'realJanuary' :
              ret = item.quantity1;
              break;
              case 'realFebruary' :
              ret = item.quantity2;
              break;
              case 'realMarch' :
              ret = item.quantity3;
              break;
              case 'realApril' :
              ret = item.quantity4;
              break;
              case 'realMay' :
              ret = item.quantity5;
              break;
              case 'realJune' :
              ret = item.quantity6;
              break;
              case 'realJuly' :
              ret = item.quantity7;
              break;
              case 'realAugust' :
              ret = item.quantity8;
              break;
              case 'realSeptember' :
              ret = item.quantity9;
              break;
              case 'realOctober' :
              ret = item.quantity10;
              break;
              case 'realNovember' :
              ret = item.quantity11;
              break;
              case 'realDecember' :
              ret = item.quantity12;
              break;
          }
          
        }
      });
      return ret;
    },
    setNbOfProduct(value, producerId) {

      this.nbOfProduct = value;
      var producer = this.product.realQuantities.find((item) =>{ 
      if(item.producerId === producerId)
        return item;
      });       
          switch(this.season){
            case 'realJanuary' :
              producer.quantity1 = value;
              break;
              case 'realFebruary' :
              producer.quantity2 = value;
              break;
              case 'realMarch' :
              producer.quantity3 = value;
              break;
              case 'realApril' :
              producer.quantity4 = value;
              break;
              case 'realMay' :
              producer.quantity5 = value;
              break;
              case 'realJune' :
              producer.quantity6 = value;
              break;
              case 'realJuly' :
              producer.quantity7 = value;
              break;  
              case 'realAugust' :
              producer.quantity8 = value;
              break;
              case 'realSeptember' :
              producer.quantity9 = value;
              break;
              case 'realOctober' :
              producer.quantity10 = value;
              break;
              case 'realNovember' :
              producer.quantity11 = value;
              break;
              case 'realDecember' :
              producer.quantity12 = value;
              break;
          }
              
      
      return this.nbOfProduct;
    },
    async onSubmit(event) {
      event.preventDefault();
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id == this.product.id) {
          this.products[i] = this.product;
        }
      }
      
this.$emit("updated", this.products)
      this.$bvModal.hide("theorical-add-product-to-producer-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("theorical-add-product-to-producer-modal");
    },
  },
};
</script>

<style>
</style>