<template>
  <b-modal id="modal-addproduct" :hide-footer="true" title="Ajout d'un produit">
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <b-row class="m-1">
          <b-col>
            <b-form-select
              v-model="selected"
              :options="products"
              class="m-2"
            ></b-form-select>
          </b-col>
        </b-row>

        <b-button class="m-3" type="submit" variant="primary">Ajouter</b-button>
        <b-button class="m-3" type="reset" variant="danger">Annuler</b-button>
      </b-form>
    </b-container>
  </b-modal>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  props: ["producerId"],
  data() {
    return {
      selected: null,
      products: [{ value: null, text: "Choisir un produit..." }],
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
        this.products.push({ value: element.id, text: element.name })
      );
    },
    onSubmit(event) {
        axios
        .post("/producers/" + this.producerId + "/product/" + this.selected)
        .then((response) => (this.requests = response.data));

      this.$bvModal.hide("modal-addproduct");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("modal-addproduct");
    },
  },
};
</script>

<style>
</style>