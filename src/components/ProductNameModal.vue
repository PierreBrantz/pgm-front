<template>
  <b-modal id="product-name-modal" :hide-footer="true" title="Nom de produit">
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
      
          <b-row >
            <b-col>
              <b-form-input v-model="newName"></b-form-input>
            </b-col>
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
 props: ["products", "productList"],
  data() {
    return {
      newName: "",
    };
  },
  mounted() {},
  methods: {
    onSubmit(event) {
    
      axios
        .post("/products/name/" + this.newName);
      this.$bvModal.hide("product-name-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("product-name-modal");
    },
    
  }
};
</script>

<style>
</style>