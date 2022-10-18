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
         @cell-clicked="onCellClicked"
      ></ag-grid-vue>

      <theorical-add-product-to-producer-modal
      v-if="currentProduct != null"
        :product="currentProduct"
        
      >
      </theorical-add-product-to-producer-modal>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "@ag-grid-community/vue";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import axios from "axios";
import TheoricalAddProductToProducerModal from "../components/TheoricalAddProductToProducerModal.vue";

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
      headerHeight: 20,
      products: [],
      currentProduct: null
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },


  components: {
    AgGridVue,
    "theorical-add-product-to-producer-modal": TheoricalAddProductToProducerModal,
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
    onCellClicked(arg) {   
      this.currentProduct = arg.data;  
      this.$root.$emit("bv::show::modal", "theorical-add-product-to-producer-modal", "#btnShow");
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
   // this.gridApi.sizeColumnsToFit();
  },
  beforeMount() {
     this.gridOptions = {
      onCellValueChanged: function (event) {
        const json =
          axios
        .post(
          "/products" ,
            [event.data]
        )
          
          .then((response) => (this.requests = response.data));
         
      },
    };
    this.columnDefs = [
      {
        headerName: "Légumes",
        field: "name",
        width: 150,
        sortable: true,
        pinned: "left",
        resizable: true
      },
      {
        headerName: "Condit#",
        width: 60,
        pinned: "left",
        resizable: true,

        valueGetter: function (params) {
          if (params.data.packaging && params.data.packaging.name) {
            return params.data.packaging.name;
          }
        },
      },
      {
        headerName: "Prix",
        resizable: true,
        valueGetter: function (params) {
          if (params.data.price) {
            return params.data.price + "€";
          }
        },
        width: 60,
        pinned: "left",
      },
    
  {
        headerName: "Janvier",
        children:[{
        headerName: "Théo.",
        editable: true,
        valueParser: numberParser,
        resizable: true,
        cellStyle: { "background-color": THEORETICAL_QUANTITY_COLOR },
        valueGetter: function (params) {
          if (params.data.quantities[0]) {
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
        width: 60,
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
        width: 60,
      }]},
      {
        headerName: "Février",
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
        width: 60,
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
              sum += params.data.realQuantities[i].quantity2;
            }
            return sum;
          }
        },

        width: 60,
      }]},
      {
        headerName: "Mars",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable: true,
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
        width: 60,
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
              sum += params.data.realQuantities[i].quantity3;
            }
            return sum;
          }
        },

        width: 60,
      }]},
      {
        headerName: "Avril",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable: true,
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
        width: 60,
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
              sum += params.data.realQuantities[i].quantity4;
            }
            return sum;
          }
        },

        width: 60,
      }]},
      {
        headerName: "Mai",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable: true,
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
        width: 60,
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

        width: 60,
      }]},
      {
        headerName: "Juin",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable:true,
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
        width: 60,
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
              sum += params.data.realQuantities[i].quantity6;
            }
            return sum;
          }
        },

        width: 60,
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
        width: 60,
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

        width: 60,
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
        width: 60,
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

        width: 60,
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
        width: 60,
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
              sum += params.data.realQuantities[i].quantity9;
            }
            return sum;
          }
        },

        width: 60,
      }]},
      {headerName: "Octobre",
        children:[{
        headerName: "Théo.",
        editable: true,
        resizable: true,
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
        width: 60,
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
              sum += params.data.realQuantities[i].quantity10;
            }
            return sum;
          }
        },

        width: 60,
      }]},
      ,
      {headerName: "Novembre",
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
        width: 60,
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
              sum += params.data.realQuantities[i].quantity11;
            }
            return sum;
          }
        },

        width: 60,
      }]},
      ,
      {headerName: "Décembre",
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
        width: 60,
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
              sum += params.data.realQuantities[i].quantity12;
            }
            return sum;
          }
        },

        width: 60,
      }]},
      {
        
        headerName: "Qte. Totale",
        marryChildren:true,
        children:[{
            headerName: 'Théo.',
        width: 70,
        pinned: "right",
        resizable: true,
        cellStyle: { "background-color": TOTAL_THEO_COLOR },
         valueGetter: function (params) {
          var sum = 0;
          for (let i = 0; i < params.data.quantities.length; i++) {
            sum +=
              (params.data.quantities[i].quantity1 || 0) +
              (params.data.quantities[i].quantity2 || 0) +
              (params.data.quantities[i].quantity3  || 0) +
              (params.data.quantities[i].quantity4  || 0) +
              (params.data.quantities[i].quantity5 | 0) +
              (params.data.quantities[i].quantity6 || 0) +
              (params.data.quantities[i].quantity7 || 0) +
              (params.data.quantities[i].quantity8 || 0) +
              (params.data.quantities[i].quantity9 || 0) +
              (params.data.quantities[i].quantity10 || 0) +
              (params.data.quantities[i].quantity11  || 0) +
              (params.data.quantities[i].quantity12  || 0);
              
          }          
            return sum ;
        }
      },
      {
        headerName: "Réel",
        width: 70,
        pinned: "right",
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
              params.data.realQuantities[i].quantity10 +
              params.data.realQuantities[i].quantity11 +
              params.data.realQuantities[i].quantity12;
          }
         
            return sum ;
        },
      }]},

      {
        headerName: "Prix Total",
         marryChildren:true,
        children:[{
        headerName: "Théo.",
        pinned: "right",
        resizable: true,
        width: 70,
        cellStyle: { "background-color": TOTAL_THEO_COLOR },
        valueGetter: function (params) {
          var sum = 0;
          for (let i = 0; i < params.data.quantities.length; i++) {
            sum +=
              (params.data.quantities[i].quantity1 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.january-1].percent || 0) +
              (params.data.quantities[i].quantity2 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.february-1].percent || 0) +
              (params.data.quantities[i].quantity3 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.march-1].percent || 0) +
              (params.data.quantities[i].quantity4 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.april-1].percent || 0) +
              (params.data.quantities[i].quantity5 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.may-1].percent || 0) +
              (params.data.quantities[i].quantity6 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.june-1].percent || 0) +
              (params.data.quantities[i].quantity7 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.july-1].percent || 0) +
              (params.data.quantities[i].quantity8 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.august-1].percent || 0) +
              (params.data.quantities[i].quantity9 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.september-1].percent || 0) +
              (params.data.quantities[i].quantity10 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.october-1].percent || 0) +
              (params.data.quantities[i].quantity11 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.november-1].percent || 0) +
              (params.data.quantities[i].quantity12 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.december-1].percent || 0);
          }
          
            return sum.toFixed(2)  + '€';
        }
      },
      {
    
        headerName: "Réel",
        width: 70,
        pinned: "right",
        resizable: true,
        cellStyle: { "background-color": TOTAL_REAL_COLOR },
        valueGetter: function (params) {
          var sum = 0;
          for (let i = 0; i < params.data.realQuantities.length; i++) {
            sum +=
              
               (params.data.realQuantities[i].quantity1 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.january - 1].percent || 0) +
              (params.data.realQuantities[i].quantity2 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.february - 1].percent || 0) +
              (params.data.realQuantities[i].quantity3 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.march - 1].percent || 0) +
              (params.data.realQuantities[i].quantity4 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.april - 1].percent || 0) +
              (params.data.realQuantities[i].quantity5 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.may - 1 ].percent || 0) +
              (params.data.realQuantities[i].quantity6 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.june - 1].percent || 0) +
              (params.data.realQuantities[i].quantity7 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.july - 1].percent || 0) +
              (params.data.realQuantities[i].quantity8 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.august - 1].percent || 0) +
              (params.data.realQuantities[i].quantity9 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.september - 1].percent || 0) +
              (params.data.realQuantities[i].quantity10 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.october - 1].percent || 0) +
              (params.data.realQuantities[i].quantity11 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.november - 1].percent || 0) +
              (params.data.realQuantities[i].quantity12 * params.data.price * params.data.seasonalities[params.data.seasonalityProduct.december - 1].percent || 0);
          }
          
            return sum.toFixed(2)  + '€';
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
.ag-theme-alpine .ag-header-cell,
.ag-theme-alpine .ag-header-group-cell {
  margin-left: 5px;
  padding-left: 5px;
  padding-right: 3px;
}

.ag-theme-alpine .ag-cell,
.ag-theme-alpine .ag-full-width-row .ag-cell-wrapper.ag-row-group {
  margin-left: 0px;
  padding-left: 5px;
  padding-right: 3px;
}

</style>
