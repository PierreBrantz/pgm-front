<template>
  <b-modal
    id="product-label-modal"
    :hide-footer="true"
    title="Labels"
    hide-header-close
  >
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel" >
        <div
          v-for="(productLabel, index) in productLabels"
          :key="productLabel.id"
        >
          <b-row v-if="productLabel.id">
            <b-col v-if="productLabel.name !== ''">
              {{ productLabel.name }}
            </b-col>
            <b-col v-else>
              <b-form-input
                :state="nameState"
                trim
                v-model="newProductLabel"
              ></b-form-input>
              <b-form-invalid-feedback id="input-live-feedback">
                Le nom ne peut pas être vide et unique.
              </b-form-invalid-feedback>
            </b-col>
            <b-col v-if="productLabel.name !== ''">
              <b-icon
                @click="deleteLabel(productLabel, index)"
                variant="danger"
                icon="trash"
                scale="1"
              ></b-icon>
            </b-col>
            <b-col v-else>
              <b-icon
                @click="validLabel(index)"
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
              @click="addLabel()"
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
  props: ["productLabels", "productLabelList"],
  data() {
    return {
      newProductLabel: "",
      canAdd: true,
      canSave: false,
      currval: 0,
    };
  },
  computed: {
    nameState(arg) {
      var exists = this.productLabels.some((field) => {
        return field.name == this.newProductLabel;
      });

      var length = this.newProductLabel.length > 0 ? true : false;

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
        .get("/productLabels/sequencecurrVal")
        .then((response) => (this.currval = response.data));
    },
    onSubmit(event) {
      event.preventDefault();

      this.newProductLabel = "";
      if (this.canSave) {
        axios
          .post("/productLabels", this.productLabels)
          .then((response) => (this.requests = response.data));
        this.canSave = false;
      }

      this.$bvModal.hide("product-label-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.newProductLabel = "";
      this.$bvModal.hide("product-label-modal");
    },
    deleteLabel(label, index) {
      if (!this.canSave) {
      axios
        .delete("/productLabels/" + label.id)
        .then((response) => {
          this.productLabels.splice(index, 1);
          this.productLabelList.splice(index + 1, 1);
        })
        .catch((e) => {
          this.$bvToast.toast("Impossible de supprimer cet élément", {
            title: "Info",
            variant: "danger",
            solid: true,
          });
        });
      }else{
        this.productLabels.splice(index, 1);
        this.productLabelList.splice(index + 1, 1);
      }
    },
    addLabel() {
      if (this.canAdd) {
        this.productLabels.push({
          id: this.currval + 1,
          name: "",
        });
        this.newProductLabel = "";
        this.canAdd = false;
      }
    },

    validLabel(index) {
      if (this.nameState) {
        this.productLabels.splice(index, 1);
        this.productLabels.push({
          id: this.currval + 1,
          name: this.newProductLabel,
        });
        this.productLabelList.push({
          value: this.currval + 1,
          text: this.newProductLabel,
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