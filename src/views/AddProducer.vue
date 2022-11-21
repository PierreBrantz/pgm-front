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

    <b-form>
      <b-row class="m-1">
        <b-col sm="3">
          <label>Nom :</label>
        </b-col>
        <b-col sm="9">
          <b-form-input
            id="nameId"
            v-model="form.name"
            :state="form.name != null && form.name.length > 0"
            size="sm"
          ></b-form-input>
          <b-form-invalid-feedback id="input-live-feedback">
            Le nom ne peut pas être vide.
          </b-form-invalid-feedback>
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
            :state="form.firstName != null && form.firstName.length > 0"
            size="sm"
          ></b-form-input>
          <b-form-invalid-feedback id="input-live-feedback">
            Le prénom ne peut pas être vide.
          </b-form-invalid-feedback>
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
            :state="form.abr != null && form.abr.length == 3"
            size="sm"
          ></b-form-input>
          <b-form-invalid-feedback id="input-live-feedback">
            L'abréviation doit faire 3 caractères.
          </b-form-invalid-feedback>
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
          <label>Certification :</label>
        </b-col>
         <b-col sm="8">
          <b-form-select
            v-model="selectedCertificate"
            :options="certificateList"
          ></b-form-select>
        </b-col>
        <!--
        <b-col sm="1">
          <b-icon
            @click="editCertificate"
            variant="primary"
            icon="pencil"
            scale="1.5"
            aria-hidden="true"
          ></b-icon>
        </b-col>
        -->
      </b-row>



      <b-row class="m-1">
         <b-col sm="3">
          <label>Type :</label>
        </b-col>
         <b-col sm="8">
          <b-form-select
            v-model="selectedProducerType"
            :options="producerTypeList"
          ></b-form-select>
        </b-col>
        <!--
        <b-col sm="1">
          <b-icon
            @click="editProducerType"
            variant="primary"
            icon="pencil"
            scale="1.5"
            aria-hidden="true"
          ></b-icon>
        </b-col>
        -->
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
          <b-form-input id="gsmId" v-model="form.gsm" size="sm"></b-form-input>
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
          <b-form-input id="tvaId" v-model="form.tva" size="sm"></b-form-input>
        </b-col>
      </b-row>
    </b-form>
    <b-button
      class="m-3"
      :disabled="
        (form.abr == null ||
        form.abr.length != 3 ) ||
        (form.name == null ||
        form.name.length < 1) ||
        (form.firstName == null ||
        form.firstName.length < 1)
      "
      @click="onSubmit"
      type="submit"
      variant="primary"
      >Sauver</b-button
    >
    <b-button
      class="m-3"      
      @click="clean"
      type="submit"
      variant="warning"
      >Vider</b-button
    >
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  props: [],
  data() {
    return {
      form: [
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
          tva: ""
        },
      ],
      selectedProducer: null,
      producers: [{ value: null, text: "Choisir un producteur..." }],
      selectedCertificate: null,
      certificates: [],
      certificateList: [{ value: null, text: "Choisir une certification..." }],
      selectedProducerType: null,
      producerTypes: [],
      producerTypeList: [{ value: null, text: "Choisir un type..." }]

    };
  },

  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.fetchProducers();
    this.fetchCertificates();
    this.fetchProducerTypes();
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
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
      this.form = json;
       if(this.form.certificate != null)
          this.selectedCertificate = this.form.certificate.id;
        if(this.form.producerType != null)
          this.selectedProducerType = this.form.producerType.id;
    },
    async fetchCertificates() {
      const json = await axios
        .get("/certificates")
        .then((response) => (this.requests = response.data));
        this.certificates = json;
      json.forEach((element) =>
        this.certificateList.push({ value: element.id, text: element.name })
      );
    },
    async fetchProducerTypes() {
      const json = await axios
        .get("/producerTypes")
        .then((response) => (this.requests = response.data));
        this.producerTypes = json;
      json.forEach((element) =>
        this.producerTypeList.push({ value: element.id, text: element.name })
      );
    },
       editCertificate(arg){ 
      //this.$root.$emit("bv::show::modal", "product-label-modal", "#btnShow");
       },

         editProducerType(arg){ 
      //this.$root.$emit("bv::show::modal", "product-label-modal", "#btnShow");
       },
    
    onSubmit(event) {
      event.preventDefault();

        this.form.certificate =  this.certificates.find((item) => {
              if (item.id === this.selectedCertificate) {
                return item.id;
              }
        });

        this.form.producerType =  this.producerTypes.find((item) => {
              if (item.id === this.selectedProducerType) {
                return item.id;
              }
        });


      axios
        .post(
          "/producers",
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
            certificate : this.form.certificate,
            producerType: this.form.producerType
          })
        )
        .then((response) => {
          var add = true;
        this.producers.find((item) => {
        if (item.text === response.data.abr)
          add = false;
        });
        if(add)
          this.producers.push({ value: response.data.id, text: response.data.abr});
          });
      
      this.clean();

      this.$bvToast.toast("Producteur sauvé.", {
        title: "Info",
        variant: "success",
        solid: true,
      });
      
    },

    deleteProducer(prod) {

      axios.delete("/producers/" + this.selectedProducer);
  
      this.clean();
      this.$bvToast.toast("Producteur effacé.", {
        title: "Info",
        variant: "success",
        solid: true,
      });

 
      this.producers.splice(this.producers.findIndex(x => x.value === this.selectedProducer), 1);
     
    },
    clean(){
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
          certificate: ""
        },],
        this.selectedCertificate = null;
        this.selectedProducer = null;
        this.selectedProducerType = null;
    }
  },
};
</script>

<style>
</style>