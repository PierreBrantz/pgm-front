<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <b-container fluid>
      <b-row>
        <b-card  no-body v-if="seasons.length > 0" class="m-1 p-1" style="max-width: 23rem;">
          <b-row class='mb-1'>
            <b-col>
              <b-row>
                <b-col>
                  <b-button
                    variant="outline-secondary"
                    v-on:click="currentSeason = 0"
                    v-on:dblclick="editSeasonName"
                    size="sm"
                    >{{ seasons[0].name }}</b-button
                  >               
    
                </b-col>
                <b-col>
                  <b-form-input
                    v-model="seasons[0].percent"
                    type="number"
                    size="sm"
                    @change="saveSeasons"
                  ></b-form-input>
                </b-col>
              </b-row>
            </b-col>  
            <b-col>
              <b-row>
                <b-col>
                  <b-button
                    variant="success"
                    v-on:click="currentSeason = 1"
                    v-on:dblclick="editSeasonName"
                    size="sm"
                    >{{ seasons[1].name }}</b-button
                  > </b-col
                ><b-col
                  ><b-form-input
                    v-model="seasons[1].percent"
                    type="number"
                    size="sm"
                    @change="saveSeasons"
                  ></b-form-input>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-row>
                <b-col>
                  <b-button
                    variant="info"
                    v-on:click="currentSeason = 2"
                    v-on:dblclick="editSeasonName"
                    size="sm"
                    >{{ seasons[2].name }}
                  </b-button>
                </b-col>
                <b-col>
                  <b-form-input
                    v-model="seasons[2].percent"
                    type="number"
                    size="sm"
                    @change="saveSeasons"
                  ></b-form-input>
                </b-col>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-col>
                  <b-button
                    variant="warning"
                    v-on:click="currentSeason = 3"
                    v-on:dblclick="editSeasonName"
                    size="sm"
                    >{{ seasons[3].name }}</b-button
                  > </b-col
                ><b-col
                  ><b-form-input
                    v-model="seasons[3].percent"
                    type="number"
                    size="sm"
                    @change="saveSeasons"
                  ></b-form-input> </b-col
              ></b-row>
            </b-col>
          </b-row>
        </b-card>
       
      </b-row>
      <season-name-modal v-if="seasons.length > 0" :seasonId="currentSeason" :seasons="seasons"></season-name-modal>
    </b-container>
    <ag-grid-vue
      style="width: 100%; height: 100%"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :gridOptions="gridOptions"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import SeasonNameModal from "../components/SeasonNameModal.vue"
import axios from "axios";
import { AgGridVue } from "ag-grid-vue";
import CONST from "../services/constant.js";

export default {
  name: "App",
  data() {
    return {
      columnDefs: null,
      rowData: null,
      gridOptions: null,
      seasons: [],
      currentSeason: 0,
      seasonalityProduct: null
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  components: {
    AgGridVue,
    "season-name-modal": SeasonNameModal,
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.fetchProductList();
    this.fetchSeasonality();
  },
  beforeMount() {
    this.gridOptions = {
      onCellClicked: (event) => {
        if(!this.currentSeason) this.currentSeason = 0;
        switch (event.colDef.field) {
          
          case "january": {

            event.data.seasonalityProduct.january = this.currentSeason;
            break;
          }
          case "february": {
            event.data.seasonalityProduct.february = this.currentSeason;
            break;
          }
          case "march": {
            event.data.seasonalityProduct.march = this.currentSeason;
            break;
          }
          case "april": {
            event.data.seasonalityProduct.april = this.currentSeason;
            break;
          }
          case "may": {
            event.data.seasonalityProduct.may = this.currentSeason;
            break;
          }
          case "june": {
            event.data.seasonalityProduct.june = this.currentSeason;
            break;
          }
          case "july": {
            event.data.seasonalityProduct.july = this.currentSeason;
            break;
          }
          case "august": {
            event.data.seasonalityProduct.august = this.currentSeason;
            break;
          }
          case "september": {
            event.data.seasonalityProduct.september = this.currentSeason;
            break;
          }
          case "october": {
            event.data.seasonalityProduct.october = this.currentSeason;
            break;
          }
          case "november": {
            event.data.seasonalityProduct.november = this.currentSeason;
            break;
          }
          case "december": {
            event.data.seasonalityProduct.december = this.currentSeason;
            break;
          }
        }
        this.save();
        this.gridOptions.api.redrawRows();
      },
    };

    this.columnDefs = [
      {
        field: "name",
        width: 300,
        resizable: true,
        cellClass: (params) => {
          return this.selectColor(params.value);
        },
      },
      {
        field: "january",
        headerName: "janvier",
        cellClass: (params) => {
          if (params.data.seasonalityProduct != null) {
            return this.selectColor(params.data.seasonalityProduct.january);
          }
        },
      },
      {
        field: "february",
        headerName: "Février",
        cellClass: (params) => {
          if (params.data.seasonalityProduct != null) {
            return this.selectColor(params.data.seasonalityProduct.february);
          }
        },
      },
      {
        field: "march",
        headerName: "Mars",
        cellClass: (params) => {
          if (params.data.seasonalityProduct != null) {
            return this.selectColor(params.data.seasonalityProduct.march);
          }
        },
      },
      {
        field: "april",
        headerName: "Avril",
        cellClass: (params) => {
          if (params.data.seasonalityProduct != null) {
            return this.selectColor(params.data.seasonalityProduct.april);
          }
        },
      },
      {
        field: "may",
        headerName: "Mai",
        cellClass: (params) => {
          if (params.data.seasonalityProduct != null) {
            return this.selectColor(params.data.seasonalityProduct.may);
          }
        },
      },
      {
        field: "june",
        headerName: "Juin",
        cellClass: (params) => {
          if (params.data.seasonalityProduct != null) {
            return this.selectColor(params.data.seasonalityProduct.june);
          }
        },
      },
      {
        field: "july",
        headerName: "Juillet",
        cellClass: (params) => {
          if (params.data.seasonalityProduct != null) {
            return this.selectColor(params.data.seasonalityProduct.july);
          }
        },
      },
      {
        field: "august",
        headerName: "Août",
        cellClass: (params) => {
          if (params.data.seasonalityProduct != null) {
            return this.selectColor(params.data.seasonalityProduct.august);
          }
        },
      },
      {
        field: "september",
        headerName: "Septembre",
        cellClass: (params) => {
          if (params.data.seasonalityProduct != null) {
            return this.selectColor(params.data.seasonalityProduct.september);
          }
        },
      },
      {
        field: "october",
        headerName: "Octobre",
        cellClass: (params) => {
          if (params.data.seasonalityProduct != null) {
            return this.selectColor(params.data.seasonalityProduct.october);
          }
        },
      },
      {
        field: "november",
        headerName: "Novembre",
        cellClass: (params) => {
          if (params.data.seasonalityProduct != null) {
            return this.selectColor(params.data.seasonalityProduct.november);
          }
        },
      },
      {
        field: "december",
        headerName: "Décembre",
        cellClass: (params) => {
          if (params.data.seasonalityProduct != null) {
            return this.selectColor(params.data.seasonalityProduct.december);
          }
        },
      },
    ];
  },

  methods: {
    async fetchProductList() {
      const json = await axios
        .get("/products")
        .then((response) => (this.products = response.data))
        .then((rowData) => (this.rowData = rowData));
    },
    async fetchSeasonality() {
      const json = await axios
        .get("/seasons")
        .then((response) => (this.seasons = response.data));
    },

    selectColor(season) {
      switch (season) {
        case 1:
          return "season1";
        case 2:
          return "season2";
        case 3:
          return "season3";
        default:
          return "season0";
      }
    },
    save() {  
      axios.post("/products", this.products);
    },
    saveSeasons() {
      axios.post("/seasons", this.seasons);
    },
    editSeasonName(arg){
      this.$root.$emit("bv::show::modal", "season-name-modal", "#btnShow");
    }
  },
};
</script>
<style >
.season0 {
  background-color: #fff !important;
}
.season1 {
  background-color: #28a745 !important;
}
.season2 {
  background-color: #17a2b8 !important;
}
.season3 {
  background-color: #ffc107 !important;
}

.ag-header-group-cell-label,
.ag-header-cell-label {
  display: block;
  align-self: center;
  overflow: hidden;
  align-items: center;
  text-overflow: ellipsis;

  text-align: center;
}

.ag-theme-alpine .ag-cell,
.ag-theme-alpine .ag-full-width-row .ag-cell-wrapper.ag-row-group {
  border: 1px solid transparent;

  padding-left: 3px;
  padding-right: 0px;
  -webkit-font-smoothing: subpixel-antialiased;
  text-align: center;
}

.btn-success {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745;
}
</style>