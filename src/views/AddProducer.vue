<template>
  
    <b-container fluid>
      <b-row
        ><b-col cols="3">
          <b-form-select
            v-model="selectedProducer"
            :options="producers"
            v-on:change="changeProducer"
            class="m-2"
          ></b-form-select>
        </b-col>
        <b-col cols="3">
          <b-icon
                  
                  @click="deleteProducer"
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
         <b-row class="m-1">
          <b-col sm="3">
            <label>Entreprise :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="companyId"
              v-model="form.company"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
         <b-row class="m-1">
          <b-col sm="3">
            <label>N° :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="numberId"
              v-model="form.number"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
         <b-row class="m-1">
          <b-col sm="3">
            <label>Voirie :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="roadId"
              v-model="form.road"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
         <b-row class="m-1">
          <b-col sm="3">
            <label>Code postal :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="postCodeId"
              v-model="form.postCode"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
         <b-row class="m-1">
          <b-col sm="3">
            <label>Localité :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="townId"
              v-model="form.town"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
         <b-row class="m-1">
          <b-col sm="3">
            <label>Téléphone :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="phoneId"
              v-model="form.phone"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
         <b-row class="m-1">
          <b-col sm="3">
            <label>GSM :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="gsmId"
              v-model="form.gsm"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
         <b-row class="m-1">
          <b-col sm="3">
            <label>Courriel :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="mailId"
              v-model="form.mail"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
         <b-row class="m-1">
          <b-col sm="3">
            <label># Compte :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="accountId"
              v-model="form.account"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
         <b-row class="m-1">
          <b-col sm="3">
            <label># TVA :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="tvaId"
              v-model="form.tva"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>

        <b-button class="m-3" type="submit"  variant="primary">Sauver</b-button>
       
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
      form: [{ id : "", name: "", firstName: "", abr: "", company: "", number: "", road: "", postCode: "", town: "", phone: "",gsm: "",  mail: "", account: "", tva: "" }],
      selectedProducer: null,
      producers: [{ value: null, text: "Choisir un producteur..." }]
    };
  },
  mounted() {
     if (!this.currentUser) {
      this.$router.push('/login');
    }
    this.fetchProducers();
  },
    computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    async fetchProducers() {
      const json = await axios
        .get("/producers")
        .then((response) => (this.requests = response.data));
      json.forEach((element) =>
        this.producers.push({ value: element.id, text: element.abr })
      );
    },
    async changeProducer(arg) {
      const json = await axios
        .get("/producers/" + arg)
        .then((response) => (this.requests = response.data));
      this.form= json;        
    },
    onSubmit(event) {      
   
           axios
          .post(
            "/producers",
            JSON.stringify({
              id: this.form.id,
              name : this.form.name,
              firstName : this.form.firstName,
              abr : this.form.abr,
              company : this.form.company,
              number : this.form.number,
              road : this.form.road,
              postCode : this.form.postCode,
              town : this.form.town,
              phone : this.form.phone,
              gsm : this.form.gsm,
              mail : this.form.mail,
              account : this.form.account,
              tva : this.form.tva
            })
          )
          .then((response) => (this.requests = response.data));

 
    },

    deleteProducer(){
      axios.delete("/producers/" + this.selectedProducer);
      this.producers = [{ value: null, text: "Choisir un producteur..." }];
      this.form = [{ id : "", name: "", firstName: "", abr: "", company: "", number: "", road: "", postCode: "", town: "", phone: "",gsm: "",  mail: "", account: "", tva: "" }];
      this.fetchProducers();

    }
  },
};
</script>

<style>
</style>