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
    };
  },

  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.fetchContractParams();
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
  
  onSubmit(event) {
    axios
      .post("/contractParams", this.form)
      .then((response) => (this.requests = response.data));
  },
  }
};
</script>

<style>
</style>