<template>
  <b-container fluid>
    <b-row>
      <b-col class="col-md-12 col-sm-12 col-xs-12">
        <b-form-select
          id="productId"
          @change="onChange"
          v-model="selected"
          :options="options"
          size="sm"
          class="mt-3"
        ></b-form-select>
        <br /><br />
        <div align="left">
          <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group
              id="group1"
              label-cols-sm="4"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="7"
              label="Nom"
              label-for="input-horizontal"
            >
              <b-form-input
                id="nameId1"
                v-model="form.name"
                placeholder="Nom du produit"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="group2"
              label-cols-sm="4"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="7"
              label="Unité"
              label-for="input-horizontal"
            >
              <b-form-input id="nameId2"></b-form-input>
            </b-form-group>
            <b-form-group
              id="group3"
              label-cols-sm="4"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="7"
              label="Type de conditionnement"
              label-for="input-horizontal"
            >
              <b-form-input id="nameId3"></b-form-input>
            </b-form-group>
            <b-form-group
              id="group4"
              label-cols-sm="4"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="7"
              label="Poids par unité"
              label-for="input-horizontal"
            >
              <b-form-input id="nameId4"></b-form-input>
            </b-form-group>
            <b-form-group
              id="group5"
              label-cols-sm="4"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="7"
              label="Kg ou à la pièce"
              label-for="input-horizontal"
            >
              <b-form-input id="nameId5"></b-form-input>
            </b-form-group>
            <b-form-group
              id="group6"
              label-cols-sm="4"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="7"
              label="Saisonnalité"
              label-for="input-horizontal"
            >
              <b-form-input id="nameId6"></b-form-input>
            </b-form-group>
            <b-form-group
              id="group7"
              label-cols-sm="4"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="7"
              label="Prix d'achat selon la saisonnalité"
              label-for="input-horizontal"
            >
              <b-form-input id="nameId7"></b-form-input>
            </b-form-group>
            <b-form-group
              id="group8"
              label-cols-sm="4"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="7"
              label="Conditionnement légumerie"
              label-for="input-horizontal"
            >
              <b-form-input id="nameId8"></b-form-input>
            </b-form-group>
            <b-form-group
              id="group9"
              label-cols-sm="4"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="7"
              label="Ratio légume brut/conditionné"
              label-for="input-horizontal"
            >
              <b-form-input id="nameId9"></b-form-input>
            </b-form-group>
            <b-form-group
              id="group10"
              label-cols-sm="4"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="7"
              label="Coût du travaile de la légumerie"
              label-for="input-horizontal"
            >
              <b-form-input id="nameId10"></b-form-input>
            </b-form-group>
            <b-form-group
              id="group11"
              label-cols-sm="4"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="7"
              label="Délai de livraison pour légumerie"
              label-for="input-horizontal"
            >
              <b-form-input id="nameId11"></b-form-input>
            </b-form-group>

            <b-button class="m-3" @click="showAlert" type="submit" variant="primary"
              >Sauver</b-button
            >
            <b-button class="m-3" type="reset" variant="danger"
              >Effacer</b-button
            >
          </b-form>
        </div>
      </b-col>
    </b-row>
     <b-alert
      :show="dismissCountDown"
      dismissible
      variant="success"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      <p>{{ form.name }} ajouté avec succès</p>     
    </b-alert>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      selected: null,
      options: this.$store.getters.getProductsForSelect,
      form:[{name:"", quantity: 0}],
      dismissSecs: 2,
     dismissCountDown: 0,
      
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$store.commit("ADD_PRODUCT",
           {
            name: this.form.name,
            quantity: this.form.quantity
            
          })
      
    },
    onReset(event) {
      event.preventDefault();
      
    },
    onChange(event) {
      
    },
    countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
    showAlert() {
        this.dismissCountDown = this.dismissSecs
      }
  },
};
</script>

<style>
</style>