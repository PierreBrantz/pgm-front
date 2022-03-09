<template>
  <b-modal
    id="product-unit-modal"
    :hide-footer="true"
    title="Units"
    hide-header-close
  >
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel" >
        <div
          v-for="(productUnit, index) in productUnits"
          :key="productUnit.id"
        >
          <b-row v-if="productUnit.id">
            <b-col v-if="productUnit.name !== ''">
              {{ productUnit.name }}
            </b-col>
            <b-col v-else>
              <b-form-input
                :state="nameState"
                trim
                v-model="newProductUnit"
              ></b-form-input>
              <b-form-invalid-feedback id="input-live-feedback">
                Le nom ne peut pas être vide et unique.
              </b-form-invalid-feedback>
            </b-col>
            <b-col v-if="productUnit.name !== ''">
              <b-icon
                @click="deleteUnit(productUnit, index)"
                variant="danger"
                icon="trash"
                scale="1"
              ></b-icon>
            </b-col>
            <b-col v-else>
              <b-icon
                @click="validUnit(index)"
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
              @click="addUnit()"
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
  props: ["productUnits", "productUnitList"],
  data() {
    return {
      newProductUnit: "",
      canAdd: true,
      canSave: false,
      currval: 0,
    };
  },
  computed: {
    nameState(arg) {
      var exists = this.productUnits.some((field) => {
        return field.name == this.newProductUnit;
      });

      var length = this.newProductUnit.length > 0 ? true : false;

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
        .get("/productUnits/sequencecurrVal")
        .then((response) => (this.currval = response.data));
    },
    onSubmit(event) {
      event.preventDefault();

      this.newProductUnit = "";
      if (this.canSave) {
        axios
          .post("/productUnits", this.productUnits)
          .then((response) => (this.requests = response.data));
        this.canSave = false;
      }

      this.$bvModal.hide("product-unit-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.newProductUnit = "";
      this.$bvModal.hide("product-unit-modal");
    },
    deleteUnit(unit, index) {
      if (!this.canSave) {
      axios
        .delete("/productUnits/" + unit.id)
        .then((response) => {
          this.productUnits.splice(index, 1);
          this.productUnitList.splice(index + 1, 1);
        })
        .catch((e) => {
          this.$bvToast.toast("Impossible de supprimer cet élément", {
            title: "Info",
            variant: "danger",
            solid: true,
          });
        });
      }else{
        this.productUnits.splice(index, 1);
        this.productUnitList.splice(index + 1, 1);
      }
    },
    addUnit() {
      if (this.canAdd) {
        this.productUnits.push({
          id: this.currval + 1,
          name: "",
        });
        this.newProductUnit = "";
        this.canAdd = false;
      }
    },

    validUnit(index) {
      if (this.nameState) {
        this.productUnits.splice(index, 1);
        this.productUnits.push({
          id: this.currval + 1,
          name: this.newProductUnit,
        });
        this.productUnitList.push({
          value: this.currval + 1,
          text: this.newProductUnit,
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