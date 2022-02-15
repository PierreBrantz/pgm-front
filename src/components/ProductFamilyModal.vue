<template>
  <b-modal id="product-family-modal" :hide-footer="true" title="Familles">
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <div v-for="productFamily in productFamilies" :key="productFamily.id">
          <b-row v-if="productFamily.id">
            <b-col v-if="productFamily.name !== ''">
              {{ productFamily.name }}
            </b-col>
            <b-col v-else>
              <b-form-input v-model="newProductFamily"></b-form-input>
            </b-col>
            <b-col v-if="productFamily.name !== ''">
              <b-icon
                @click="deleteFamily(productFamily)"
                variant="danger"
                icon="trash"
                scale="1"
              ></b-icon>
            </b-col>
            <b-col v-else>
              <b-icon
                @click="validFamily"
                variant="success"
                icon="check"
                scale="1"
              ></b-icon>
            </b-col>
          </b-row>
        </div>
        <b-row class="mt-2">
          <b-col>
            <b-icon
              @click="addFamily"
              variant="success"
              icon="plus"
              scale="1.5"
            ></b-icon>
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
  props: ["productFamilies", "productFamilyList"],
  data() {
    return {
      newProductFamily: "",
    };
  },
  mounted() {},
  methods: {
    onSubmit(event) {
      event.preventDefault();
      axios
        .post("/productFamilies", this.productFamilies)
        .then((response) => (this.requests = response.data));

      this.$bvModal.hide("product-family-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("product-family-modal");
    },
    deleteFamily(family) {     
      this.productFamilies.splice(this.productFamilies.indexOf(family), 1);
      this.productFamilyList.splice(this.productFamilies.indexOf(family), 1);
      axios.delete("/productFamilies/" + family.id);    
    },
    addFamily(arg) {
      this.productFamilies.push({ id: this.productFamilies.length + 1, name: "" });
    },
    validFamily() {
      this.productFamilies.splice(this.productFamilies.length - 1, 1);
      this.productFamilies.push({
        id: this.productFamilies.length + 1,
        name: this.newProductFamily,
      });
      this.productFamilyList.push({ value: this.productFamilies.length + 1, text: this.newProductFamily })
      this.newProductFamily = "";
    },
  },
};
</script>

<style>
</style>