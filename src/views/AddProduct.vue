<template>
  <b-container fluid>
    <b-form>
      <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Nom :</label>
        </b-col>
        <b-col class="p-1" cols="3">
          <b-form-select
            v-model="selectedProduct"
            :options="productList"
            v-on:change="changeProduct"
          ></b-form-select>
        </b-col>
        <b-col class="p-2" cols="3">
            <b-icon
              @click="addProductName"
              variant="success"
              icon="plus"
              scale="2"
            ></b-icon>
          </b-col>        
      </b-row>

      <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Type :</label>
        </b-col>
        <b-col class="p-1" cols="3">
          <b-form-select
            v-model="selectedProductType"
            :options="productTypeList"
          ></b-form-select>
        </b-col>
        <b-col class="p-2" cols="3">
          <b-icon
            @click="editProductType"
            variant="primary"
            icon="pencil"
            scale="1.5"
            aria-hidden="true"
          ></b-icon>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Famille :</label>
        </b-col>
        <b-col class="p-1" cols="3">
          <b-form-select
            v-model="selectedProductFamily"
            :options="productFamilyList"
          ></b-form-select>
        </b-col>
        <b-col class="p-2" cols="3">
          <b-icon
            @click="editProductFamily"
            variant="primary"
            icon="pencil"
            scale="1.5"
            aria-hidden="true"
          ></b-icon>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Unité :</label>
        </b-col>
        <b-col class="p-1" cols="3">
          <b-form-select
            v-model="selectedProductUnit"
            :options="productUnitList"
          ></b-form-select>
        </b-col>
        <b-col class="p-2" cols="3">
          <b-icon
            @click="editProductUnit"
            variant="primary"
            icon="pencil"
            scale="1.5"
            aria-hidden="true"
          ></b-icon>
        </b-col>
      </b-row>

        <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Quantité :</label>
        </b-col>
        <b-col class="p-1" cols="3">
          <b-form-input
            id="quantityId"
            v-model="form.quantity"
          ></b-form-input>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col cols="3" class="p-1">
          <label>Affichage condensé :</label>
        </b-col>
        <b-col cols="3" class="p-1">
          <b-form-checkbox v-model="form.compactDisplay" name="check-button" switch>
          </b-form-checkbox>
        </b-col>
      </b-row>

        <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Calibrage :</label>
        </b-col>
        <b-col class="p-1" cols="3">
          <b-form-input
            id="calibrationId"
            v-model="form.calibration"
          ></b-form-input>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Label :</label>
        </b-col>
        <b-col class="p-1" cols="3">
          <b-form-select
            v-model="selectedProductLabel"
            :options="productLabelList"
          ></b-form-select>
        </b-col>
        <b-col class="p-2" cols="3">
          <b-icon
            @click="editProductLabel"
            variant="primary"
            icon="pencil"
            scale="1.5"
            aria-hidden="true"
          ></b-icon>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Vendu au kg ou à la pièce :</label>
        </b-col>
        <b-col class="p-1" cols="3">
          <b-form-input
            id="salesFormatId"
            v-model="form.salesFormat"
          ></b-form-input>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Marge par saison :</label>
        </b-col>
        <b-col class="p-1" cols="3">
          <b-form-input 
            id="seasonMarginId"
            v-model="form.margin"
            type="number"
          ></b-form-input>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Prix d'achat de référence :</label>
        </b-col>
        <b-col class="p-1" cols="3">
          <b-form-input
            id="purchasePriceId"
            v-model="form.price"
            type="number"
            :state="form.price != null && form.price > 0"
          ></b-form-input>
           <b-form-invalid-feedback id="input-live-feedback">
            Le prix ne peut pas être vide ni négatif.
          </b-form-invalid-feedback>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Emballage :</label>
        </b-col>
        <b-col class="p-1" cols="3">
          <b-form-select
            v-model="selectedPackaging"
            :options="packagingList"            
          ></b-form-select>
        </b-col>
        <b-col class="p-2" cols="3">
          <b-icon
            @click="editPackaging"
            variant="primary"
            icon="pencil"
            scale="1.5"
            aria-hidden="true"
          ></b-icon>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col cols="3" class="p-1">
          <label>Nombre d'unité par emballage :</label>
        </b-col>
        <b-col cols="3" class="p-1">
          <b-form-input
            id="nbByPackagingId"
            v-model="form.nbByPackaging"
             type="number"
          ></b-form-input>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col cols="3" class="p-1">
          <label>Origine :</label>
        </b-col>
        <b-col cols="3" class="p-1">
          <b-form-select
            v-model="selectedProductOrigin"
            :options="productOriginList"
          ></b-form-select>
        </b-col>
        <b-col class="p-2" cols="3">
          <b-icon
            @click="editProductOrigin"
            variant="primary"
            icon="pencil"
            scale="1.5"
            aria-hidden="true"
          ></b-icon>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col cols="3" class="p-1">
          <label>Code barre :</label>
        </b-col>
        <b-col cols="3" class="p-1">
          <b-form-input id="barCodeId" v-model="form.barCode"></b-form-input>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col cols="3" class="p-1">
          <label>Coiffe :</label>
        </b-col>
        <b-col cols="3" class="p-1">
          <b-form-checkbox v-model="form.cap" name="check-button" switch>
          </b-form-checkbox>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col cols="3" class="p-1">
          <label>Fragile :</label>
        </b-col>
        <b-col cols="3" class="p-1">
          <b-form-checkbox v-model="form.fragil" name="check-button" switch>
          </b-form-checkbox>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col cols="3" class="p-1">
          <label>ID dans l'e-shop :</label>
        </b-col>
        <b-col cols="3" class="p-1">
          <b-form-input id="eshopId" v-model="form.eshopId" ></b-form-input>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col cols="3" class="p-1">
          <label>Remarque :</label>
        </b-col>
        <b-col cols="3" class="p-1">
          <b-form-input id="remarkId" v-model="form.remark"></b-form-input>
        </b-col>
      </b-row>
      </b-form>
      <b-button class="m-3" @click="onSubmit" :disabled="form.price == null || form.price == '' || form.price < 0" variant="primary">Sauver</b-button>
      <b-button class="m-3" @click="onDelete" type="delete" variant="danger">Supprimer</b-button>
    
    <product-name-modal :products="products" :productList="productList"></product-name-modal>
    <product-type-modal :productTypes="productTypes" :productTypeList="productTypeList"></product-type-modal>
    <product-family-modal :productFamilies="productFamilies" :productFamilyList="productFamilyList"></product-family-modal>
    <product-unit-modal :productUnits="productUnits" :productUnitList="productUnitList"></product-unit-modal>
    <product-label-modal :productLabels="productLabels" :productLabelList="productLabelList"></product-label-modal>
    <packaging-modal :packagings="packagings" :packagingList="packagingList"></packaging-modal>
    <product-origin-modal :productOrigins="productOrigins" :productOriginList="productOriginList"></product-origin-modal>
  </b-container>
</template>

<script>
import axios from "axios";
import ProductNameModal from "../components/ProductNameModal.vue"
import ProductTypeModal from "../components/ProductTypeModal.vue"
import ProductFamilyModal from "../components/ProductFamilyModal.vue"
import ProductUnitModal from "../components/ProductUnitModal.vue"
import ProductLabelModal from "../components/ProductLabelModal.vue"
import PackagingModal from "../components/PackagingModal.vue"
import ProductOriginModal from "../components/ProductOriginModal.vue"

export default {
  components: {
    "product-name-modal": ProductNameModal,
    "product-type-modal": ProductTypeModal,
    "product-family-modal": ProductFamilyModal,
    "product-unit-modal": ProductUnitModal,
    "product-label-modal": ProductLabelModal,
    "packaging-modal": PackagingModal,
    "product-origin-modal": ProductOriginModal,
  },
  props: [],
  data() {
    return {
      selectedProduct: null,
      selectedProductType: null,
      selectedProductFamily: null,
      selectedProductUnit: null,
      selectedProductLabel: null,
      selectedPackaging: null,
      selectedProductOrigin: null,
      form: [],
      products:[],
      productList: [{ value: null, text: "Choisir un produit..." }],
      productTypes: [],
      productTypeList: [{ value: null, text: "Choisir un type..." }],
      productFamilies: [],
      productFamilyList: [{ value: null, text: "Choisir une famille..." }],
      productUnits: [],
      productUnitList: [{ value: null, text: "Choisir une unité..." }],
      productLabels: [],
      productLabelList: [{ value: null, text: "Choisir un label..." }],
      packagings:[],
      packagingList: [{ value: null, text: "Choisir un emballage..." }],
      productOrigins:[],
      productOriginList: [{ value: null, text: "Choisir une origine..." }],
    };
  },

  mounted() {   
    if(this.$route.query.product){
      this.selectedProduct = this.$route.query.product;
      this.changeProduct(this.$route.query.product);
    }
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.fetchProducts();
    this.fetchProductTypes();
    this.fetchProductFamilies();
    this.fetchProductUnits();
    this.fetchProductLabels();
    this.fetchPackagings();
    this.fetchProductOrigins();
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    async fetchProducts() {
      const json = await axios
        .get("/products")
        .then((response) => (this.requests = response.data));
        this.products=json;
      json.forEach((element) =>
        this.productList.push({ value: element.id, text: element.name })
      );
    },
    async fetchProductTypes() {
      const json = await axios
        .get("/productTypes")
        .then((response) => (this.requests = response.data));
         this.productTypes = json;
      json.forEach((element) =>
        this.productTypeList.push({ value: element.id, text: element.name })
      );
    },
    async fetchProductFamilies() {
      const json = await axios
        .get("/productFamilies")
        .then((response) => (this.requests = response.data));
         this.productFamilies = json;
       json.forEach((element) =>
        this.productFamilyList.push({ value: element.id, text: element.name })
      );
    },
    async fetchProductUnits() {
      const json = await axios
        .get("/productUnits")
        .then((response) => (this.requests = response.data));
        this.productUnits = json;
      json.forEach((element) =>
        this.productUnitList.push({ value: element.id, text: element.name })
      );
    },
    async fetchProductLabels() {
      const json = await axios
        .get("/productLabels")
        .then((response) => (this.requests = response.data));
        this.productLabels = json;
      json.forEach((element) =>
        this.productLabelList.push({ value: element.id, text: element.name })
      );
    },
    async fetchPackagings() {
      const json = await axios
        .get("/packagings")
        .then((response) => (this.requests = response.data));
        this.packagings = json;
      json.forEach((element) =>
        this.packagingList.push({ value: element.id, text: element.name })
     
      );
    },
    async fetchProductOrigins() {
      const json = await axios
        .get("/productOrigins")
        .then((response) => (this.requests = response.data));
        this.productOrigins = json;
      json.forEach((element) =>
        this.productOriginList.push({ value: element.id, text: element.name })
      );
    
    },
    async changeProduct(arg) {
      const json = await axios
        .get("/products/" + arg)
        .then((response) => (this.requests = response.data));
      this.form = json;

      this.selectedProductType= null,
      this.selectedProductFamily= null,
      this.selectedProductUnit= null,
      this.selectedProductLabel= null,
      this.selectedPackaging= null,
      this.selectedProductOrigin= null;
     
     if(this.form.packaging != null)
      this.selectedPackaging = this.form.packaging.id;
     
     if(this.form.productType != null)
     this.selectedProductType = this.form.productType.id;

     if(this.form.productFamily != null)
      this.selectedProductFamily = this.form.productFamily.id;

      if(this.form.productUnit != null)
      this.selectedProductUnit = this.form.productUnit.id;

      if(this.form.productLabel != null)
      this.selectedProductLabel = this.form.productLabel.id; 
      
      if(this.form.productOrigin != null)
      this.selectedProductOrigin = this.form.productOrigin.id;

    },

    addProductName(arg){
      this.$root.$emit("bv::show::modal", "product-name-modal", "#btnShow");
    },
    editProductType(arg){ 
      this.$root.$emit("bv::show::modal", "product-type-modal", "#btnShow");
    },
        editProductFamily(arg){ 
      this.$root.$emit("bv::show::modal", "product-family-modal", "#btnShow");
    },
        editProductUnit(arg){ 
      this.$root.$emit("bv::show::modal", "product-unit-modal", "#btnShow");
    },
        editProductLabel(arg){ 
      this.$root.$emit("bv::show::modal", "product-label-modal", "#btnShow");
    },
        editPackaging(arg){ 
      this.$root.$emit("bv::show::modal", "packaging-modal", "#btnShow");
    },
        editProductOrigin(arg){ 
      this.$root.$emit("bv::show::modal", "product-origin-modal", "#btnShow");
    },
    onSubmit(event) {
          event.preventDefault();
         
     
     this.form.productType =  this.productTypes.find((item) => {
              if (item.id === this.selectedProductType) {
                return item;
              }
            });
               this.form.productFamily =  this.productFamilies.find((item) => {
              if (item.id === this.selectedProductFamily) {
                return item;
              }
            });
               this.form.productUnit =  this.productUnits.find((item) => {
              if (item.id === this.selectedProductUnit) {
                return item;
              }
            });
               this.form.productLabel =  this.productLabels.find((item) => {
              if (item.id === this.selectedProductLabel) {
                return item;
              }
            });
               this.form.packaging=  this.packagings.find((item) => {
              if (item.id === this.selectedPackaging) {
                return item;
              }
            });
               this.form.productOrigin=  this.productOrigins.find((item) => {
              if (item.id === this.selectedProductOrigin) {
                return item;
              }
            });
       axios
        .post(
          "/products" ,
            [this.form]
        )
        .then((response) => (this.requests = response.data));
        this.$bvToast.toast("Produit sauvé.", {
          title: "Info",
          variant: "success",
          solid: true,
        });
        
    },
  onDelete(event) {
    event.preventDefault();
      
      axios.delete("/products/" + this.selectedProduct);
      this.productList = [{ value: null, text: "Choisir un produit..." }];
      
      this.form =[];
      this.selectedProduct= null,
      this.selectedProductType= null,
      this.selectedProductFamily= null,
      this.selectedProductUnit= null,
      this.selectedProductLabel= null,
      this.selectedPackaging= null,
      this.selectedProductOrigin= null;

      this.$bvToast.toast("Produit supprimé.", {
          title: "Info",
          variant: "success",
          solid: true,
        });
      
      this.fetchProducts();
    }
  }
   
  
};
</script>

<style>
</style>