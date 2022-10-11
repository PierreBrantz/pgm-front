<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <b-container fluid>
      <b-card-group deck>
        <b-card class="m-1" align="center" style="height: 50px">
          <b-row>
            <b-col>
              <b-form-select
                v-if="showAdminBoard"
                v-model="selectedProducer"
                :options="producers"
                v-on:change="changeProducer"
                size="sm"
              ></b-form-select>
            </b-col>
          </b-row>
        </b-card>
        <b-card class="m-1" align="center" style="height: 50px">
          <b-row>
            <b-col>
              <b-button variant="outline-primary" @click="onBtnExport()"
                >Download CSV</b-button
              >
            </b-col>
          </b-row>
        </b-card>
        <b-card class="m-1" align="center" style="height: 50px">
          <form enctype="multipart/form-data">
            <input type="file" @change="onFileChange" />
          </form>
        </b-card>
      </b-card-group>

      <product-detail-modal
        :productDetail="productDetail"
      ></product-detail-modal>
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
        :headerHeight="headerHeight"
        @cell-clicked="onCellClicked"
        @cell-value-changed="onCellValueChanged"
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
import ProductDetailModal from "../components/ProductDetailModal.vue";

export default {
  data() {
    return {
      selectedProducer: null,
      selectedProduct: null,
      producers: [{ value: null, text: "Producteurs..." }],
      productList: [{ value: null, text: "Produits..." }],
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      rowData: [],
      columnDefs: null,
      modules: AllCommunityModules,
      producerId: null,
      productsByProducer: [],
      productDetail: null,
      products: [],
      seasons: [],
      producerInfo: null,
      contractParam: null,
      fileInput: [],
      headerHeight:20
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser["roles"]) {
        return this.currentUser["roles"].includes("ROLE_ADMIN");
      }
      return false;
    },
    showUserBoard() {
      if (this.currentUser && this.currentUser["roles"]) {
        return this.currentUser["roles"].includes("ROLE_USER");
      }
      return false;
    },
  },
  components: {
    AgGridVue,
    "product-detail-modal": ProductDetailModal,
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.fetchProducers();
    this.fetchProductList();
    this.fetchSeasonalities();
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.changeProducer();
    this.gridApi.sizeColumnsToFit();
    this.fetchContractParams();

    this.buildColumns();
  },
  methods: {
    csvToArray(data, delimiter = ";", omitFirstRow = false) {
      const rows = data
        .replace(/\r/g, "")
        .slice(omitFirstRow ? data.indexOf("\n") + 1 : 0)
        .split("\n")
        .map((v) => v.split(delimiter));
      return rows;
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createInput(files[0]);
    },


    createInput(file) {
      var reader = new FileReader();      
      reader.onload = (e) => {
        const text = e.target.result;

        this.fileInput = this.csvToArray(text);
        let product = null;
        for(let i = 1; i< this.fileInput.length; i++){
          product = this.findProductByName(this.fileInput[i][0]);
          console.log(this.products);
          if(product != null && product.weeklyProposals != null){
           for(let j = 0; j < product.weeklyProposals.length; j++){     
          if(new Date(this.fileInput[i][2]).toDateString() == new Date(product.weeklyProposals[j].date).toDateString()){
            product.weeklyProposals[j].realQuantity = this.fileInput[i][1];
            this.postProduct(product);
          }
        }
          }

        }
      };
      reader.readAsText(file);
    },
    onBtnExport() {
      this.gridApi.exportDataAsCsv();
    },
    
    async postProduct(data){
      const json = await axios
        .post(
          "/products/" +
            data.id +
            "/producer/" +
            this.selectedProducer +
            "/date/" +
            new Date(),
          data
        )
        .then((response) => (this.requests = response.data));
    },

    async onCellValueChanged(event) {     
      const json = await axios
        .post(
          "/products/" +
            event.data.id +
            "/producer/" +
            this.selectedProducer +
            "/date/" +
            new Date(),
          event.data
        )
        .then((response) => (this.requests = response.data));

      this.producerProducts = json.producerProducts;
      this.products = json;
    },


    async findProductByName(name) {

      let ret = null;
      await this.products.find((item) => {  
 
        if (item.name === name) {
          ret = item;
        }
      });
      return ret;
    },

    async fetchProducers() {
      const json = await axios
        .get("/producers")
        .then((response) => (this.requests = response.data));
      json.forEach((element) =>
        this.producers.push({ value: element.id, text: element.abr })
      );
      this.producerInfo = json;
    },

    async fetchContractParams() {
      const json = await axios
        .get("/contractParams")
        .then((response) => (this.requests = response.data));
      this.contractParam = json;
    },

    async fetchProductList() {
      const json = await axios
        .get("/products")
        .then((response) => (this.requests = response.data));
      this.products = json;
      json.forEach((element) =>
        this.productList.push({ value: element.id, text: element.name })
      );
      this.products = json;
    },
    async fetchSeasonalities() {
      const json = await axios
        .get("/seasons")
        .then((response) => (this.seasons = response.data));
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
    async findProducerByAbr(arg) {
      const json = await axios
        .get("/producers/abr/" + arg)
        .then((response) => (this.requests = response.data));

      return json;
    },

    async changeProducer(arg) {
      if (this.showUserBoard) {
        arg = await this.findProducerByAbr(this.currentUser.username).Id;
      }

      if (arg) {
        const json = await axios
          .get("/products/producer/" + arg)
          .then((response) => (this.requests = response.data))
          .then((rowData) => (this.rowData = rowData));
        this.producerId = arg;
        this.productsByProducer = json;
        this.selectedProducer = this.producerId;
        this.products = json;
      }
    },

    onCellClicked(params) {
      if (params.column.colId == "name") {
        this.productDetail = this.products[params.data.id - 1];
        this.$root.$emit("bv::show::modal", "product-detail-modal", "#btnShow");
      }
    },

    buildColumns() {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const tuesdays = this.getDaysBetweenDates(
        firstDayOfMonth,
        lastDayOfMonth,
        "tue"
      );
      const fridays = this.getDaysBetweenDates(
        firstDayOfMonth,
        lastDayOfMonth,
        "fri"
      );

      const days = tuesdays.concat(fridays).sort(function (date1, date2) {
        return date1 - date2;
      });

      for (let i = 0; i < days.length; i++) {
        this.columnDefs.push({
          headerName: days[i].getDate() + "-" + (days[i].getMonth() + 1),
          children:[{
          headerName: "Théo.",
          field: "quantity" + i,
          editable: true,
          resizable: true,
          valueParser: numberParser,
          
          valueGetter: function (params) {
            let wp = params.data.weeklyProposals.filter(
              (e) =>
                new Date(e.date).setHours(0, 0, 0, 0) ===
                days[i].setHours(0, 0, 0, 0)
            );
            if (wp.length > 0) {
              return wp[0].quantity;
            }
          },
          valueSetter: function (params) {
            var newValInt = parseInt(params.newValue);
            var valueChanged = params.data.b !== newValInt;
            if (valueChanged) {
              if (!params.data.weeklyProposals[i]) {
                  params.data.weeklyProposals[i] = {
                  id: params.data.id,
                  producerProductId: params.data.producerProductId,
                  quantity: newValInt,
                  date: days[i],
                };
              } else {
                
              //  if (params.data.id == params.data.weeklyProposals[i].id) {

                  params.data.weeklyProposals[i].date = days[i];
                  params.data.weeklyProposals[i].quantity = newValInt;
            //    }
              }
            }
            return valueChanged;
          },
          width: 60,
        },
        {
          field: "realQuantity" + i,
          headerName: "Réel",
          editable: false,
          valueParser: numberParser,
          resizable: true,
          width: 60,
          valueGetter: function (params) {
            if(params.data.weeklyProposals[i] != null ){
               let wp = params.data.weeklyProposals.filter(
              (e) =>
                new Date(e.date).setHours(0, 0, 0, 0) ===
                days[i].setHours(0, 0, 0, 0)
            );
            if (wp.length > 0) {
              return wp[0].realQuantity;
            }
            }
        },
        }]}
        );
      }
    },
    getDaysBetweenDates(start, end, dayName) {
      var result = [];
      var days = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
      var day = days[dayName.toLowerCase().substr(0, 3)];
      // Copy start date
      var current = new Date(start);
      // Shift to next of required days
      current.setDate(current.getDate() + ((day - current.getDay() + 7) % 7));
      // While less than end date, add dates to result array
      while (current < end) {
        result.push(new Date(+current));
        current.setDate(current.getDate() + 7);
      }
      return result;
    },
  },

  beforeMount() {
    this.gridOptions = {};
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
        field: "cond",
        width: 60,
        pinned: "left",
        resizable: true,
        valueGetter: function (params) {
          if (params.data.packaging && params.data.packaging.name != null) {
            return params.data.packaging.name;
          }
        },
      },
      {
        headerName: "Prix",
        field: "price",
        resizable: true,
        valueGetter: function (params) {
          if (params.data.price != null) {
            return params.data.price + "€";
          }
        },
        width: 50,
        pinned: "left",
      },

      {
        field: "qteTot",
        marryChildren:true,
        children:[{
        headerName: 'Théo.',
        resizable: true,
        width: 90,
        pinned: "right",
        valueGetter: function (params) {
          let total = 0;
          for (let i = 0; i < params.data.weeklyProposals.length; i++) {
              total += params.data.weeklyProposals[i] == null ? 0 : params.data.weeklyProposals[i].quantity;
          }
          return total;
        },
        
      },
       {
        headerName: "Réel",
        width: 70,
        pinned: "right",
        resizable: true,
      }]},
    ];
  },
};
window.numberParser = function numberParser(params) {
  return Number(params.newValue);
};

</script>

<style>
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

.card-body {
  padding: 0.4rem;
  font-size: 80%;
}
</style>