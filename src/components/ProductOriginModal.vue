<template>
  <b-modal
    id="product-origin-modal"
    :hide-footer="true"
    title="Origines"
    hide-header-close
  >
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel" >
        <div
          v-for="(productOrigin, index) in productOrigins"
          :key="productOrigin.id"
        >
          <b-row v-if="productOrigin.id">
            <b-col v-if="productOrigin.name !== ''">
              {{ productOrigin.name }}
            </b-col>
            <b-col v-else>
              <b-form-input
                :state="nameState"
                trim
                v-model="newProductOrigin"
              ></b-form-input>
              <b-form-invalid-feedback id="input-live-feedback">
                Le nom ne peut pas être vide et unique.
              </b-form-invalid-feedback>
            </b-col>
            <b-col v-if="productOrigin.name !== ''">
              <b-icon
                @click="deleteOrigin(productOrigin, index)"
                variant="danger"
                icon="trash"
                scale="1"
              ></b-icon>
            </b-col>
            <b-col v-else>
              <b-icon
                @click="validOrigin(index)"
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
              @click="addOrigin()"
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
  props: ["productOrigins", "productOriginList"],
  data() {
    return {
      newProductOrigin: "",
      canAdd: true,
      canSave: false,
      currval: 0,
    };
  },
  computed: {
    nameState(arg) {
      var exists = this.productOrigins.some((field) => {
        return field.name == this.newProductOrigin;
      });

      var length = this.newProductOrigin.length > 0 ? true : false;

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
        .get("/productOrigins/sequencecurrVal")
        .then((response) => (this.currval = response.data));
    },
    onSubmit(event) {
      event.preventDefault();

      this.newProductOrigin = "";
      if (this.canSave) {
        axios
          .post("/productOrigins", this.productOrigins)
          .then((response) => (this.requests = response.data));
        this.canSave = false;
      }

      this.$bvModal.hide("product-origin-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.newProductOrigin = "";
      this.$bvModal.hide("product-origin-modal");
    },
    deleteOrigin(origin, index) {
      if (!this.canSave) {
      axios
        .delete("/productOrigins/" + origin.id)
        .then((response) => {
          this.productOrigins.splice(index, 1);
          this.productOriginList.splice(index + 1, 1);
        })
        .catch((e) => {
          this.$bvToast.toast("Impossible de supprimer cet élément", {
            title: "Info",
            variant: "danger",
            solid: true,
          });
        });
      }else{
        this.productOrigins.splice(index, 1);
        this.productOriginList.splice(index + 1, 1);
      }
    },
    addOrigin() {
      if (this.canAdd) {
        this.productOrigins.push({
          id: this.currval + 1,
          name: "",
        });
        this.newProductOrigin = "";
        this.canAdd = false;
      }
    },

    validOrigin(index) {
      if (this.nameState) {
        this.productOrigins.splice(index, 1);
        this.productOrigins.push({
          id: this.currval + 1,
          name: this.newProductOrigin,
        });
        this.productOriginList.push({
          value: this.currval + 1,
          text: this.newProductOrigin,
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