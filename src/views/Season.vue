<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <b-container fluid>
      <b-row>
        <b-col cols="2" v-for="(season, count) in seasons" :key="season.id">
          <b-card no-body class="m-1 p-1" style="max-width: 10rem">
            <b-row>
              <b-col>
                <b-button
                  :style="btnStyles(count)"                 
                  v-on:click="currentSeason = season.id"
                  v-on:dblclick="editSeasonName(count)"
                  size="sm"
                  >{{ season.name }}</b-button
                >
              </b-col>
              <b-col>
                <b-form-input
                  v-model="season.percent"
                  type="number"
                  size="sm"
                  @change="saveSeasons"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col class="mt-3">
          <b-icon
            @click="addSeason"
            variant="success"
            icon="plus"
            scale="3"
            class="mr-3"
            ></b-icon>

          <b-icon
            @click="deleteSeason"
            variant="danger"
            icon="trash"
            scale="2"
          ></b-icon>
        </b-col>
      </b-row>

      <season-name-modal
        v-if="seasons.length > 0"
        :seasonIndex="seasonIndex"
        :seasons="seasons"
      ></season-name-modal>
      <add-season-modal
        v-if="seasons.length > 0"
        :seasonId="currentSeason"
        :seasons="seasons"
      ></add-season-modal>
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
import SeasonNameModal from "../components/SeasonNameModal.vue";
import AddSeasonModal from "../components/AddSeasonModal.vue";
import axios from "axios";
import { AgGridVue } from "ag-grid-vue";
import { DeliveryMethods } from '../services/constant.js';




export default {
  name: "App",
  data() {
    return {
      columnDefs: null,
      rowData: null,
      gridOptions: null,
      seasons: [],

      currentSeason: 1,
      seasonalityProduct: null, 
      lastSeasonIndex : 0,
      seasonIndex: 1,
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
    "add-season-modal": AddSeasonModal,
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
        if (!this.currentSeason) this.currentSeason = 1;
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
        width: 180,
        resizable: true,
         pinned: "left",
        
      },
             {
        headerName: "Label",
        field: "productLabel",
        width: 60,
        sortable: true,
        pinned: "left",
        resizable: true,
 
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
        resizable: true,
        pinned: "left",
        valueGetter: function (params) {
          if (params.data.productOrigin && params.data.productOrigin.name) {
            return params.data.productOrigin.name;
          }
        },
      },
      {
        headerName: "Condit#",
        width: 80,    
        resizable: true,
        pinned: "left",
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
        
        field: "january",
        headerName: "janvier",
        width: 60,    
        cellStyle: params =>{
          return {backgroundColor : this.selectColor(params.data.seasonalityProduct.january)}
        }
      },
      {
        field: "february",
        headerName: "Février",
        width: 60,    
        cellStyle: params =>{
          return {backgroundColor : this.selectColor(params.data.seasonalityProduct.february)}
        }
      },
      {
        field: "march",
        headerName: "Mars",
        width: 60, 
        cellStyle: params =>{
          return {backgroundColor : this.selectColor(params.data.seasonalityProduct.march)}
        }
      },
      {
        field: "april",
        headerName: "Avril",
        width: 60, 
        cellStyle: params =>{
          return {backgroundColor : this.selectColor(params.data.seasonalityProduct.april)}
        }
      },
      {
        field: "may",
        headerName: "Mai",
        width: 60, 
        cellStyle: params =>{
          return {backgroundColor : this.selectColor(params.data.seasonalityProduct.may)}
        }
      },
      {
        field: "june",
        headerName: "Juin",
        width: 60, 
        cellStyle: params =>{
          return {backgroundColor : this.selectColor(params.data.seasonalityProduct.june)}
        }
      },
      {
        field: "july",
        headerName: "Juillet",
        width: 60, 
        cellStyle: params =>{
          return {backgroundColor : this.selectColor(params.data.seasonalityProduct.july)}
        }
      },
      {
        field: "august",
        headerName: "Août",
        width: 60, 
        cellStyle: params =>{
          return {backgroundColor : this.selectColor(params.data.seasonalityProduct.august)}
        }
      },
      {
        field: "september",
        headerName: "Septembre",
        width: 60, 
        cellStyle: params =>{
          return {backgroundColor : this.selectColor(params.data.seasonalityProduct.september)}
        }
      },
      {
        field: "october",
        headerName: "Octobre",
        width: 60, 
        cellStyle: params =>{
          return {backgroundColor : this.selectColor(params.data.seasonalityProduct.october)}
        }
      },
      {
        field: "november",
        headerName: "Novembre",
        width: 60, 
        cellStyle: params =>{
          return {backgroundColor : this.selectColor(params.data.seasonalityProduct.november)}
        }
      },
      {
        field: "december",
        headerName: "Décembre",
        width: 60, 
        cellStyle: params =>{
          return {backgroundColor : this.selectColor(params.data.seasonalityProduct.december)}
        }
      },
    ];
  },

  methods: {
    btnStyles(seasonColor) {
      var background;
      switch(seasonColor){
        case 0 : background= DeliveryMethods.COLOR_0;    
        break;
        case 1 : background= DeliveryMethods.COLOR_1;
        break;
        case 2 : background= DeliveryMethods.COLOR_2;
        break;
        case 3 : background= DeliveryMethods.COLOR_3;
        break;
        default:
          background= DeliveryMethods.COLOR_4;
      }
      return {
        "background-color" : background,
        "color" : "#000000"
      }
    },
    
    async fetchProductList() {
      await axios
        .get("/products")
        .then((response) => (this.products = response.data))
        .then((rowData) => (this.rowData = rowData));
    },
     async fetchSeasonality() {
     await axios
        .get("/seasons")
        .then((response) =>(
          this.seasons = response.data));
    },

     selectColor(seasonId) {
      switch (seasonId) {
        case this.products[0].seasonalities[0] != null && this.products[0].seasonalities[0].id:
          return DeliveryMethods.COLOR_0;
        case this.products[0].seasonalities[1] != null && this.products[0].seasonalities[1].id:
          return DeliveryMethods.COLOR_1;
        case this.products[0].seasonalities[2] != null && this.products[0].seasonalities[2].id:
          return DeliveryMethods.COLOR_2;
        case this.products[0].seasonalities[3] != null && this.products[0].seasonalities[3].id:
          return DeliveryMethods.COLOR_3;
         default:
          return DeliveryMethods.COLOR_4;
      }
 
    },
    save() {
      axios.post("/products", this.products);
    },
    saveSeasons() {
      axios.post("/seasons", this.seasons);
    },
    editSeasonName(arg) {      
      this.seasonIndex = arg;
      this.$root.$emit("bv::show::modal", "season-name-modal", "#btnShow");
    },
     addSeason() {
       if(this.seasons.length < 5 ){
       this.$root.$emit("bv::show::modal", "add-season-modal", "#btnShow");
       }
    },
    
    deleteSeason(){
      if(this.seasons.length > 4 ){
          axios
        .delete("/seasons/" + this.seasons[this.seasons.length - 1].id)
        .then((response) => {
          this.seasons.splice(this.seasons.length - 1, 1);
        })
        .catch((e) => {
          this.$bvToast.toast("Impossible de supprimer cet élément", {
            title: "Info",
            variant: "danger",
            solid: true,
          });
        });
      }

     
    }
  },
};
</script>
<style >

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




.btn-default {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}
</style>