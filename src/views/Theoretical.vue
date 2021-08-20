<template >
  <div style="display: flex; flex-direction: column; height: 100%">
    <div style="flex: 1 1 auto">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        id="myGrid"
        :gridOptions="gridOptions"
        :rowData="rowData"
        :columnDefs="columnDefs"
        :modules="modules"
        :headerHeight="headerHeight"
      ></ag-grid-vue>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "@ag-grid-community/vue";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import axios from "axios";

const THEORETICAL_QUANTITY_COLOR = "#ffe0cc";
const TOTAL_COLOR = "#ccffb3";

export default {
  data() {
    return {
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      rowData: null,
      columnDefs: null,
      modules: AllCommunityModules,
      headerHeight: null,
    };
  },

  components: {
    AgGridVue,
  },
  methods: {
    onGridReady(params) {
      params.api.sizeColumnsToFit();
      window.addEventListener("resize", function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit();
        });
      });

      params.api.sizeColumnsToFit();
    },
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  beforeMount() {
    this.headerHeight = 20;
    this.gridOptions = {
      onCellValueChanged: function (event) {
        axios
          .put(
            "/products/" + event.data.id,
            JSON.stringify({
              price: event.data.price,
              id: event.data.id,
              name: event.data.name,
              packaging: event.data.packaging,
              quantities: event.data.quantities,
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
        resizable: true
      },
      {
        headerName: "Condit#",
        width: 100,
        pinned: "left",
        resizable: true,

        valueGetter: function (params) {
          if (params.data.packaging.name != null) {
            return params.data.packaging.name;
          }
        },
      },
      {
        headerName: "Prix",
        resizable: true,
        valueGetter: function (params) {
          if (params.data.price != null) {
            return params.data.price + "€";
          }
        },
        width: 80,
        pinned: "left",
      },
      {
        headerName: "Mai",
        children:[{
        headerName: "Th.",
        editable: true,
        valueParser: numberParser,
        resizable: true,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity1;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (valueChanged) {
            if (typeof params.data.quantities[0] === "undefined") {
              params.data.quantities[0] = {
                id: params.data.id,
                quantity1: newValInt,
              };
            } else {
              params.data.quantities[0].quantity1 = newValInt;
            }
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        headerName: "Réel",
        editable: false,
        resizable: true,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            var sum = 0;
            for (let i = 0; i < params.data.realQuantities.length; i++) {
              sum += params.data.realQuantities[i].quantity1;
            }
            return sum;
          }
        },
        width: 70,
      }]},
      {
        field: "quantity2",
        headerName: "Jui",
        editable: true,
        valueParser: numberParser,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity2;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (valueChanged) {
            if (typeof params.data.quantities[0] === "undefined") {
              params.data.quantities[0] = {
                id: params.data.id,
                quantity2: newValInt,
              };
            } else {
              params.data.quantities[0].quantity2 = newValInt;
            }
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity2",
        headerName: "Jui",
        editable: false,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            var sum = 0;
            for (let i = 0; i < params.data.realQuantities.length; i++) {
              sum += params.data.realQuantities[i].quantity2;
            }
            return sum;
          }
        },

        width: 70,
      },
      {
        field: "quantity3",
        headerName: "Jul",
        editable: true,
        valueParser: numberParser,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity3;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.quantities[0] === "undefined") {
            params.data.quantities[0] = {
              id: params.data.id,
              quantity3: newValInt,
            };
          } else {
            params.data.quantities[0].quantity3 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity3",
        headerName: "Jul",
        editable: false,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            var sum = 0;
            for (let i = 0; i < params.data.realQuantities.length; i++) {
              sum += params.data.realQuantities[i].quantity3;
            }
            return sum;
          }
        },

        width: 70,
      },
      {
        field: "quantity4",
        headerName: "Aou",
        editable: true,
        valueParser: numberParser,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity4;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.quantities[0] === "undefined") {
            params.data.quantities[0] = {
              id: params.data.id,
              quantity4: newValInt,
            };
          } else {
            params.data.quantities[0].quantity4 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity4",
        headerName: "Aou",
        editable: false,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            var sum = 0;
            for (let i = 0; i < params.data.realQuantities.length; i++) {
              sum += params.data.realQuantities[i].quantity4;
            }
            return sum;
          }
        },

        width: 70,
      },
      {
        field: "quantity5",
        headerName: "Sep",
        editable: true,
        valueParser: numberParser,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity5;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.quantities[0] === "undefined") {
            params.data.quantities[0] = {
              id: params.data.id,
              quantity5: newValInt,
            };
          } else {
            params.data.quantities[0].quantity5 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity5",
        headerName: "Sep",
        editable: false,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            var sum = 0;
            for (let i = 0; i < params.data.realQuantities.length; i++) {
              sum += params.data.realQuantities[i].quantity5;
            }
            return sum;
          }
        },

        width: 70,
      },
      {
        field: "quantity6",
        headerName: "Oct",
        editable: true,
        valueParser: numberParser,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity6;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.quantities[0] === "undefined") {
            params.data.quantities[0] = {
              id: params.data.id,
              quantity6: newValInt,
            };
          } else {
            params.data.quantities[0].quantity6 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity6",
        headerName: "Oct",
        editable: false,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            var sum = 0;
            for (let i = 0; i < params.data.realQuantities.length; i++) {
              sum += params.data.realQuantities[i].quantity6;
            }
            return sum;
          }
        },

        width: 70,
      },
      {
        field: "quantity7",
        headerName: "Nov",
        editable: true,
        valueParser: numberParser,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity7;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.quantities[0] === "undefined") {
            params.data.quantities[0] = {
              id: params.data.id,
              quantity7: newValInt,
            };
          } else {
            params.data.quantities[0].quantity7 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity7",
        headerName: "Nov",
        editable: false,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            var sum = 0;
            for (let i = 0; i < params.data.realQuantities.length; i++) {
              sum += params.data.realQuantities[i].quantity7;
            }
            return sum;
          }
        },

        width: 70,
      },
      {
        field: "quantity8",
        headerName: "Dec",
        editable: true,
        valueParser: numberParser,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity8;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.quantities[0] === "undefined") {
            params.data.quantities[0] = {
              id: params.data.id,
              quantity8: newValInt,
            };
          } else {
            params.data.quantities[0].quantity8 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity8",
        headerName: "Dec",
        editable: false,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            var sum = 0;
            for (let i = 0; i < params.data.realQuantities.length; i++) {
              sum += params.data.realQuantities[i].quantity8;
            }
            return sum;
          }
        },

        width: 70,
      },
      {
        field: "quantity9",
        headerName: "Jan",
        editable: true,
        valueParser: numberParser,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity9;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.quantities[0] === "undefined") {
            params.data.quantities[0] = {
              id: params.data.id,
              quantity9: newValInt,
            };
          } else {
            params.data.quantities[0].quantity9 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        field: "quantity9",
        headerName: "Jan",
        editable: false,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            var sum = 0;
            for (let i = 0; i < params.data.realQuantities.length; i++) {
              sum += params.data.realQuantities[i].quantity9;
            }
            return sum;
          }
        },

        width: 70,
      },
      {
        headerName: "Fev",
        editable: true,
        valueParser: numberParser,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity10;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.quantities[0] === "undefined") {
            params.data.quantities[0] = {
              id: params.data.id,
              quantity10: newValInt,
            };
          } else {
            params.data.quantities[0].quantity10 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        headerName: "Fev",
        editable: false,
        valueParser: numberParser,
        valueGetter: function (params) {
          if (params.data.realQuantities[0] != null) {
            var sum = 0;
            for (let i = 0; i < params.data.realQuantities.length; i++) {
              sum += params.data.realQuantities[i].quantity10;
            }
            return sum;
          }
        },

        width: 70,
      },
      {
        
        headerName: "Théo",
        marryChildren:true,
        children:[{
            headerName: 'test',
        width: 70,
        cellStyle: { "background-color": TOTAL_COLOR },
         valueGetter: function (params) {
          var sum = 0;
          for (let i = 0; i < params.data.quantities.length; i++) {
            sum +=
              params.data.quantities[i].quantity1 +
              params.data.quantities[i].quantity2 +
              params.data.quantities[i].quantity3 +
              params.data.quantities[i].quantity4 +
              params.data.quantities[i].quantity5 +
              params.data.quantities[i].quantity6 +
              params.data.quantities[i].quantity7 +
              params.data.quantities[i].quantity8 +
              params.data.quantities[i].quantity9 +
              params.data.quantities[i].quantity10;
          }
          return sum;
        }
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
      }]},

      {
        headerName: "Théo",
         marryChildren:true,
        children:[{
        headerName: "Théo",
        width: 70,
        cellStyle: { "background-color": TOTAL_COLOR },
        valueGetter: function (params) {
          var sum = 0;
          for (let i = 0; i < params.data.quantities.length; i++) {
            sum +=
              params.data.quantities[i].quantity1 * params.data.price +
              params.data.quantities[i].quantity2 * params.data.price +
              params.data.quantities[i].quantity3 * params.data.price +
              params.data.quantities[i].quantity4 * params.data.price +
              params.data.quantities[i].quantity5 * params.data.price +
              params.data.quantities[i].quantity6 * params.data.price +
              params.data.quantities[i].quantity7 * params.data.price +
              params.data.quantities[i].quantity8 * params.data.price +
              params.data.quantities[i].quantity9 * params.data.price +
              params.data.quantities[i].quantity10 * params.data.price;
          }
          return sum + '€';
        }
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
          return sum + '€';
        }
      }]},
    ],
 
    axios
      .get("/products")
      .then((response) => (this.products = response.data))
      .then((rowData) => (this.rowData = rowData));
  },
};
window.numberParser = function numberParser(params) {
  return Number(params.newValue);
};
</script>
 
<style scoped>
</style>
