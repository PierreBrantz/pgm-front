<template>
  <b-modal id="product-origin-modal" :hide-footer="true" title="Origines">
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <div v-for="productOrigin in productOrigins" :key="productOrigin.id">
          <b-row v-if="productOrigin.id">
            <b-col v-if="productOrigin.name !== ''">
              {{ productOrigin.name }}
            </b-col>
            <b-col v-else>
              <b-form-input v-model="newProductOrigin"></b-form-input>
            </b-col>
            <b-col v-if="productOrigin.name !== ''">
              <b-icon
                @click="deleteOrigin(productOrigin)"
                variant="danger"
                icon="trash"
                scale="1"
              ></b-icon>
            </b-col>
            <b-col v-else>
              <b-icon
                @click="validOrigin"
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
              @click="addOrigin"
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
  props: ["productOrigins"],
  data() {
    return {
      newProductOrigin: "",
    };
  },
  mounted() {},
  methods: {
    onSubmit(event) {
      axios
        .post("/productOrigins", this.productOrigins)
        .then((response) => (this.requests = response.data));

      this.$bvModal.hide("product-origin-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("product-origin-modal");
    },
    deleteOrigin(origin) {
      this.productOrigins.splice(this.productOrigins.indexOf(origin), 1);
      axios.delete("/productOrigins/" + origin.id);    
    },
    addOrigin(arg) {
      this.productOrigins.push({ id: this.productOrigins.length + 1, name: "" });
    },
    validOrigin() {
      this.productOrigins.splice(this.productOrigins.length - 1, 1);
      this.productOrigins.push({
        id: this.productOrigins.length + 1,
        name: this.newProductOrigin,
      });
      this.newProductOrigin = "";
    },
  },
};
</script>

<style>
</style>