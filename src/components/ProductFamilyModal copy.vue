<template>
  <b-modal id="product-family-modal" :hide-footer="true" title="Familles" hide-header-close>
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel" @close="onCancel">
        <div v-for="productFamily in productFamilies" :key="productFamily.id">
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
                Le nom ne peut pas être vide.
              </b-form-invalid-feedback>
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
        <b-button :disabled="isValid == false" class="m-3" type="submit" variant="primary">Sauver</b-button>
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
      canAddNewField: true,   
      isValid: false,
     

    };
  },
  computed: {
    nameState() {
      return this.newProductFamily.length > 0 ? true : false;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
    this.newProductFamily = "";
    this.canAddNewField = true;
    this.isValid= false;
 
    },
    onSubmit(event) {
      event.preventDefault();

      axios
        .post("/productFamilies", this.productFamilies)
        .then((response) => (this.requests = response.data));

      this.$bvModal.hide("product-family-modal");
    },
    onCancel(event) {
     
        this.productFamilies.splice(this.productFamilies.length - 1, 1);
      
      this.init();
      event.preventDefault();
      this.$bvModal.hide("product-family-modal");
    },
    deleteFamily(family) {
      this.productFamilies.splice(this.productFamilies.indexOf(family), 1);
    //  this.productFamilyList.splice(this.productFamilies.indexOf(family), 1);
      axios.delete("/productFamilies/" + family.id);
    },
    addFamily(arg) {
      if (this.canAddNewField) {
        this.productFamilies.push({
          id: this.productFamilies.length + 1,
          name: "",
        });
      }
      this.canAddNewField = false;
      this.isValid = false;
      this.isValid = false;
      this.isValid = false;
    },
    validFamily() {
      if (this.nameState) {
        this.productFamilies.splice(this.productFamilies.length - 1, 1);
        this.productFamilies.push({
          id: this.productFamilies.length + 1,
          name: this.newProductFamily,
        });
        this.productFamilyList.push({
          value: this.productFamilies.length + 1,
          text: this.newProductFamily,
        });
        this.newProductFamily = "";
         this.canAddNewField  = true;
        this.isValid = true;
      }
    },
  },
};
</script>

<style>
</style>