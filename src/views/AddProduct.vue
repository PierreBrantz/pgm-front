<template>
  <b-container fluid>
    <b-row
      ><b-col cols="3">
        <b-form-select
          v-model="selectedProduct"
          :options="products"
          v-on:change="changeProduct"
          class="m-2"
        ></b-form-select>
      </b-col>
      <b-col cols="3">
        <b-icon
          @click="deleteProduct"
          variant="danger"
          icon="trash"
          scale="1.5"
          aria-hidden="true"
          class="m-3"
        ></b-icon>
      </b-col>
    </b-row>
    <b-form @submit="onSubmit">
      <b-row class="m-1">
        <b-col sm="3">
          <label>Type de conditionnement :</label>
        </b-col>
        <b-col sm="9">
          <b-form-input
            id="conditioningId"
            v-model="form.conditioning"
            size="sm"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="m-1">
        <b-col sm="3">
          <label>Nombre d'unité par conditionnement :</label>
        </b-col>
        <b-col sm="9">
          <b-form-input
            id="nbByConditioningId"
            v-model="form.nbByConditioning"
            size="sm"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="m-1">
        <b-col sm="3">
          <label>Poids (par unité) :</label>
        </b-col>
        <b-col sm="9">
          <b-form-input
            id="weightId"
            v-model="form.weight"
            size="sm"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="m-1">
        <b-col sm="3">
          <label>Vendu au kg ou à la pièce :</label>
        </b-col>
        <b-col sm="9">
          <b-form-input
            id="unitForSaleId"
            v-model="form.unitForSale"
            size="sm"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="m-1">
        <b-col sm="3">
          <label>Prix d'achat :</label>
        </b-col>
        <b-col sm="9">
          <b-form-input
            id="priceId"
            v-model="form.price"
            size="sm"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="m-1">
        <b-col sm="3">
          <label>Conditionnement légumerie :</label>
        </b-col>
        <b-col sm="9">
          <b-form-input
            id="conditioningByVegetableId"
            v-model="form.conditioningByVegetable"
            size="sm"
          ></b-form-input>
        </b-col>
      </b-row>
       <b-row class="m-1">
        <b-col sm="3">
          <label>Ratio légume brut/conditionné :</label>
        </b-col>
        <b-col sm="9">
          <b-form-input
            id="percentBrutConditioningId"
            v-model="form.percentBrutConditioning"
            size="sm"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="m-1">
        <b-col sm="3">
          <label>Coût du travail par conditionnement :</label>
        </b-col>
        <b-col sm="9">
          <b-form-input
            id="workCostByConditioningId"
            v-model="form.workCostByConditioning"
            size="sm"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="m-1">
        <b-col sm="3">
          <label>Délai de livraison :</label>
        </b-col>
        <b-col sm="9">
          <b-form-input
            id="deliveryTimeLimitId"
            v-model="form.deliveryTimeLimit"
            size="sm"
          ></b-form-input>
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
      selectedProduct: null,
      form: [{ name: "", quantity: 0, conditioning: "", nbByConditioning: 0, weight: 0, unitForSale: "",  price: 0, conditioningByVegetable: "", percentBrutConditioning: "", workCostByConditioning: "", deliveryTimeLimit: ""  }],
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
    async changeProduct(arg) {
      const json = await axios
        .get("/products/" + arg)
        .then((response) => (this.requests = response.data));
      this.form = json;
    },
    onSubmit(event) {
      axios
        .post(
          "/products",  
          JSON.stringify({
            id: this.form.id,
            name: this.form.name,
            firstName: this.form.firstName,
            abr: this.form.abr,
            company: this.form.company,
            number: this.form.number,
            road: this.form.road,
            postCode: this.form.postCode,
            town: this.form.town,
            phone: this.form.phone,
            gsm: this.form.gsm,
            mail: this.form.mail,
            account: this.form.account,
            tva: this.form.tva,
          })
        )
        .then((response) => (this.requests = response.data));
    },

    deleteProduct() {
      axios.delete("/producers/" + this.selectedProducer);
      this.producers = [{ value: null, text: "Choisir un producteur..." }];
      this.form = [
        {
          id: "",
          name: "",
          firstName: "",
          abr: "",
          company: "",
          number: "",
          road: "",
          postCode: "",
          town: "",
          phone: "",
          gsm: "",
          mail: "",
          account: "",
          tva: "",
        },
      ];
      this.fetchProducers();
    },
  },
};
</script>

<style>
</style>