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

const THEORETICAL_QUANTITY_COLOR = "#15b3d629";
const TOTAL_THEO_COLOR = "#d9ffc6b8";
const TOTAL_REAL_COLOR = "#ffe09bb8";

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
          if (params.data.price != null && params.data.currentSeason != null) {
            return params.data.price * params.data.currentSeason.percent + "€";
          }
        },
        width: 80,
        pinned: "left",
      },
      {
        headerName: "Saison (%)",
        resizable: true,
        valueGetter: function (params) {
          if (params.data.currentSeason != null) {
            return params.data.currentSeason.name + ' (' + params.data.currentSeason.percent + ')' ;
          }
        },
        width: 100,
        pinned: "left",
      },
      {
        headerName: "Mai",
        children:[{
        headerName: "Théo.",
        editable: true,
        valueParser: numberParser,
        resizable: true,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity5;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (valueChanged) {
            if (typeof params.data.quantities[0] === "undefined") {
              params.data.quantities[0] = {
                id: params.data.id,
                quantity5: newValInt,
              };
            } else {
              params.data.quantities[0].quantity5 = newValInt;
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
              sum += params.data.realQuantities[i].quantity5;
            }
            return sum;
          }
        },
        width: 70,
      }]},
      {
        headerName: "Juin",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable: true,
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
          if (valueChanged) {
            if (typeof params.data.quantities[0] === "undefined") {
              params.data.quantities[0] = {
                id: params.data.id,
                quantity6: newValInt,
              };
            } else {
              params.data.quantities[0].quantity6 = newValInt;
            }
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        
        headerName: "Réel",
        editable: false,
        valueParser: numberParser,
        resizable: true,
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
      }]},
      {
        headerName: "Juillet",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable: true,
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
        
        headerName: "Réel",
        editable: false,
        resizable: true,
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
      }]},
      {
        headerName: "Août",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable: true,
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
        headerName: "Réel",
        editable: false,
        resizable: true,
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
      }]},
      {
        headerName: "Septembre",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable: true,
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
        headerName: "Réel",
        editable: false,
        resizable: true,
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
      }]},
      {
        headerName: "Octobre",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable:true,
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
        headerName: "Réel",
        editable: false,
        resizable: true,
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
      }]},
      {
        headerName: "Novembre",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable: true,
        valueParser: numberParser,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity11;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.quantities[0] === "undefined") {
            params.data.quantities[0] = {
              id: params.data.id,
              quantity11: newValInt,
            };
          } else {
            params.data.quantities[0].quantity11 = newValInt;
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
              sum += params.data.realQuantities[i].quantity11;
            }
            return sum;
          }
        },

        width: 70,
      }]},
      {
        headerName: "Décembre",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable: true,
        valueParser: numberParser,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity12;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.quantities[0] === "undefined") {
            params.data.quantities[0] = {
              id: params.data.id,
              quantity12: newValInt,
            };
          } else {
            params.data.quantities[0].quantity12 = newValInt;
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
              sum += params.data.realQuantities[i].quantity12;
            }
            return sum;
          }
        },

        width: 70,
      }]},
      {
        headerName: "Janvier",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable: true,
        valueParser: numberParser,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0] != null) {
            return params.data.quantities[0].quantity1;
          }
        },
        valueSetter: function (params) {
          var newValInt = parseInt(params.newValue);
          var valueChanged = params.data.b !== newValInt;
          if (typeof params.data.quantities[0] === "undefined") {
            params.data.quantities[0] = {
              id: params.data.id,
              quantity1: newValInt,
            };
          } else {
            params.data.quantities[0].quantity1 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        
        headerName: "Réel",
        editable: false,
        resizable:true,
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
      {headerName: "Février",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable: true,
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
          if (typeof params.data.quantities[0] === "undefined") {
            params.data.quantities[0] = {
              id: params.data.id,
              quantity2: newValInt,
            };
          } else {
            params.data.quantities[0].quantity2 = newValInt;
          }
          return valueChanged;
        },
        width: 70,
      },
      {
        headerName: "Réel",
        editable: false,
        resizable:true,
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
      }]},
      {
        
        headerName: "Qte. Totale",
        marryChildren:true,
        children:[{
            headerName: 'Théo.',
        width: 70,
        resizable: true,
        cellStyle: { "background-color": TOTAL_THEO_COLOR },
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
            return sum ;
        }
      },
      {
        headerName: "Réel",
        width: 70,
        resizable: true,
        cellStyle: { "background-color": TOTAL_REAL_COLOR },
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
         
            return sum ;
        },
      }]},

      {
        headerName: "Prix Total",
         marryChildren:true,
        children:[{
        headerName: "Théo.",
        resizable: true,
        width: 70,
        cellStyle: { "background-color": TOTAL_THEO_COLOR },
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
          if(params.data.currentSeason != null)
            return sum * params.data.currentSeason.percent + '€';
        }
      },
      {
    
        headerName: "Réel",
        width: 70,
        resizable: true,
        cellStyle: { "background-color": TOTAL_REAL_COLOR },
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
          if(params.data.currentSeason != null)
            return sum * params.data.currentSeason.percent + '€';
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
 
<style >
.ag-header-group-cell-label, .ag-header-cell-label {
    display: block;
    flex: 1 1 auto;
    overflow: hidden;
    align-items: center;
    text-overflow: ellipsis;
    align-self: stretch;
    text-align: center;
}

.ag-theme-alpine .ag-cell, .ag-theme-alpine .ag-full-width-row .ag-cell-wrapper.ag-row-group {
    border: 1px solid transparent;
    line-height: 40px;
    padding-left: 3px;
    padding-right: 0px;
    -webkit-font-smoothing: subpixel-antialiased;
    text-align: center;
}
</style>
