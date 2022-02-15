<template>
  <b-modal id="product-label-modal" :hide-footer="true" title="Labels">
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <div v-for="productLabel in productLabels" :key="productLabel.id">
          <b-row v-if="productLabel.id">
            <b-col v-if="productLabel.name !== ''">
              {{ productLabel.name }}
            </b-col>
            <b-col v-else>
              <b-form-input v-model="newProductLabel"></b-form-input>
            </b-col>
            <b-col v-if="productLabel.name !== ''">
              <b-icon
                @click="deleteLabel(productLabel)"
                variant="danger"
                icon="trash"
                scale="1"
              ></b-icon>
            </b-col>
            <b-col v-else>
              <b-icon
                @click="validLabel"
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
              @click="addLabel"
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
  props: ["productLabels", "productLabelList"],
  data() {
    return {
      newProductLabel: "",
    };
  },
  mounted() {},
  methods: {
    onSubmit(event) {
      event.preventDefault();
      axios
        .post("/productLabels", this.productLabels)
        .then((response) => (this.requests = response.data));

      this.$bvModal.hide("product-label-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("product-label-modal");
    },
    deleteLabel(label) {
      this.productLabels.splice(this.productLabels.indexOf(label), 1);
      this.productLabelList.splice(this.productLabels.indexOf(label), 1);
      axios.delete("/productLabels/" + label.id);    
    },
    addLabel(arg) {
      this.productLabels.push({ id: this.productLabels.length + 1, name: "" });
    },
    validLabel() {
      this.productLabels.splice(this.productLabels.length - 1, 1);
      this.productLabels.push({
        id: this.productLabels.length + 1,
        name: this.newProductLabel,
      });
      this.productLabelList.push({ value: this.productLabels.length + 1, text: this.newProductLabel })
      this.newProductLabel = "";
    },
  },
};
</script>

<style>
</style>