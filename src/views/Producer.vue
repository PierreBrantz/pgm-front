<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <b-container>
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
          <b-form-select
            v-model="selectedProduct"
            :options="productList"
            class="m-2"
          ></b-form-select>
        </b-col>

        <b-col cols="2">
        
          <b-button
            variant="outline-primary"
            @click="addProductClick"
            class="m-2"
            >Associer Produit</b-button
          >
            
      
        </b-col>
        <b-col cols="3"> </b-col>
      </b-row>
    </b-container>
    <div style="flex: 1 1 auto">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        id="myGrid"
        :gridOptions="gridOptions"
        :rowData="rowData"
        :columnDefs="columnDefs"
        :modules="modules"
      ></ag-grid-vue>
    </div>
    <modal-addproducer></modal-addproducer>
    <modal-addproduct :producerId="producerId"></modal-addproduct>
  </div>
</template>

<script>
import { AgGridVue } from "@ag-grid-community/vue";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import axios from "axios";
import AddProducerModal from "../components/AddProducerModal.vue";
import AddProductModal from "../components/AddProductModal.vue";


const TOTAL_COLOR = "#ccffb3";

export default {
  data() {
    return {
      selectedProducer: null,
      selectedProduct: null,
      producers: [{ value: null, text: "Choisir un producteur..." }],
      productList: [{ value: null, text: "Choisir un produit..." }],
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      rowData: null,
      columnDefs: null,
      modules: AllCommunityModules,
      producerId: null,
    };
  },
  components: {
    AgGridVue,
    "modal-addproducer": AddProducerModal,
    "modal-addproduct": AddProductModal,

  },
  mounted() {
    this.fetchProducers();
    this.fetchProductList();
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {

    printDoc() {
	console.log("Exporting to PDF...");
	const docDefinition = getDocDefinition(
    	printParams, 
        gridOptions.api, 
        gridOptions.columnApi
	);
	pdfMake.createPdf(docDefinition).download();
},
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
    onGridReady(params) {
      params.api.sizeColumnsToFit();
      window.addEventListener("resize", function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit();
        });
      });

      params.api.sizeColumnsToFit();
    },
    async changeProducer(arg) {
      const json = await axios
        .get("/products/producer/" + arg)
        .then((response) => (this.requests = response.data))
        .then((rowData) => (this.rowData = rowData));
      this.producerId = arg;
    },

    addProducerClick() {
      this.$root.$emit("bv::show::modal", "modal-addproducer", "#btnShow");
    },

    async addProductClick() {
      if (this.selectedProducer == null) {
        this.$bvToast.toast("Veuillez choisir un producteur...", {
          title: "Info",
          variant: "danger",
          solid: true,
        });
      } else if (this.selectedProduct == null) {
        this.$bvToast.toast("Veuillez choisir un produit...", {
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
        await axios
          .get("/products/producer/" + this.selectedProducer)
          .then((response) => (this.products = response.data))
          .then((rowData) => (this.rowData = rowData));
      }
    },
  },

  beforeMount() {
    this.gridOptions = {
      onCellValueChanged: function (event) {
        axios
          .put(
            "/products/" + event.data.id + "/producer/" + event.data.producerId,
            JSON.stringify({
              id: event.data.id,
              name: event.data.name,
              packaging: event.data.packaging,
              realQuantities: event.data.realQuantities,
              price: event.data.price,
            })
          )
          .then((response) => (this.requests = response.data));
      },
    };
    this.columnDefs = [
      {
        headerName: "Légumes",
        field: "name",
        width: 200,
        sortable: true,
        pinned: "left",
      },
      {
        headerName: "Condit#",
        field: "name",
        width: 100,
        pinned: "left",
        valueGetter: function (params) {
          if (params.data.packaging.name != null) {
            return params.data.packaging.name;
          }
        },
      },
      {
        headerName: "Prix",
        field: "price",
        valueGetter: function (params) {
          if (params.data.price != null) {
            return params.data.price + "€";
          }
        },
        width: 100,
        pinned: "left",
      },
      {
        field: "quantity1",
        headerName: "Mai",
        editable: true,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            return params.data.realQuantities[0].quantity1;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (valueChanged) {
            if (typeof params.data.realQuantities[0] === "undefined") {
              params.data.realQuantities[0] = {
                id: params.data.id,
                quantity1: newValInt,
              };
            } else {
              params.data.realQuantities[0].quantity1 = newValInt;
            }
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity2",
        headerName: "Jui",
        editable: true,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            return params.data.realQuantities[0].quantity2;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (valueChanged) {
            if (typeof params.data.realQuantities[0] === "undefined") {
              params.data.realQuantities[0] = {
                id: params.data.id,
                quantity2: newValInt,
              };
            } else {
              params.data.realQuantities[0].quantity2 = newValInt;
            }
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity3",
        headerName: "Jul",
        editable: true,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            return params.data.realQuantities[0].quantity3;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.realQuantities[0] === "undefined") {
            params.data.realQuantities[0] = {
              id: params.data.id,
              quantity3: newValInt,
            };
          } else {
            params.data.realQuantities[0].quantity3 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity4",
        headerName: "Aou",
        editable: true,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            return params.data.realQuantities[0].quantity4;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.realQuantities[0] === "undefined") {
            params.data.realQuantities[0] = {
              id: params.data.id,
              quantity4: newValInt,
            };
          } else {
            params.data.realQuantities[0].quantity4 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity5",
        headerName: "Sep",
        editable: true,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            return params.data.realQuantities[0].quantity5;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.realQuantities[0] === "undefined") {
            params.data.realQuantities[0] = {
              id: params.data.id,
              quantity5: newValInt,
            };
          } else {
            params.data.realQuantities[0].quantity5 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity6",
        headerName: "Oct",
        editable: true,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            return params.data.realQuantities[0].quantity6;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.realQuantities[0] === "undefined") {
            params.data.realQuantities[0] = {
              id: params.data.id,
              quantity6: newValInt,
            };
          } else {
            params.data.realQuantities[0].quantity6 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity7",
        headerName: "Nov",
        editable: true,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            return params.data.realQuantities[0].quantity7;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.realQuantities[0] === "undefined") {
            params.data.realQuantities[0] = {
              id: params.data.id,
              quantity7: newValInt,
            };
          } else {
            params.data.realQuantities[0].quantity7 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity8",
        headerName: "Dec",
        editable: true,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            return params.data.realQuantities[0].quantity8;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.realQuantities[0] === "undefined") {
            params.data.realQuantities[0] = {
              id: params.data.id,
              quantity8: newValInt,
            };
          } else {
            params.data.realQuantities[0].quantity8 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity9",
        headerName: "Jan",
        editable: true,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            return params.data.realQuantities[0].quantity9;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.realQuantities[0] === "undefined") {
            params.data.realQuantities[0] = {
              id: params.data.id,
              quantity9: newValInt,
            };
          } else {
            params.data.realQuantities[0].quantity9 = newValInt;
            axios
              .get("/products/producer/0")
              .then((response) => (this.products = response.data))
              .then((rowData) => (this.rowData = rowData));
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity10",
        headerName: "Fev",
        editable: true,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            return params.data.realQuantities[0].quantity10;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          axios
            .get("/products/producer/0")
            .then((response) => (this.products = response.data))
            .then((rowData) => (this.rowData = rowData));
          if (typeof params.data.realQuantities[0] === "undefined") {
            params.data.realQuantities[0] = {
              id: params.data.id,
              quantity10: newValInt,
            };
          } else {
            params.data.realQuantities[0].quantity10 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        headerName: "Réel",
        width: 70,
        cellStyle: { "background-color": TOTAL_COLOR },
        valueGetter: function (params) {
          var sum = 0;
          for (let i = 0; i < params.data.realQuantities.length; i++) {
            sum +=
              params.data.realQuantities[i].quantity1 +
              params.data.realQuantities[i].quantity2 +
              params.data.realQuantities[i].quantity3 +
              params.data.realQuantities[i].quantity4 +
              params.data.realQuantities[i].quantity5 +
              params.data.realQuantities[i].quantity6 +
              params.data.realQuantities[i].quantity7 +
              params.data.realQuantities[i].quantity8 +
              params.data.realQuantities[i].quantity9 +
              params.data.realQuantities[i].quantity10;
          }
          return sum;
        },
      },

      {
        headerName: "Réel",
        width: 70,
        cellStyle: { "background-color": TOTAL_COLOR },
        valueGetter: function (params) {
          var sum = 0;
          for (let i = 0; i < params.data.realQuantities.length; i++) {
            sum +=
              params.data.realQuantities[i].quantity1 * params.data.price +
              params.data.realQuantities[i].quantity2 * params.data.price +
              params.data.realQuantities[i].quantity3 * params.data.price +
              params.data.realQuantities[i].quantity4 * params.data.price +
              params.data.realQuantities[i].quantity5 * params.data.price +
              params.data.realQuantities[i].quantity6 * params.data.price +
              params.data.realQuantities[i].quantity7 * params.data.price +
              params.data.realQuantities[i].quantity8 * params.data.price +
              params.data.realQuantities[i].quantity9 * params.data.price +
              params.data.realQuantities[i].quantity10 * params.data.price;
          }
          return sum + "€";
        },
      },
    ];
    axios
      .get("/products/producer/0")
      .then((response) => (this.products = response.data))
      .then((rowData) => (this.rowData = rowData));
  },
};
window.numberParser = function numberParser(params) {
  return Number(params.newValue);
};
</script>

<style>
</style>