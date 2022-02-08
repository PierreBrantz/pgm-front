<template>
  <b-modal id="product-unit-modal" :hide-footer="true" title="Unités">
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <div v-for="productUnit in productUnits" :key="productUnit.id">
          <b-row v-if="productUnit.id">
            <b-col v-if="productUnit.name !== ''">
              {{ productUnit.name }}
            </b-col>
            <b-col v-else>
              <b-form-input v-model="newProductUnit"></b-form-input>
            </b-col>
            <b-col v-if="productUnit.name !== ''">
              <b-icon
                @click="deleteUnit(productUnit)"
                variant="danger"
                icon="trash"
                scale="1"
              ></b-icon>
            </b-col>
            <b-col v-else>
              <b-icon
                @click="validUnit"
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
              @click="addUnit"
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
  props: ["productUnits"],
  data() {
    return {
      newProductUnit: "",
    };
  },
  mounted() {},
  methods: {
    onSubmit(event) {
      axios
        .post("/productUnits", this.productUnits)
        .then((response) => (this.requests = response.data));

      this.$bvModal.hide("product-unit-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("product-unit-modal");
    },
    deleteUnit(unit) {
      this.productUnits.splice(unit.id, 1);
    },
    addUnit(arg) {
      this.productUnits.push({ id: this.productUnits.length + 1, name: "" });
    },
    validUnit() {
      this.productUnits.splice(this.productUnits.length - 1, 1);
      this.productUnits.push({
        id: this.productUnits.length + 1,
        name: this.newProductUnit,
      });
      this.newProductUnit = "";
    },
  },
};
</script>

<style>
</style>