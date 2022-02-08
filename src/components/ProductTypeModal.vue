<template>
  <b-modal id="product-type-modal" :hide-footer="true" title="Types">
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <div v-for="productType in productTypes" :key="productType.id">
          <b-row v-if="productType.id">
            <b-col v-if="productType.name !== ''">
              {{ productType.name }}
            </b-col>
            <b-col v-else>
              <b-form-input v-model="newProductType"></b-form-input>
            </b-col>
            <b-col v-if="productType.name !== ''">
              <b-icon
                @click="deleteType(productType)"
                variant="danger"
                icon="trash"
                scale="1"
              ></b-icon>
            </b-col>
            <b-col v-else>
              <b-icon
                @click="validType(productType)"
                variant="success"
                icon="check"
                scale="1.5"
                class="mt-2"
              ></b-icon>
            </b-col>
          </b-row>
        </div>
        <b-row class="mt-2">
          <b-col>
            <b-icon
              @click="addType"
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
  props: ["productTypes"],
  data() {
    return {
      newProductType: "",
    };
  },
  mounted() {},
  methods: {
    onSubmit(event) {
      axios
        .post("/productTypes", this.productTypes)
        .then((response) => (this.requests = response.data));

      this.$bvModal.hide("product-type-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("product-type-modal");
    },
    deleteType(type) {
      this.productTypes.splice(this.productTypes.indexOf(type), 1);
      axios.delete("/productTypes/" + type.id);    
    },
    addType(arg) {
      
      this.productTypes.push({ id: this.productTypes.length == 0 ? 0 :this.productTypes[this.productTypes.length - 1].id + 1, name: "" });
    },
    validType(type) {      
      this.productTypes.splice(this.productTypes.indexOf(type), 1);
      this.productTypes.push({
        id: type.id,
        name: this.newProductType,
      });
      this.newProductType = "";
    },
  },
};
</script>

<style>
</style>