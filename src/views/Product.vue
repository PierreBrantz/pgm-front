<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <b-container>
      <b-row>
        <b-col cols="3">
          <b-form-select
            v-model="selectedProduct"
            :options="productList"
            v-on:change="changeProduct"
            class="m-2"
          ></b-form-select>
        </b-col>
        <b-col cols="3">
          <b-form-select
            v-model="selectedProducer"
            :options="producers"
            class="m-2"
          ></b-form-select>
        </b-col>

        <b-col cols="2">
          <b-button
            variant="outline-primary"
            @click="addProducerClick"
            class="m-2"
            >Associer Producteur</b-button
          >
          <!--
          <b-button variant="outline-primary" @click="share" class="m-2"
            >Répartir</b-button
          >
          -->
        </b-col>
        <b-col cols="3"> </b-col>
      </b-row>

      <div id="titleId">
        <b-row v-if="product != null">{{ product.name }}</b-row>
        <b-row v-if="product != null">{{
          "Packaging: " + product.packaging.name
        }}</b-row>
      </div>
      <br />
      <b-row>
        <div>
          <b-table
            striped
            hover
            bordered
            fixed
            head-variant="dark"
            :items="items"
            :fields="fields"
            @input-change="handleInput"
          >
            <template #table-colgroup="scope">
              <col
                v-for="field in scope.fields"
                :key="field.key"
                :style="{ width: '1.5rem' }"
              />
            </template>
          </b-table></div
      ></b-row>

      <b-row v-if="items2.length > 0" id="producerFieldId">Producteurs</b-row>

      <b-row>
        <div>
          <b-editable-table
            striped
            hover
            bordered
            fixed
            head-variant="dark"
            :items="items2"
            :fields="fields2"
            thead-class="d-none"
            @input-change="handleInput"
          >
            <template #table-colgroup="scope">
              <col
                v-for="field in scope.fields2"
                :key="field.key"
                :style="{ width: '1.5rem', padding: '0px' }"
              />
            </template>

            <template v-slot:cell(action)="{ item }">
              <div v-if="item.id >= 0">
                <b-icon
                  v-if="userRow.length > 0 && userRow[0].id === item.id"
                  @click="saveEdit(item)"
                  icon="check-square"
                  scale="1.3"
                  aria-hidden="true"
                  variant="success"
                ></b-icon>

                <b-icon
                  v-else
                  @click="deleteProduct(item)"
                  variant="danger"
                  icon="trash"
                  scale="1.3"
                  aria-hidden="true"
                ></b-icon>
              </div>
            </template>
          </b-editable-table></div
      ></b-row>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import BEditableTable from "bootstrap-vue-editable-table";

const TOTAL_COLOR = "#ccffb3";

export default {
  data() {
    return {
      selectedProducer: null,
      selectedProduct: null,
      producers: [{ value: null, text: "Choisir un producteur..." }],
      productList: [{ value: null, text: "Choisir un produit..." }],
      product: null,
      items: [],
      fields: [],
      items2: [],
      fields2: [],
      selectedRow: {},
      selectedCell: null,
      saveButtonDisplay: false,
      userRow: [],
    };
  },
  components: { BEditableTable },
  mounted() {
    this.fetchProducers();
    this.fetchProductList();
  },
  computed: {
    editableFields() {
      return this.fields.filter((field) => {
        return field.editable === true;
      });
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

    async fetchProductList() {
      const json = await axios
        .get("/products")
        .then((response) => (this.requests = response.data));
      json.forEach((element) =>
        this.productList.push({ value: element.id, text: element.name })
      );
    },
    async changeProduct(arg) {
      const json = await axios
        .get("/products/" + arg)
        .then((response) => (this.requests = response.data));
      this.product = json[0];
      this.items2 = [];
      this.fields2 = [];
      this.items = [
        {
          col1: "Théo.",
          Janvier: this.product.quantities[0].quantity1,
          Février: this.product.quantities[0].quantity2,
          Mars: this.product.quantities[0].quantity3,
          Avril: this.product.quantities[0].quantity4,
          Mai: this.product.quantities[0].quantity5,
          Juin: this.product.quantities[0].quantity6,
          Juillet: this.product.quantities[0].quantity7,
          Août: this.product.quantities[0].quantity8,
          Septembre: this.product.quantities[0].quantity9,
          Octobre: this.product.quantities[0].quantity10,
          Novembre: this.product.quantities[0].quantity11,
          Décembre: this.product.quantities[0].quantity12,
        },
        {
          col1: "Diff.",
          Janvier:
            this.computeTotalQuantityForAMonth(1) -
            this.product.quantities[0].quantity1,
          Février:
            this.computeTotalQuantityForAMonth(2) -
            this.product.quantities[0].quantity2,
          Mars:
            this.computeTotalQuantityForAMonth(3) -
            this.product.quantities[0].quantity3,
          Avril:
            this.computeTotalQuantityForAMonth(4) -
            this.product.quantities[0].quantity4,
          Mai:
            this.computeTotalQuantityForAMonth(5) -
            this.product.quantities[0].quantity5,
          Juin:
            this.computeTotalQuantityForAMonth(6) -
            this.product.quantities[0].quantity6,
          Juillet:
            this.computeTotalQuantityForAMonth(7) -
            this.product.quantities[0].quantity7,
          Août:
            this.computeTotalQuantityForAMonth(8) -
            this.product.quantities[0].quantity8,
          Septembre:
            this.computeTotalQuantityForAMonth(9) -
            this.product.quantities[0].quantity9,
          Octobre:
            this.computeTotalQuantityForAMonth(10) -
            this.product.quantities[0].quantity10,
          Novembre:
            this.computeTotalQuantityForAMonth(11) -
            this.product.quantities[0].quantity11,
          Décembre:
            this.computeTotalQuantityForAMonth(12) -
            this.product.quantities[0].quantity12,
          _cellVariants: this.computeColor(),
        },
        {
          col1: "Prix",
          Janvier: this.product.price * this.product.seasons[0],
          Février: this.product.price * this.product.seasons[1],
          Mars: this.product.price * this.product.seasons[2],
          Avril: this.product.price * this.product.seasons[3],
          Mai: this.product.price * this.product.seasons[4],
          Juin: this.product.price * this.product.seasons[5],
          Juillet: this.product.price * this.product.seasons[6],
          Août: this.product.price * this.product.seasons[7],
          Septembre: this.product.price * this.product.seasons[8],
          Octobre: this.product.price * this.product.seasons[9],
          Novembre: this.product.price * this.product.seasons[10],
          Décembre: this.product.price * this.product.seasons[11],
        },
      ];

      for (let index = 0; index < this.product.producers.length; index++) {
        let q1 = 0,
          q2 = 0,
          q3 = 0,
          q4 = 0,
          q5 = 0,
          q6 = 0,
          q7 = 0,
          q8 = 0,
          q9 = 0,
          q10 = 0,
          q11 = 0,
          q12 = 0;
        if (this.product.producers[index].realQuantities.length > 0) {
          q1 =
            this.product.producers[index].realQuantities[0].quantity1 > 0
              ? this.product.producers[index].realQuantities[0].quantity1
              : 0;
          q2 =
            this.product.producers[index].realQuantities[0].quantity2 > 0
              ? this.product.producers[index].realQuantities[0].quantity2
              : 0;
          q3 =
            this.product.producers[index].realQuantities[0].quantity3 > 0
              ? this.product.producers[index].realQuantities[0].quantity3
              : 0;
          q4 =
            this.product.producers[index].realQuantities[0].quantity4 > 0
              ? this.product.producers[index].realQuantities[0].quantity4
              : 0;
          q5 =
            this.product.producers[index].realQuantities[0].quantity5 > 0
              ? this.product.producers[index].realQuantities[0].quantity5
              : 0;
          q6 =
            this.product.producers[index].realQuantities[0].quantity6 > 0
              ? this.product.producers[index].realQuantities[0].quantity6
              : 0;
          q7 =
            this.product.producers[index].realQuantities[0].quantity7 > 0
              ? this.product.producers[index].realQuantities[0].quantity7
              : 0;
          q8 =
            this.product.producers[index].realQuantities[0].quantity8 > 0
              ? this.product.producers[index].realQuantities[0].quantity8
              : 0;
          q9 =
            this.product.producers[index].realQuantities[0].quantity9 > 0
              ? this.product.producers[index].realQuantities[0].quantity9
              : 0;
          q10 =
            this.product.producers[index].realQuantities[0].quantity10 > 0
              ? this.product.producers[index].realQuantities[0].quantity10
              : 0;
          q11 =
            this.product.producers[index].realQuantities[0].quantity11 > 0
              ? this.product.producers[index].realQuantities[0].quantity11
              : 0;
          q12 =
            this.product.producers[index].realQuantities[0].quantity12 > 0
              ? this.product.producers[index].realQuantities[0].quantity12
              : 0;
        }
        this.items2.push({
          id: index,
          col1: this.product.producers[index].abr,
          Janvier: q1,
          Février: q2,
          Mars: q3,
          Avril: q4,
          Mai: q5,
          Juin: q6,
          Juillet: q7,
          Août: q8,
          Septembre: q9,
          Octobre: q10,
          Novembre: q11,
          Décembre: q12,
        });
      }

      this.fields = [
        { key: "col1", label: "", variant: "dark" },
        { key: "Janvier", label: "Jan.", type: "number", editable: true },
        { key: "Février", label: "Fév.", type: "number", editable: true },
        { key: "Mars", label: "Mars", type: "number", editable: true },
        { key: "Avril", label: "Avril", type: "number", editable: true },
        { key: "Mai", label: "Mai", type: "number", editable: true },
        { key: "Juin", label: "Juin", type: "number", editable: true },
        { key: "Juillet", label: "Juill.", type: "number", editable: true },
        { key: "Août", label: "Août", type: "number", editable: true },
        {
          key: "Septembre",
          label: "Sept.",
          type: "number",
          editable: true,
        },
        { key: "Octobre", label: "Oct.", type: "number", editable: true },
        { key: "Novembre", label: "Nov.", type: "number", editable: true },
        { key: "Décembre", label: "Déc.", type: "number", editable: true },
        { key: "action" },
      ];

      this.fields2 = [
        { key: "col1", label: "", variant: "dark" },
        { key: "Janvier", label: "Janvier", type: "number", editable: true },
        { key: "Février", label: "Février", type: "number", editable: true },
        { key: "Mars", label: "Mars", type: "number", editable: true },
        { key: "Avril", label: "Avril", type: "number", editable: true },
        { key: "Mai", label: "Mai", type: "number", editable: true },
        { key: "Juin", label: "Juin", type: "number", editable: true },
        { key: "Juillet", label: "Juillet", type: "number", editable: true },
        { key: "Août", label: "Août", type: "number", editable: true },
        {
          key: "Septembre",
          label: "Septembre",
          type: "number",
          editable: true,
        },
        { key: "Octobre", label: "Octobre", type: "number", editable: true },
        { key: "Novembre", label: "Novembre", type: "number", editable: true },
        { key: "Décembre", label: "Décembre", type: "number", editable: true },
        { key: "action" },
      ];
    },

    async addProducerClick() {
      if (this.selectedProduct == null) {
        this.$bvToast.toast("Veuillez choisir un produit...", {
          title: "Info",
          variant: "danger",
          solid: true,
        });
      } else if (this.selectedProducer == null) {
        this.$bvToast.toast("Veuillez choisir un producteur...", {
          title: "Info",
          variant: "danger",
          solid: true,
        });
      } else {
        await axios
          .post(
            "/producers/" +
              this.selectedProducer +
              "/product/" +
              this.selectedProduct
          )
          .then((response) => (this.requests = response.data));
        this.changeProduct(this.selectedProduct);
      }
    },
    computeTotalQuantityForAMonth(month) {
      let ret = 0;
      for (let index = 0; index < this.product.realQuantities.length; index++) {
        switch (month) {
          case 1:
            ret += this.product.realQuantities[index].quantity1;
            break;
          case 2:
            ret += this.product.realQuantities[index].quantity2;
            break;
          case 3:
            ret += this.product.realQuantities[index].quantity3;
            break;
          case 4:
            ret += this.product.realQuantities[index].quantity4;
            break;
          case 5:
            ret += this.product.realQuantities[index].quantity5;
            break;
          case 6:
            ret += this.product.realQuantities[index].quantity6;
            break;
          case 7:
            ret += this.product.realQuantities[index].quantity7;
            break;
          case 8:
            ret += this.product.realQuantities[index].quantity8;
            break;
          case 9:
            ret += this.product.realQuantities[index].quantity9;
            break;
          case 10:
            ret += this.product.realQuantities[index].quantity10;
            break;
          case 11:
            ret += this.product.realQuantities[index].quantity11;
            break;
          case 12:
            ret += this.product.realQuantities[index].quantity12;
            break;
        }
      }
      return ret;
    },
    computeColor() {
      let color1,
        color2,
        color3,
        color4,
        color5,
        color6,
        color7,
        color8,
        color9,
        color10,
        color11,
        color12;
      if (
        this.computeTotalQuantityForAMonth(1) -
          this.product.quantities[0].quantity1 >
        0
      ) {
        color1 = "info";
      } else color1 = "danger";
      if (
        this.computeTotalQuantityForAMonth(2) -
          this.product.quantities[0].quantity2 >
        0
      ) {
        color2 = "info";
      } else color2 = "danger";
      if (
        this.computeTotalQuantityForAMonth(3) -
          this.product.quantities[0].quantity3 >
        0
      ) {
        color3 = "info";
      } else color3 = "danger";
      if (
        this.computeTotalQuantityForAMonth(4) -
          this.product.quantities[0].quantity4 >
        0
      ) {
        color4 = "info";
      } else color4 = "danger";
      if (
        this.computeTotalQuantityForAMonth(5) -
          this.product.quantities[0].quantity5 >
        0
      ) {
        color5 = "info";
      } else color5 = "danger";
      if (
        this.computeTotalQuantityForAMonth(6) -
          this.product.quantities[0].quantity6 >
        0
      ) {
        color6 = "info";
      } else color6 = "danger";
      if (
        this.computeTotalQuantityForAMonth(7) -
          this.product.quantities[0].quantity7 >
        0
      ) {
        color7 = "info";
      } else color7 = "danger";
      if (
        this.computeTotalQuantityForAMonth(8) -
          this.product.quantities[0].quantity8 >
        0
      ) {
        color8 = "info";
      } else color8 = "danger";
      if (
        this.computeTotalQuantityForAMonth(9) -
          this.product.quantities[0].quantity9 >
        0
      ) {
        color9 = "info";
      } else color9 = "danger";
      if (
        this.computeTotalQuantityForAMonth(10) -
          this.product.quantities[0].quantity10 >
        0
      ) {
        color10 = "info";
      } else color10 = "danger";
      if (
        this.computeTotalQuantityForAMonth(11) -
          this.product.quantities[0].quantity11 >
        0
      ) {
        color11 = "info";
      } else color11 = "danger";
      if (
        this.computeTotalQuantityForAMonth(12) -
          this.product.quantities[0].quantity12 >
        0
      ) {
        color12 = "info";
      } else color12 = "danger";
      return {
        Janvier: color1,
        Février: color2,
        Mars: color3,
        Avril: color4,
        Mai: color5,
        Juin: color6,
        Juillet: color7,
        Août: color8,
        Septembre: color9,
        Octobre: color10,
        Novembre: color11,
        Décembre: color12,
      };
    },

    share() {
       if (
        this.computeTotalQuantityForAMonth(5) -
          this.product.quantities[0].quantity5 >
        0
      ) {
        let extraProducers = [];
        let division =
          this.computeTotalQuantityForAMonth(5) / this.product.producers.length;
   
        for (
          let index = 0;
          index < this.product.producers.length;
          index++
        ) {
          if (this.product.producers[index].realQuantities[0].quantity5 <= division) {
          
          } else {
            extraProducers.push(index);
          }
        }
  
        for (let index = 0; index < extraProducers.length; index++) {
        

          (this.items2[index].Mai-= (this.computeTotalQuantityForAMonth(5) -
          this.product.quantities[0].quantity5)/extraProducers.length).toFixed(2);
        //this.userRow = this.items2[index];
        }
        
      }
    },

    async deleteProduct(item) {
      await axios
        .delete(
          "/producers/" +
            this.product.producers[item.id].id +
            "/product/" +
            this.product.id
        )
        .then((response) => (this.requests = response.data));
      this.changeProduct(this.product.id);
    },

    async saveEdit(item) {
      await axios
        .put(
          "/products/" +
            this.product.id +
            "/producer/" +
            this.product.producers[item.id].id,
          JSON.stringify({
            id: this.product.id,
            name: this.product.name,
            packaging: this.product.packaging,
            realQuantities: this.product.producers[item.id].realQuantities,
            price: this.product.price,
            seasonInformation: this.product.seasonInformation,
          })
        )
        .then((response) => (this.requests = response.data));

      this.userRow = [];
      this.changeProduct(this.product.id);
    },

    async handleInput(value, data) {
      let doEdit = true;
      if (this.userRow.length > 0) {
        doEdit = false;
      }

      if (doEdit) {
        this.userRow.push({ ...data.item });
  
      }

      switch (data.field.key) {
        case "Janvier":
          if (this.product.producers[data.index].realQuantities.length == 0) {
            this.product.producers[data.index].realQuantities[0] = {
              id: this.product.id,
              quantity1: value,
            };
          } else {
            this.product.producers[data.index].realQuantities[0].quantity1 =
              value;
          }
          break;
        case "Février":
          if (this.product.producers[data.index].realQuantities.length == 0) {
            this.product.producers[data.index].realQuantities[0] = {
              id: this.product.id,
              quantity2: value,
            };
          } else {
            this.product.producers[data.index].realQuantities[0].quantity2 =
              value;
          }
          break;
        case "Mars":
          if (this.product.producers[data.index].realQuantities.length == 0) {
            this.product.producers[data.index].realQuantities[0] = {
              id: this.product.id,
              quantity3: value,
            };
          } else {
            this.product.producers[data.index].realQuantities[0].quantity3 =
              value;
          }
          break;
        case "Avril":
          if (this.product.producers[data.index].realQuantities.length == 0) {
            this.product.producers[data.index].realQuantities[0] = {
              id: this.product.id,
              quantity4: value,
            };
          } else {
            this.product.producers[data.index].realQuantities[0].quantity4 =
              value;
          }
          break;
        case "Mai":
          if (this.product.producers[data.index].realQuantities.length == 0) {
            this.product.producers[data.index].realQuantities[0] = {
              id: this.product.id,
              quantity5: value,
            };
          } else {
            this.product.producers[data.index].realQuantities[0].quantity5 =
              value;
          }
          break;
        case "Juin":
          if (this.product.producers[data.index].realQuantities.length == 0) {
            this.product.producers[data.index].realQuantities[0] = {
              id: this.product.id,
              quantity6: value,
            };
          } else {
            this.product.producers[data.index].realQuantities[0].quantity6 =
              value;
          }
          break;
        case "Juillet":
          if (this.product.producers[data.index].realQuantities.length == 0) {
            this.product.producers[data.index].realQuantities[0] = {
              id: this.product.id,
              quantity7: value,
            };
          } else {
            this.product.producers[data.index].realQuantities[0].quantity7 =
              value;
          }
          break;
        case "Août":
          if (this.product.producers[data.index].realQuantities.length == 0) {
            this.product.producers[data.index].realQuantities[0] = {
              id: this.product.id,
              quantity8: value,
            };
          } else {
            this.product.producers[data.index].realQuantities[0].quantity8 =
              value;
          }
          break;
        case "Septembre":
          if (this.product.producers[data.index].realQuantities.length == 0) {
            this.product.producers[data.index].realQuantities[0] = {
              id: this.product.id,
              quantity9: value,
            };
          } else {
            this.product.producers[data.index].realQuantities[0].quantity9 =
              value;
          }
          break;
        case "Octobre":
          if (this.product.producers[data.index].realQuantities.length == 0) {
            this.product.producers[data.index].realQuantities[0] = {
              id: this.product.id,
              quantity10: value,
            };
          } else {
            this.product.producers[data.index].realQuantities[0].quantity10 =
              value;
          }
          break;
        case "Novembre":
          if (this.product.producers[data.index].realQuantities.length == 0) {
            this.product.producers[data.index].realQuantities[0] = {
              id: this.product.id,
              quantity11: value,
            };
          } else {
            this.product.producers[data.index].realQuantities[0].quantity11 =
              value;
          }
          break;
        case "Décembre":
          if (this.product.producers[data.index].realQuantities.length == 0) {
            this.product.producers[data.index].realQuantities[0] = {
              id: this.produ18ct.id,
              quantity12: value,
            };
          } else {
            this.product.producers[data.index].realQuantities[0].quantity12 =
              value;
          }
          break;

        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.btn {
  font-size: 0.8rem;
}

#titleId {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  padding-left: 25px;
  font-size: 1.5rem;
  border-width: 1px;
  border-style: none;
  border-color: black;
  border-radius: 25px;
}

.table {
  margin-left: 0px;
  margin-right: 0px;
  font-size: 15px;
  width: 100%;
  table-layout: fixed;
  margin-bottom: 0px;
  padding-left: 0px;
}

#producerFieldId {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  border: solid;
  padding-left: 6px;
  font-size: 0.9rem;
  font-weight: bold;
  background-color: rgb(42, 42, 216);
  color: rgb(250, 250, 250);
  border-color: rgb(42, 42, 216);
}
</style>