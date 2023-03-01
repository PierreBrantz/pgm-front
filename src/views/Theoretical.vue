<template >
  <div style="display: flex; flex-direction: column; height: 100%" >
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
         @cell-double-clicked="onCellDoubleClicked"
      ></ag-grid-vue>

      <theorical-add-product-to-producer-modal
        @updated="handleUpdate"
        v-if="currentProduct != null"
        :product="currentProduct"
        :products="products"
        :season="currentSeason"
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
import { DeliveryMethods } from '../services/constant.js';

const TOTAL_THEO_COLOR = "#eeeeee";
const TOTAL_REAL_COLOR = "#d6d6d6";

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
      currentProduct: 0,
      currentProducers: [],
      currentSeason: "",
      
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  components: {
    AgGridVue,
    "theorical-add-product-to-producer-modal":
      TheoricalAddProductToProducerModal,
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

    async handleUpdate(products) {
       await axios.post("/products", products);
       var params = {
          force: true,
          suppressFlash: true,
          rowNodes: this.rowNodes
        };
      this.gridApi.refreshCells(params);
    },
    onCellDoubleClicked(arg) {
      if (arg.column.colId == "realJanuary" || 
      arg.column.colId == "realFebruary" ||
      arg.column.colId == "realMarch" ||
      arg.column.colId == "realApril" ||
      arg.column.colId == "realMay" ||
      arg.column.colId == "realJune" ||
      arg.column.colId == "realJuly" ||
      arg.column.colId == "realAugust" ||
      arg.column.colId == "realSeptember" ||
      arg.column.colId == "realOctober" ||
      arg.column.colId == "realNovember" ||
      arg.column.colId == "realDecember")
       {
        this.currentProduct = arg.data;
        this.currentSeason = arg.column.colId;
        this.$root.$emit(
          "bv::show::modal",
          "theorical-add-product-to-producer-modal",
          "#btnShow"
        );
      }
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    // this.gridApi.sizeColumnsToFit();
  },
  beforeMount() {
    this.gridOptions = {
      onCellValueChanged: function (event) {
        axios
          .post("/products", [event.data])

          .then((response) => (this.requests = response.data));
      },
    };
    (this.columnDefs = [
      {
        headerName: "Légumes",
        field: "name",
        width: 180,
        sortable: true,
        pinned: "left",
        resizable: true,
        suppressNavigable: true,
        valueGetter: function (params) {
          if (params.data.calibration) {
            return (params.data.productFamily != null ? params.data.productFamily.name : params.data.name) + " (" + params.data.calibration + ")";
          }
          else{
            return (params.data.productFamily != null ? params.data.productFamily.name : params.data.name);
          }
        },
      },
       {
        headerName: "Label",
        field: "productLabel",
        width: 80,
        sortable: true,
        pinned: "left",
        resizable: true,
        filter: 'agTextColumnFilter',
        suppressNavigable: true,
        valueGetter: function (params) {
          if (params.data.productLabel && params.data.productLabel.name) {
            return params.data.productLabel.name;
          }
        },
      },
       {
        headerName: "Origine",
        field: "productOrigin",
        width: 60,
        sortable: true,
        pinned: "left",
        resizable: true,
        filter: 'agTextColumnFilter',
        suppressNavigable: true,
        valueGetter: function (params) {
          if (params.data.productOrigin && params.data.productOrigin.name) {
            return params.data.productOrigin.name;
          }
        },
      },
      {
        headerName: "Condit#",
        width: 60,
        pinned: "left",
        resizable: true,
        suppressNavigable: true,
        valueGetter: function (params) {
          
         if(params.data.productUnit != null){  
          if(params.data.compactDisplay){
              return (params.data.nbByPackaging * params.data.quantity) + params.data.productUnit.name;
          }
          else{
            return params.data.nbByPackaging + "*" + params.data.quantity + params.data.productUnit.name;
          }
         }
          
        },
      },
      {
        headerName: "Prix",
        resizable: true,
        suppressNavigable: true,
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
        children: [
          {
            headerName: "Théo.",
            editable: true,
            valueParser: numberParser,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.january == 1,
            
            cellStyle: cellStyleJan,
            valueGetter: function (params) {
              if (params.data.quantities[0]) {
                return params.data.quantities[0].quantity1;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (valueChanged) {
                if (params.data.quantities[0] == null) {
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
            headerName: "Prop",
            field: "realJanuary",
            editable: false,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.january == 1,
            valueFormatter : numberCellFormatter,
            valueParser: numberParser,
            cellStyle: cellStyleJan,
            valueGetter: function (params) {
                if (params.data.realQuantities != null) {
                var sum = 0;
                for (let i = 0; i < params.data.realQuantities.length; i++) {
                  sum += Number(params.data.realQuantities[i].quantity1);
                }
                return sum;
              }
              else return 0;
            },
            width: 60,
          },
        ],
      },
      {
        headerName: "Février",
        children: [
          {
            headerName: "Théo.",
            editable: true,
            resizable: true,
            valueParser: numberParser,
            suppressNavigable:(params) => params.data.seasonalityProduct.february == 1,
            cellStyle: cellStyleFeb,
            valueGetter: function (params) {
              if (params.data.quantities[0] != null) {
                return params.data.quantities[0].quantity2;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (valueChanged) {
                if (params.data.quantities[0] == null) {
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
            headerName: "Prop",
            editable: false,
            field: "realFebruary",
            valueParser: numberParser,
            valueFormatter : numberCellFormatter,
            resizable: true,
            cellStyle: cellStyleFeb,
            suppressNavigable:(params) => params.data.seasonalityProduct.february == 1,
                valueGetter: function (params) {
                if (params.data.realQuantities != null) {
                var sum = 0;
                for (let i = 0; i < params.data.realQuantities.length; i++) {
                  sum += Number(params.data.realQuantities[i].quantity2);
                }
                return sum;
              }
              else return 0;
            },
            width: 60,
          },
        ],
      },
      {
        headerName: "Mars",
        children: [
          {
            headerName: "Théo.",
            editable: true,
            resizable: true,
            valueParser: numberParser,
            suppressNavigable:(params) => params.data.seasonalityProduct.march == 1,
            cellStyle: cellStyleMar,
            valueGetter: function (params) {
              if (params.data.quantities[0] != null) {
                return params.data.quantities[0].quantity3;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (params.data.quantities[0] == null) {
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
            headerName: "Prop",
            field: "realMarch",
            editable: false,
            resizable: true,
            valueParser: numberParser,
            valueFormatter : numberCellFormatter,
            cellStyle: cellStyleMar,
            suppressNavigable:(params) => params.data.seasonalityProduct.march == 1,
            valueGetter: function (params) {
                if (params.data.realQuantities != null) {
                var sum = 0;
                for (let i = 0; i < params.data.realQuantities.length; i++) {
                  sum += Number(params.data.realQuantities[i].quantity3);
                }
                return sum;
              }
              else return 0;
            },
            width: 60,
          },
        ],
      },
      {
        headerName: "Avril",
        children: [
          {
            headerName: "Théo.",
            editable: true,
            resizable: true,
            valueParser: numberParser,
            suppressNavigable:(params) => params.data.seasonalityProduct.april == 1,
           cellStyle: cellStyleApr,
            valueGetter: function (params) {
              if (params.data.quantities[0] != null) {
                return params.data.quantities[0].quantity4;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (params.data.quantities[0] == null) {
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
            headerName: "Prop",
            field: "realApril",
            editable: false,
            resizable: true,
            valueParser: numberParser,
            valueFormatter : numberCellFormatter,
            cellStyle: cellStyleApr,
            suppressNavigable:(params) => params.data.seasonalityProduct.april == 1,
                   valueGetter: function (params) {
                if (params.data.realQuantities != null) {
                var sum = 0;
                for (let i = 0; i < params.data.realQuantities.length; i++) {
                  sum += Number(params.data.realQuantities[i].quantity4);
                }
                return sum;
              }
              else return 0;
            },

            width: 60,
          },
        ],
      },
      {
        headerName: "Mai",
        children: [
          {
            headerName: "Théo.",
            editable: true,
            resizable: true,
            valueParser: numberParser,
            suppressNavigable:(params) => params.data.seasonalityProduct.may == 1,
            cellStyle: cellStyleMay,
            valueGetter: function (params) {
              if (params.data.quantities[0] != null) {
                return params.data.quantities[0].quantity5;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (params.data.quantities[0] == null) {
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
            headerName: "Prop",
            field: "realMay",
            editable: false,
            resizable: true,
            valueParser: numberParser,
            valueFormatter : numberCellFormatter,
            cellStyle: cellStyleMay,
            suppressNavigable:(params) => params.data.seasonalityProduct.may == 1,
                   valueGetter: function (params) {
                if (params.data.realQuantities != null) {
                var sum = 0;
                for (let i = 0; i < params.data.realQuantities.length; i++) {
                  sum += Number(params.data.realQuantities[i].quantity5);
                }
                return sum;
              }
              else return 0;
            },

            width: 60,
          },
        ],
      },
      {
        headerName: "Juin",
        children: [
          {
            headerName: "Théo.",
            editable: true,
            resizable: true,
            valueParser: numberParser,
            suppressNavigable:(params) => params.data.seasonalityProduct.june == 1,
            cellStyle: cellStyleJun,
            valueGetter: function (params) {
              if (params.data.quantities[0] != null) {
                return params.data.quantities[0].quantity6;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (params.data.quantities[0] == null) {
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
            headerName: "Prop",
            field: "realJune",
            editable: false,
            resizable: true,
            valueParser: numberParser,
            valueFormatter : numberCellFormatter,
            cellStyle: cellStyleJun,
            suppressNavigable:(params) => params.data.seasonalityProduct.june == 1,
                   valueGetter: function (params) {
                if (params.data.realQuantities != null) {
                var sum = 0;
                for (let i = 0; i < params.data.realQuantities.length; i++) {
                  sum += Number(params.data.realQuantities[i].quantity6);
                }
                return sum;
              }
              else return 0;
            },

            width: 60,
          },
        ],
      },
      {
        headerName: "Juillet",
        children: [
          {
            headerName: "Théo.",
            editable: true,
            resizable: true,
            valueParser: numberParser,
            suppressNavigable:(params) => params.data.seasonalityProduct.july == 1,
            cellStyle: cellStyleJul,
            valueGetter: function (params) {
              if (params.data.quantities[0] != null) {
                return params.data.quantities[0].quantity7;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (params.data.quantities[0] == null) {
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
            headerName: "Prop",
            field: "realJuly",
            editable: false,
            resizable: true,
            valueParser: numberParser,
            valueFormatter : numberCellFormatter,
            cellStyle: cellStyleJul,
            suppressNavigable:(params) => params.data.seasonalityProduct.july == 1,
               valueGetter: function (params) {
                if (params.data.realQuantities != null) {
                var sum = 0;
                for (let i = 0; i < params.data.realQuantities.length; i++) {
                  sum += Number(params.data.realQuantities[i].quantity7);
                }
                return sum;
              }
              else return 0;
            },

            width: 60,
          },
        ],
      },
      {
        headerName: "Août",
        children: [
          {
            headerName: "Théo.",
            editable: true,
            resizable: true,
            valueParser: numberParser,
            suppressNavigable:(params) => params.data.seasonalityProduct.august == 1,
            cellStyle: cellStyleAug,
            valueGetter: function (params) {
              if (params.data.quantities[0] != null) {
                return params.data.quantities[0].quantity8;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (params.data.quantities[0] == null) {
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
            headerName: "Prop",
            field: "realAugust",
            editable: false,
            resizable: true,
            valueParser: numberParser,
            valueFormatter : numberCellFormatter,
            cellStyle: cellStyleAug,
            suppressNavigable:(params) => params.data.seasonalityProduct.august == 1,
                   valueGetter: function (params) {
                if (params.data.realQuantities != null) {
                var sum = 0;
                for (let i = 0; i < params.data.realQuantities.length; i++) {
                  sum += Number(params.data.realQuantities[i].quantity8);
                }
                return sum;
              }
              else return 0;
            },
            width: 60,
          },
        ],
      },
      {
        headerName: "Septembre",
        children: [
          {
            headerName: "Théo.",
            editable: true,
            resizable: true,
            valueParser: numberParser,
            suppressNavigable:(params) => params.data.seasonalityProduct.september == 1,
            cellStyle: cellStyleSep,
            valueGetter: function (params) {
              if (params.data.quantities[0] != null) {
                return params.data.quantities[0].quantity9;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (params.data.quantities[0] == null) {
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
            headerName: "Prop",
            field: "realSeptember",
            editable: false,
            resizable: true,
            valueParser: numberParser,
            valueFormatter : numberCellFormatter,
            cellStyle: cellStyleSep,
            suppressNavigable:(params) => params.data.seasonalityProduct.september == 1,
                   valueGetter: function (params) {
                if (params.data.realQuantities != null) {
                var sum = 0;
                for (let i = 0; i < params.data.realQuantities.length; i++) {
                  sum += Number(params.data.realQuantities[i].quantity9);
                }
                return sum;
              }
              else return 0;
            },
            width: 60,
          },
        ],
      },
      {
        headerName: "Octobre",
        children: [
          {
            headerName: "Théo.",
            editable: true,
            resizable: true,
            valueParser: numberParser,
            suppressNavigable:(params) => params.data.seasonalityProduct.october == 1,
            cellStyle: cellStyleOct,
            valueGetter: function (params) {
              if (params.data.quantities[0] != null) {
                return params.data.quantities[0].quantity10;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (params.data.quantities[0] == null) {
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
            headerName: "Prop",
            field: "realOctober",
            editable: false,
            resizable: true,
            valueParser: numberParser,
            valueFormatter : numberCellFormatter,
            cellStyle: cellStyleOct,
            suppressNavigable:(params) => params.data.seasonalityProduct.october == 1,
                   valueGetter: function (params) {
                if (params.data.realQuantities != null) {
                var sum = 0;
                for (let i = 0; i < params.data.realQuantities.length; i++) {
                  sum += Number(params.data.realQuantities[i].quantity10);
                }
                return sum;
              }
              else return 0;
            },
            width: 60,
          },
        ],
      },
      ,
      {
        headerName: "Novembre",
        children: [
          {
            headerName: "Théo.",
            editable: true,
            resizable: true,
            valueParser: numberParser,
            suppressNavigable:(params) => params.data.seasonalityProduct.november == 1,
            cellStyle: cellStyleNov,
            valueGetter: function (params) {
              if (params.data.quantities[0] != null) {
                return params.data.quantities[0].quantity11;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (params.data.quantities[0] == null) {
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
            headerName: "Prop",
            field: "realNovember",
            editable: false,
            resizable: true,
            valueParser: numberParser,
            valueFormatter : numberCellFormatter,
            cellStyle: cellStyleNov,
            suppressNavigable:(params) => params.data.seasonalityProduct.november == 1,
                   valueGetter: function (params) {
                if (params.data.realQuantities != null) {
                var sum = 0;
                for (let i = 0; i < params.data.realQuantities.length; i++) {
                  sum += Number(params.data.realQuantities[i].quantity11);
                }
                return sum;
              }
              else return 0;
            },

            width: 60,
          },
        ],
      },
      ,
      {
        headerName: "Décembre",
        children: [
          {
            headerName: "Théo.",
            editable: true,
            resizable: true,
            valueParser: numberParser,
            suppressNavigable:(params) => params.data.seasonalityProduct.december == 1,
            cellStyle: cellStyleDec,
            valueGetter: function (params) {
              if (params.data.quantities[0] != null) {
                return params.data.quantities[0].quantity12;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (params.data.quantities[0] == null) {
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
            headerName: "Prop",
            field: "realDecember",
            valueFormatter : numberCellFormatter,
            editable: false,
            resizable: true,
            valueParser: numberParser,
            cellStyle: cellStyleDec,
            suppressNavigable:(params) => params.data.seasonalityProduct.december == 1,
                   valueGetter: function (params) {
                if (params.data.realQuantities != null) {
                var sum = 0;
                for (let i = 0; i < params.data.realQuantities.length; i++) {
                  sum += Number(params.data.realQuantities[i].quantity12);
                }
                return sum;
              }
              else return 0;
            },

            width: 60,
          },
        ],
      },
      {
        headerName: "Qte. Totale",
        marryChildren: true,
        children: [
          {
            headerName: "Théo.",
            width: 70,
            pinned: "right",
            resizable: true,
            cellStyle: { "background-color": TOTAL_THEO_COLOR },
            suppressNavigable: true,
            valueGetter: function (params) {
              var sum = 0;
              for (let i = 0; i < params.data.quantities.length; i++) {
                sum +=
                  (params.data.quantities[i].quantity1 || 0) +
                  (params.data.quantities[i].quantity2 || 0) +
                  (params.data.quantities[i].quantity3 || 0) +
                  (params.data.quantities[i].quantity4 || 0) +
                  (params.data.quantities[i].quantity5 | 0) +
                  (params.data.quantities[i].quantity6 || 0) +
                  (params.data.quantities[i].quantity7 || 0) +
                  (params.data.quantities[i].quantity8 || 0) +
                  (params.data.quantities[i].quantity9 || 0) +
                  (params.data.quantities[i].quantity10 || 0) +
                  (params.data.quantities[i].quantity11 || 0) +
                  (params.data.quantities[i].quantity12 || 0);
              }
              return sum;
            },
          },
          {
            headerName: "Prop",
            width: 70,
            pinned: "right",
            resizable: true,
            type: 'numericColumn',
            valueFormatter: numberCellFormatter,
            suppressNavigable: true,
            cellStyle: { "background-color": TOTAL_REAL_COLOR },
            valueGetter: function (params) {
              var sum = 0;
              for (let i = 0; i < params.data.realQuantities.length; i++) {
                sum +=
                  (params.data.realQuantities[i].quantity1 == null ? 0 : Number(params.data.realQuantities[i].quantity1)) +
                  (params.data.realQuantities[i].quantity2 == null ? 0 : Number(params.data.realQuantities[i].quantity2)) +
                  (params.data.realQuantities[i].quantity3 == null ? 0 : Number(params.data.realQuantities[i].quantity3)) +
                  (params.data.realQuantities[i].quantity4 == null ? 0 : Number(params.data.realQuantities[i].quantity4)) +
                  (params.data.realQuantities[i].quantity5 == null ? 0 : Number(params.data.realQuantities[i].quantity5)) +
                  (params.data.realQuantities[i].quantity6 == null ? 0 : Number(params.data.realQuantities[i].quantity6)) +
                  (params.data.realQuantities[i].quantity7 == null ? 0 : Number(params.data.realQuantities[i].quantity7)) +
                  (params.data.realQuantities[i].quantity8 == null ? 0 : Number(params.data.realQuantities[i].quantity8)) +
                  (params.data.realQuantities[i].quantity9 == null ? 0 : Number(params.data.realQuantities[i].quantity9)) +
                  (params.data.realQuantities[i].quantity10 == null ? 0 : Number(params.data.realQuantities[i].quantity10)) +
                  (params.data.realQuantities[i].quantity11 == null ? 0 : Number(params.data.realQuantities[i].quantity11)) +
                  (params.data.realQuantities[i].quantity12 == null ? 0 : Number(params.data.realQuantities[i].quantity12));
              }

              return sum;
            },
          },
        ],
      },

      {
        headerName: "Prix Total",
        marryChildren: true,
        children: [
          {
            headerName: "Théo.",
            pinned: "right",
            resizable: true,
            width: 70,
            cellStyle: { "background-color": TOTAL_THEO_COLOR },
            suppressNavigable: true,
            valueGetter: function (params) {
              var sum = 0;
              for (let i = 0; i < params.data.quantities.length; i++) {
                sum +=
                  (params.data.quantities[i].quantity1 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.january - 1
                    ].percent || 0) +
                  (params.data.quantities[i].quantity2 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.february - 1
                    ].percent || 0) +
                  (params.data.quantities[i].quantity3 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.march - 1
                    ].percent || 0) +
                  (params.data.quantities[i].quantity4 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.april - 1
                    ].percent || 0) +
                  (params.data.quantities[i].quantity5 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.may - 1
                    ].percent || 0) +
                  (params.data.quantities[i].quantity6 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.june - 1
                    ].percent || 0) +
                  (params.data.quantities[i].quantity7 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.july - 1
                    ].percent || 0) +
                  (params.data.quantities[i].quantity8 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.august - 1
                    ].percent || 0) +
                  (params.data.quantities[i].quantity9 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.september - 1
                    ].percent || 0) +
                  (params.data.quantities[i].quantity10 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.october - 1
                    ].percent || 0) +
                  (params.data.quantities[i].quantity11 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.november - 1
                    ].percent || 0) +
                  (params.data.quantities[i].quantity12 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.december - 1
                    ].percent || 0);
              }

              return sum.toFixed(2) + "€";
            },
          },
          {
            headerName: "Prop",
            width: 70,
            pinned: "right",
            resizable: true,
            suppressNavigable: true,
            cellStyle: { "background-color": TOTAL_REAL_COLOR },
            valueGetter: function (params) {
              var sum = 0;
              for (let i = 0; i < params.data.producers.length; i++) {
                sum +=
                  (params.data.producers[i].realQuantity.quantity1 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.january - 1
                    ].percent || 0) +
                  (params.data.producers[i].realQuantity.quantity2 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.february - 1
                    ].percent || 0) +
                  (params.data.producers[i].realQuantity.quantity3 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.march - 1
                    ].percent || 0) +
                  (params.data.producers[i].realQuantity.quantity4 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.april - 1
                    ].percent || 0) +
                  (params.data.producers[i].realQuantity.quantity5 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.may - 1
                    ].percent || 0) +
                  (params.data.producers[i].realQuantity.quantity6 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.june - 1
                    ].percent || 0) +
                  (params.data.producers[i].realQuantity.quantity7 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.july - 1
                    ].percent || 0) +
                  (params.data.producers[i].realQuantity.quantity8 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.august - 1
                    ].percent || 0) +
                  (params.data.producers[i].realQuantity.quantity9 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.september - 1
                    ].percent || 0) +
                  (params.data.producers[i].realQuantity.quantity10 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.october - 1
                    ].percent || 0) +
                  (params.data.producers[i].realQuantity.quantity11 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.november - 1
                    ].percent || 0) +
                  (params.data.producers[i].realQuantity.quantity12 *
                    params.data.price *
                    params.data.seasonalities[
                      params.data.seasonalityProduct.december - 1
                    ].percent || 0);
              }

              return sum.toFixed(2) + "€";
            },
          },
        ],
      },
    ]),
      axios
        .get("/products")
        .then((response) => (this.products = response.data))
        .then((rowData) => (this.rowData = rowData));
  },
};
window.numberParser = function numberParser(params) {
  return Number(params.newValue);
};

window.numberCellFormatter = function numberCellFormatter(params) {
  return Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1');
};
window.cellStyleJan = function cellStyleJan(params) {
  const color = numberToColor(params.data.seasonalityProduct.january);
  return { backgroundColor: color };
};

window.cellStyleFeb = function cellStyleFeb(params) {
  const color = numberToColor(params.data.seasonalityProduct.february);
  return { backgroundColor: color };
};
window.cellStyleMar = function cellStyleMar(params) {
  const color = numberToColor(params.data.seasonalityProduct.march);
  return { backgroundColor: color };
};
window.cellStyleApr = function cellStyleApr(params) {
  const color = numberToColor(params.data.seasonalityProduct.april);
  return { backgroundColor: color };
};
window.cellStyleMay = function cellStyleMay(params) {
  const color = numberToColor(params.data.seasonalityProduct.may);
  return { backgroundColor: color };
};
window.cellStyleJun = function cellStyleJun(params) {
  const color = numberToColor(params.data.seasonalityProduct.june);
  return { backgroundColor: color };
};
window.cellStyleJul = function cellStyleJul(params) {
  const color = numberToColor(params.data.seasonalityProduct.july);
  return { backgroundColor: color };
};
window.cellStyleAug = function cellStyleAug(params) {
  const color = numberToColor(params.data.seasonalityProduct.august);
  return { backgroundColor: color };
};
window.cellStyleSep = function cellStyleSep(params) {
  const color = numberToColor(params.data.seasonalityProduct.september);
  return { backgroundColor: color };
};
window.cellStyleOct = function cellStyleOct(params) {
  const color = numberToColor(params.data.seasonalityProduct.october);
  return { backgroundColor: color };
};
window.cellStyleNov = function cellStyleNov(params) {
  const color = numberToColor(params.data.seasonalityProduct.november);
  return { backgroundColor: color };
};
window.cellStyleDec = function cellStyleDec(params) {
  const color = numberToColor(params.data.seasonalityProduct.december);
  return { backgroundColor: color };
};

window.numberToColor = function numberToColor(val) {
  if (val === 1) {
    return DeliveryMethods.COLOR_0;
  } else if (val === 2) {
    return DeliveryMethods.COLOR_1;
  } else if (val === 3) {
    return DeliveryMethods.COLOR_2;
  } else if (val === 4) {
    return DeliveryMethods.COLOR_3;
  } else {
    return DeliveryMethods.COLOR_4;
  }
};


</script>
 
<style >
.ag-theme-alpine .ag-header-cell,
.ag-theme-alpine .ag-header-group-cell {
  margin-left: 5px;
  padding-left: 5px;
  padding-right: 3px;
}

.ag-theme-alpine {
    --ag-range-selection-border-color: rgb(193, 0, 0);    
}

.ag-theme-alpine .ag-cell,
.ag-theme-alpine .ag-full-width-row .ag-cell-wrapper.ag-row-group {
  margin-left: 0px;
  padding-left: 5px;
  padding-right: 3px;
}
</style>
