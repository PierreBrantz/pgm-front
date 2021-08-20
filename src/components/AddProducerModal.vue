<template>
  <b-modal
    id="modal-addproducer"
    :hide-footer="true"
    title="Ajout d'un producteur"
  >
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <b-row class="m-1">
          <b-col sm="3">
            <label>Nom :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="nameId"
              v-model="form.name"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="m-1">
          <b-col sm="3">
            <label>Prénom :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="firstNameId"
              v-model="form.firstName"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="m-1">
          <b-col sm="3">
            <label>Abréviation :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="abrId"
              v-model="form.abr"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>

        <b-button class="m-3" type="submit"  variant="primary">Sauver</b-button>
        <b-button class="m-3" type="reset" variant="danger">Annuler</b-button>
      </b-form>
    </b-container>
  </b-modal>
</template>

<script>
import axios from "axios";


export default {
  components: {},
  props: [],
  data() {
    return {
      form: [{ name: "", firstName: "", trigram: "" }],
    };
  },
  methods: {
    onSubmit(event) {      
   
           axios
          .post(
            "/producers",
            JSON.stringify({
              name : this.form.name,
              firstName : this.form.firstName,
              abr : this.form.abr,
            })
          )
          .then((response) => (this.requests = response.data));

      
      this.$bvModal.hide("modal-addproducer");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("modal-addproducer");
    },
  },
};
</script>

<style>
</style>