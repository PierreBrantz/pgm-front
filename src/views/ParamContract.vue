<template>
  <b-container fluid>
    <b-form @submit="onSubmit">
      <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Titre contrat :</label>
        </b-col>
        <b-col class="p-1" cols="9">
          <b-form-textarea
            id="titleId"
            v-model="form.title"
          ></b-form-textarea>
        </b-col>
      </b-row>

      <b-row class="m-1">
        <b-col class="p-1" cols="3">
          <label>Texte Fin de contrat :</label>
        </b-col>
        <b-col class="p-1" cols="9">
          <b-form-textarea
            id="endTxtId"
            v-model="form.endTxt"
          ></b-form-textarea>
        </b-col>
      </b-row>
      <hr class="mt-3 mb-3"/>
      <b-row class="m-1">
        <b-col cols="3" class="p-1">
          <label>Colonne "Théorique" (vue producteur)</label>
        </b-col>
        <b-col cols="3" class="p-1">
          <b-form-checkbox v-model="form.propositionColumn" name="check-button" switch>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <hr class="mt-3 mb-3"/>
      <b-row class="m-1">
        <b-col cols="3" class="p-1">
             <label>Produits à mettre en readonly pour le producteur</label>
        </b-col>
      </b-row>
      <b-row class="m-1">
        <b-col cols="3" class="p-1">
          <label>Par famille</label>
        </b-col>
        
          <b-col cols="2" class="p-1" v-for="(family, count) in productFamilies" :key="family.id">
            <b-form-checkbox v-model="family.visible" name="check-button" >
            {{ family.name }}  
          </b-form-checkbox>            
          </b-col>
        
      </b-row>
      <b-row class="m-1">
        <b-col cols="3" class="p-1">
          <label>Par type</label>
        </b-col>        
          <b-col cols="2" class="p-1" v-for="(type, count) in productTypes" :key="type.id">
            <b-form-checkbox v-model="type.visible" name="check-button" >
              {{ type.name }}
            </b-form-checkbox>
          </b-col>        
      </b-row>
      <b-row class="m-1">
        <b-col cols="3" class="p-1">
          <label>Par Origine</label>
        </b-col>        
          <b-col cols="2" class="p-1" v-for="(origin, count) in productOrigins" :key="origin.id">
            <b-form-checkbox v-model="origin.visible" name="check-button" >
              {{ origin.name }}
            </b-form-checkbox>
          </b-col>        
      </b-row>

      <b-button class="m-3" type="submit" variant="primary">Sauver</b-button>
      </b-form>
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  props: [],
  data() {
    return {
      form: [],
        
        productFamilyReadOnly: [],
        productTypeReadOnly: [],
        productOriginReadOnly: [],
         

      
      productFamilies: null,
      productTypes : null,
      productOrigins : null
     
    };
  },

  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.fetchContractParams();
    this.fetchProductTypes();
    this.fetchProductOrigins();
    this.fetchProductFamilies();
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    async fetchContractParams() {
      const json = await axios
        .get("/contractParams")
        .then((response) => (this.requests = response.data));
      this.form = json;
     
    },
    async fetchProductTypes() {
      const json = await axios
        .get("/productTypes")
        .then((response) => (this.requests = response.data));
         this.productTypes = json;
      
    },
    async fetchProductFamilies() {
      const json = await axios
        .get("/productFamilies")
        .then((response) => (this.requests = response.data));
         this.productFamilies = json;
       
    },
    async fetchProductOrigins() {
      const json = await axios
        .get("/productOrigins")
        .then((response) => (this.requests = response.data));
        this.productOrigins = json;
      
    },
  
  onSubmit(event) {
    event.preventDefault();
    axios
      .post("/contractParams", this.form)
      .then((response) => (this.requests = response.data));

      axios
      .post("/productOrigins", this.productOrigins);
      axios
      .post("/productFamilies", this.productFamilies);
      axios
      .post("/productTypes", this.productTypes);

      this.$bvToast.toast("Changements sauvegardés.", {
        title: "Info",
        variant: "success",
        solid: true,
      });
  },
  }
};
</script>

<style>
</style>