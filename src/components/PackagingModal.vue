<template>
  <b-modal id="packaging-modal" :hide-footer="true" title="Emballages" hide-header-close>
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <div v-for="(packaging, index) in packagings" :key="packaging.id">
          <b-row v-if="packaging.id">
            <b-col v-if="packaging.name !== ''">
              {{ packaging.name }}
            </b-col>
            <b-col v-else>
              <b-form-input
                :state="nameState"
                trim
                v-model="newPackaging"
              ></b-form-input>
              <b-form-invalid-feedback id="input-live-feedback">
                Le nom ne peut pas être vide et unique.
              </b-form-invalid-feedback>
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
                @click="validPackaging(index)"
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
              @click="addPackaging()"
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
  props: ["packagings", "packagingList"],
  data() {
    return {
      newPackaging: "",
      canAdd: true,
      canSave: false,
      currval: 0,
    };
  },
  computed: {
    nameState(arg) {
      var exists = this.packagings.some((field) => {
        return field.name == this.newPackaging;
      });

      var length = this.newPackaging.length > 0 ? true : false;

      if (!exists && length) {
        return true;
      } else return false;
    },
  },
  mounted() {
    this.fetchCurrVal();
  },
  methods: {
    async fetchCurrVal() {
      await axios
        .get("/packagings/sequencecurrVal")
        .then((response) => (this.currval = response.data));
    },
    onSubmit(event) {
      event.preventDefault();

      this.newPackaging = "";
      if (this.canSave) {
        axios
          .post("/packagings", this.packagings)
          .then((response) => (this.requests = response.data));
        this.canSave = false;
      }

      this.$bvModal.hide("packaging-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.newPackaging = "";
      this.$bvModal.hide("packaging-modal");
    },
    deletePackaging(packaging, index) {
      if (!this.canSave) {
      axios
        .delete("/packagings/" + packaging.id)
        .then((response) => {
          this.packaging.splice(index, 1);
          this.packaging.splice(index + 1, 1);
        })
        .catch((e) => {
          this.$bvToast.toast("Impossible de supprimer cet élément", {
            title: "Info",
            variant: "danger",
            solid: true,
          });
        });
      }else{
        this.packagings.splice(index, 1);
        this.packagingList.splice(index + 1, 1);
      }
    },
      addPackaging() {
      if (this.canAdd) {
        this.packagings.push({
          id: this.currval + 1,
          name: "",
        });
        this.newPackaging = "";
        this.canAdd = false;
      }
    },
     validPackaging(index) {
      if (this.nameState) {
        this.packagings.splice(index, 1);
        this.packagings.push({
          id: this.currval + 1,
          name: this.newPackaging,
        });
        this.packagingList.push({
          value: this.currval + 1,
          text: this.newPackaging,
        });
        this.currval++;
        this.canAdd = true;
        this.canSave = true;
      }
    },
  },
};
</script>

<style>
</style>