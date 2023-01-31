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
  methods: {},
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
      var producer = this.product.producers.find((item) =>{ 
      if(item.id === producerId)
        return item;
      });

       
          switch(this.season){
            case 'realJanuary' :
              producer.realQuantity.quantity1 = value;
              break;
              case 'realFebruary' :
              producer.realQuantity.quantity2 = value;
              break;
              case 'realMarch' :
             producer.realQuantity.quantity3 = value;
              break;
              case 'realApril' :
              producer.realQuantity.quantity4 = value;
              break;
              case 'realMay' :
              producer.realQuantity.quantity5 = value;
              break;
              case 'realJune' :
              producer.realQuantity.quantity6 = value;
              break;
              case 'realJuly' :
              producer.realQuantity.quantity7 = value;
              break;  
              case 'realAugust' :
              producer.realQuantity.quantity8 = value;
              break;
              case 'realSeptember' :
              producer.realQuantity.quantity9 = value;
              break;
              case 'realOctober' :
              producer.realQuantity.quantity10 = value;
              break;
              case 'realNovember' :
              producer.realQuantity.quantity11 = value;
              break;
              case 'realDecember' :
              producer.realQuantity.quantity12 = value;
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