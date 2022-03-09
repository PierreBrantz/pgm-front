<template>
  <b-modal
    id="product-type-modal"
    :hide-footer="true"
    title="Types"
    hide-header-close
  >
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel" >
        <div
          v-for="(productType, index) in productTypes"
          :key="productType.id"
        >
          <b-row v-if="productType.id">
            <b-col v-if="productType.name !== ''">
              {{ productType.name }}
            </b-col>
            <b-col v-else>
              <b-form-input
                :state="nameState"
                trim
                v-model="newProductType"
              ></b-form-input>
              <b-form-invalid-feedback id="input-live-feedback">
                Le nom ne peut pas être vide et unique.
              </b-form-invalid-feedback>
            </b-col>
            <b-col v-if="productType.name !== ''">
              <b-icon
                @click="deleteType(productType, index)"
                variant="danger"
                icon="trash"
                scale="1"
              ></b-icon>
            </b-col>
            <b-col v-else>
              <b-icon
                @click="validType(index)"
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
              @click="addType()"
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
  props: ["productTypes", "productTypeList"],
  data() {
    return {
      newProductType: "",
      canAdd: true,
      canSave: false,
      currval: 0,
    };
  },
  computed: {
    nameState(arg) {
      var exists = this.productTypes.some((field) => {
        return field.name == this.newProductType;
      });

      var length = this.newProductType.length > 0 ? true : false;

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
        .get("/productTypes/sequencecurrVal")
        .then((response) => (this.currval = response.data));
    },
    onSubmit(event) {
      event.preventDefault();

      this.newProductType = "";
      if (this.canSave) {
        axios
          .post("/productTypes", this.productTypes)
          .then((response) => (this.requests = response.data));
        this.canSave = false;
      }

      this.$bvModal.hide("product-type-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.newProductType = "";
      this.$bvModal.hide("product-type-modal");
    },
    deleteType(type, index) {
      if (!this.canSave) {
      axios
        .delete("/productTypes/" + type.id)
        .then((response) => {
          this.productTypes.splice(index, 1);
          this.productTypeList.splice(index + 1, 1);
        })
        .catch((e) => {
          this.$bvToast.toast("Impossible de supprimer cet élément", {
            title: "Info",
            variant: "danger",
            solid: true,
          });
        });
      }else{
        this.productTypes.splice(index, 1);
        this.productTypeList.splice(index + 1, 1);
      }
    },
    addType() {
      if (this.canAdd) {
        this.productTypes.push({
          id: this.currval + 1,
          name: "",
        });
        this.newProductType = "";
        this.canAdd = false;
      }
    },

    validType(index) {
      if (this.nameState) {
        this.productTypes.splice(index, 1);
        this.productTypes.push({
          id: this.currval + 1,
          name: this.newProductType,
        });
        this.productTypeList.push({
          value: this.currval + 1,
          text: this.newProductType,
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