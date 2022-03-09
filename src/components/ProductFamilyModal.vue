<template>
  <b-modal
    id="product-family-modal"
    :hide-footer="true"
    title="Familles"
    hide-header-close
  >
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel" >
        <div
          v-for="(productFamily, index) in productFamilies"
          :key="productFamily.id"
        >
          <b-row v-if="productFamily.id">
            <b-col v-if="productFamily.name !== ''">
              {{ productFamily.name }}
            </b-col>
            <b-col v-else>
              <b-form-input
                :state="nameState"
                trim
                v-model="newProductFamily"
              ></b-form-input>
              <b-form-invalid-feedback id="input-live-feedback">
                Le nom ne peut pas être vide et unique.
              </b-form-invalid-feedback>
            </b-col>
            <b-col v-if="productFamily.name !== ''">
              <b-icon
                @click="deleteFamily(productFamily, index)"
                variant="danger"
                icon="trash"
                scale="1"
              ></b-icon>
            </b-col>
            <b-col v-else>
              <b-icon
                @click="validFamily(index)"
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
              @click="addFamily()"
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
      canAdd: true,
      canSave: false,
      currval: 0,
    };
  },
  computed: {
    nameState(arg) {
      var exists = this.productFamilies.some((field) => {
        return field.name == this.newProductFamily;
      });

      var length = this.newProductFamily.length > 0 ? true : false;

      if (!exists && length) {
        return true;
      } else return false;
    },
  },
  mounted() {
    this.fetchCurrVal();
  },
  methods: {
    async fetchCurrVal() {
      await axios
        .get("/productFamilies/sequencecurrVal")
        .then((response) => (this.currval = response.data));
    },
    onSubmit(event) {
      event.preventDefault();

      this.newProductFamily = "";
      if (this.canSave) {
        axios
          .post("/productFamilies", this.productFamilies)
          .then((response) => (this.requests = response.data));
        this.canSave = false;
      }

      this.$bvModal.hide("product-family-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.newProductFamily = "";
      this.$bvModal.hide("product-family-modal");
    },
    deleteFamily(family, index) {
      if (!this.canSave) {
      axios
        .delete("/productFamilies/" + family.id)
        .then((response) => {
          this.productFamilies.splice(index, 1);
          this.productFamilyList.splice(index + 1, 1);
        })
        .catch((e) => {
          this.$bvToast.toast("Impossible de supprimer cet élément", {
            title: "Info",
            variant: "danger",
            solid: true,
          });
        });
      }else{
        this.productFamilies.splice(index, 1);
        this.productFamilyList.splice(index + 1, 1);
      }
    },
    addFamily() {
      if (this.canAdd) {
        this.productFamilies.push({
          id: this.currval + 1,
          name: "",
        });
        this.newProductFamily = "";
        this.canAdd = false;
      }
    },

    validFamily(index) {
      if (this.nameState) {
        this.productFamilies.splice(index, 1);
        this.productFamilies.push({
          id: this.currval + 1,
          name: this.newProductFamily,
        });
        this.productFamilyList.push({
          value: this.currval + 1,
          text: this.newProductFamily,
        });
        this.currval++;
        this.canAdd = true;
        this.canSave = true;
      }
    },
  },
};
</script>

<style>
</style>