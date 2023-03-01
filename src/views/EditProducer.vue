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
          field: "abr",
          headerName: "Abréviation",
          width: 300,
          valueGetter: function (params) {
            return params.data.abr;
          },
          valueSetter: function (params) {
            var newVal = params.newValue;
            var valueChanged = params.data.b !== newVal;
            if (valueChanged) {
              params.data.abr = newVal;
            }
            return valueChanged;
          },
        },
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
          field: "firstName",
          headerName: "Prénom",
          width: 300,
          valueGetter: function (params) {
            return params.data.firstName;
          },
          valueSetter: function (params) {
            var newVal = params.newValue;
            var valueChanged = params.data.b !== newVal;
            if (valueChanged) {
              params.data.firstName = newVal;
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
       producerLabelList: [], 
        producerTypeList: [], 
         producerOriginList: []   
      
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    ...mapState([
      "producers",
      "producerLabels",
      "producerTypes",
      "producerOrigins"
      
    ]),
  },

  components: {
    AgGridVue,
  },

  beforeMount() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }

    this.$store
      .dispatch("fetchProducers")
      .finally(() => this.fetchProducerList()).finally(() =>
    this.$store
      .dispatch("fetchProducerLabels")
      .finally(() => this.fetchProducerLabels())).finally(() =>
    this.$store
      .dispatch("fetchProducerTypes")
      .finally(() => this.fetchProducerTypes())).finally(() => 
    this.$store
      .dispatch("fetchProducerOrigins")
      .finally(() => this.fetchProducerOrigins())
      .finally(() => this.addAction()));
  },

  mounted() {},

  methods: {
    onCellValueChanged: function (event) {
      console.log(event);
      const json = axios
        .post("/producers/update", [event.data])
        .then((response) => (this.requests = response.data));
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },

    fetchProducerList() {
      this.rowData = this.producers;
    },

    fetchProducerLabels() {
      this.producerLabels.forEach((element) =>
        this.producerLabelList.push(element.name)
      );

      this.columnDefs.push({
        field: "producerLabel.name",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: this.producerLabelList,
        },
        headerName: "Label",
        width: 300,
        valueGetter: function (params) {
          return params.data.certificate == null
            ? ""
            : params.data.certificate.name;
        },
        valueSetter: function (params) {
          var newVal = params.newValue;
          var valueChanged = params.data.b !== newVal;
          if (valueChanged && params.data.certificate == null) {
            let producerLabelId = params.data.certificate.find((item) => {
              if (item.name === newVal) {
                return item;
              }
            });
            params.data.certificate = {
              id: producerLabelId.id,
              name: newVal,
            };
          } else if (valueChanged && params.data.certificate != null) {
            params.data.certificate.name = newVal;
          }
          return valueChanged;
        },
      });
    },
    
    fetchProducerOrigins() {
      this.producerOrigins.forEach((element) =>
        this.producerOriginList.push(element.name)
      );
      this.columnDefs.push({
        field: "producerOrigin.name",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: this.producerOriginList,
        },
        headerName: "Origine",
        width: 300,
        valueGetter: function (params) {
          return params.data.producerOrigin == null
            ? ""
            : params.data.producerOrigin.name;
        },
        valueSetter: function (params) {
          var newVal = params.newValue;
          var valueChanged = params.data.b !== newVal;
          if (valueChanged && params.data.producerOrigin == null) {
            let producerOriginId = params.data.producerOrigins.find((item) => {
              if (item.name === newVal) {
                return item;
              }
            });
            params.data.producerOrigin = {
              id: producerOriginId.id,
              name: newVal,
            };
          } else if (valueChanged && params.data.producerOrigin != null) {
            params.data.producerOrigin.name = newVal;
          }
          return valueChanged;
        },
      });
    },
    fetchProducerTypes() {
      this.producerTypes.forEach((element) =>
        this.producerTypeList.push(element.name)
      );

      this.columnDefs.push({
        field: "producerType.name",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: this.producerTypeList,
        },

        headerName: "Type",
        width: 300,
        valueGetter: function (params) {
          return params.data.producerType == null
            ? ""
            : params.data.producerType.name;
        },
        valueSetter: function (params) {
          var newVal = params.newValue;
          var valueChanged = params.data.b !== newVal;
          if (valueChanged && params.data.producerType == null) {
            let producerTypeId = params.data.producerTypes.find((item) => {
              if (item.name === newVal) {
                return item;
              }
            });
            params.data.producerType = {
              id: producerTypeId.id,
              name: newVal,
            };
          } else if (valueChanged && params.data.producerType != null) {
            params.data.producerType.name = newVal;
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