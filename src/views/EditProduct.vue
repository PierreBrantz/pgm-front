<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <b-container fluid> </b-container>
    <ag-grid-vue
      style="width: 100%; height: 100%"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      @grid-ready="onGridReady"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      @cell-value-changed="onCellValueChanged"
      :maintainColumnOrder=true
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import axios from "axios";
import { AgGridVue } from "ag-grid-vue";
import { mapState } from "vuex";

export default {
  name: "App",
  data() {
    return {
      columnDefs: [
        {
          field: "name",
          headerName: "Nom",
          width: 300,
          valueGetter: function (params) {
            return params.data.name;
          },
          valueSetter: function (params) {
            var newVal = params.newValue;
            var valueChanged = params.data.b !== newVal;
            if (valueChanged) {
              params.data.name = newVal;
            }
            return valueChanged;
          },
        },
        {
          field: "price",
          headerName: "Prix",
          valueParser: numberParser,
          width: 300,
          valueGetter: function (params) {
            return params.data.price;
          },
          valueSetter: function (params) {
            var newVal = params.newValue;
            var valueChanged = params.data.b !== newVal;
            if (valueChanged) {
              params.data.price = newVal;
            }
            return valueChanged;
          },
        },
      ],
      gridApi: null,
      columnApi: null,
      defaultColDef: {
        flex: 1,
        filter: true,
        filterParams: { buttons: ["reset", "apply"], closeOnApply: true },
        editable: true,
        sortable: true,
        resizable: true,
      },
       
      rowData: null,     
      productTypeList: [],      
      productLabelList: [],      
      productOriginList: []
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    ...mapState([
      "products",
      "productLabels",
      "productTypes",
      "productOrigins",
    ]),
  },

  components: {
    AgGridVue,
  },

  beforeMount() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }

    //.then((rowData) => {
    //    this.rowData = rowData;});
    //this.gridApi = this.gridOptions.api;
    //  this.gridColumnApi = this.gridOptions.columnApi;
    // this.gridApi.sizeColumnsToFit();
    this.$store
      .dispatch("fetchProducts")
      .finally(() => this.fetchProductList()).finally(() =>
    this.$store
      .dispatch("fetchProductLabels")
      .finally(() => this.fetchProductLabels())).finally(() =>
    this.$store
      .dispatch("fetchProductTypes")
      .finally(() => this.fetchProductTypes())).finally(() => 
    this.$store
      .dispatch("fetchProductOrigins")
      .finally(() => this.fetchProductOrigins())
      .finally(() => this.addAction()));
  },

  mounted() {},

  methods: {
    onCellValueChanged: function (event) {
      const json = axios
        .post("/products", [event.data])
        .then((response) => (this.requests = response.data));
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },

    fetchProductList() {
      this.rowData = this.products;
    },

    fetchProductLabels() {
      this.productLabels.forEach((element) =>
        this.productLabelList.push(element.name)
      );

      this.columnDefs.push({
        field: "productLabel.name",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: this.productLabelList,
        },
        headerName: "Label",
        width: 300,
        valueGetter: function (params) {
          return params.data.productLabel == null
            ? ""
            : params.data.productLabel.name;
        },
        valueSetter: function (params) {
          var newVal = params.newValue;
          var valueChanged = params.data.b !== newVal;
          if (valueChanged && params.data.productLabel == null) {
            let productLabelId = params.data.productLabels.find((item) => {
              if (item.name === newVal) {
                return item;
              }
            });
            params.data.productLabel = {
              id: productLabelId.id,
              name: newVal,
            };
          } else if (valueChanged && params.data.productLabel != null) {
            params.data.productLabel.name = newVal;
          }
          return valueChanged;
        },
      });
    },
    fetchProductOrigins() {
      this.productOrigins.forEach((element) =>
        this.productOriginList.push(element.name)
      );
      this.columnDefs.push({
        field: "productOrigin.name",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: this.productOriginList,
        },
        headerName: "Origine",
        width: 300,
        valueGetter: function (params) {
          return params.data.productOrigin == null
            ? ""
            : params.data.productOrigin.name;
        },
        valueSetter: function (params) {
          var newVal = params.newValue;
          var valueChanged = params.data.b !== newVal;
          if (valueChanged && params.data.productOrigin == null) {
            let productOriginId = params.data.productOrigins.find((item) => {
              if (item.name === newVal) {
                return item;
              }
            });
            params.data.productOrigin = {
              id: productOriginId.id,
              name: newVal,
            };
          } else if (valueChanged && params.data.productOrigin != null) {
            params.data.productOrigin.name = newVal;
          }
          return valueChanged;
        },
      });
    },
    fetchProductTypes() {
      this.productTypes.forEach((element) =>
        this.productTypeList.push(element.name)
      );

      this.columnDefs.push({
        field: "productType.name",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: this.productTypeList,
        },

        headerName: "Type",
        width: 300,
        valueGetter: function (params) {
          return params.data.productType == null
            ? ""
            : params.data.productType.name;
        },
        valueSetter: function (params) {
          var newVal = params.newValue;
          var valueChanged = params.data.b !== newVal;
          if (valueChanged && params.data.productType == null) {
            let productTypeId = params.data.productTypes.find((item) => {
              if (item.name === newVal) {
                return item;
              }
            });
            params.data.productType = {
              id: productTypeId.id,
              name: newVal,
            };
          } else if (valueChanged && params.data.productType != null) {
            params.data.productType.name = newVal;
          }
          return valueChanged;
        },
      });
      
    },
    addAction(){
      this.columnDefs.push({
        name: "action",
        headerName: "Action",
        cellRenderer: TotalValueRenderer,
        width: 300,
        valueGetter: function (params) {
          return params.data.id;
        },
      });
      }
  },
};
window.numberParser = function numberParser(params) {
  return Number(params.newValue);
};


class TotalValueRenderer {
  // gets called once before the renderer is used
  init(params) {
    // create the cell
    this.eGui = document.createElement("div");
    this.eGui.innerHTML = `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
          <span>
            <button class="btn-simple"><i class="fa fa-plus-circle"></i></button>
          </span>
       `;

    // get references to the elements we want
    this.eButton = this.eGui.querySelector(".btn-simple");
    this.eValue = this.eGui.querySelector(".my-value");

    // set value into cell
    this.cellValue = this.getValueToDisplay(params);
    //this.eValue.innerHTML = this.cellValue;

    // add event listener to button
    // this.eventListener = () => alert(`${this.cellValue} medals won!`);
    this.eventListener = () =>
      (window.location.href = "/addproduct?product=" + this.cellValue);
    this.eButton.addEventListener("click", this.eventListener);
  }

  getGui() {
    return this.eGui;
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
    this.eValue.innerHTML = this.cellValue;

    // return true to tell the grid we refreshed successfully
    return true;
  }

  // gets called when the cell is removed from the grid
  destroy() {
    // do cleanup, remove event listener from button
    if (this.eButton) {
      // check that the button element exists as destroy() can be called before getGui()
      this.eButton.removeEventListener("click", this.eventListener);
    }
  }

  getValueToDisplay(params) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}
</script>
<style >
/* Style buttons */
.btn-simple {
  background-color: rgb(255, 255, 255); /* Blue background */
  border: none; /* Remove borders */
  color: DodgerBlue(160, 58, 58); /* White text */
  font-size: 20px; /* Set a font size */
  cursor: pointer; /* Mouse pointer on hover */
  vertical-align: center;
}
</style>