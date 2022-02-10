<template>
  <b-modal id="packaging-modal" :hide-footer="true" title="Emballages">
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <div v-for="packaging in packagings" :key="packaging.id">
          <b-row v-if="packaging.id">
            <b-col v-if="packaging.name !== ''">
              {{ packaging.name }}
            </b-col>
            <b-col v-else>
              <b-form-input v-model="newPackaging"></b-form-input>
            </b-col>
            <b-col v-if="packaging.name !== ''">
              <b-icon
                @click="deletePackaging(packaging)"
                variant="danger"
                icon="trash"
                scale="1"
              ></b-icon>
            </b-col>
            <b-col v-else>
              <b-icon
                @click="validPackaging"
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
              @click="addPackaging"
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
  props: ["packagings"],
  data() {
    return {
      newPackaging: "",
    };
  },
  mounted() {},
  methods: {
    onSubmit(event) {
     
      const json =axios
        .post("/packagings", this.packagings)
        .then((response) => (this.requests = response.data));
       

      this.$bvModal.hide("packaging-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("packaging-modal");
    },
    deletePackaging(packaging) {
      this.packagings.splice(this.packagings.indexOf(packaging), 1);
      axios.delete("/packagings/" + packaging.id);    
    },
    addPackaging(arg) {
      this.packagings.push({ id: this.packagings.length + 1, name: "" });
    },
    validPackaging() {
      this.packagings.splice(this.packagings.length - 1, 1);
      this.packagings.push({
        id: this.packagings.length + 1,
        name: this.newPackaging,
      });
      this.newPackaging = "";
    },
  },
};
</script>

<style>
</style>