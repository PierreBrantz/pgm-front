<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <b-container fluid>
      <b-card-group deck>
        <b-card
          v-if="showAdminBoard"
          class="m-1"
          align="center"
          style="height: 50px"
        >
          <b-row>
            <b-col>
              <b-form-select
                v-model="selectedProducer"
                :options="producers"
                v-on:change="changeProducer"
                size="sm"
              ></b-form-select>
            </b-col>
            <b-col>
              <b-form-select
                v-model="selectedProduct"
                :options="productList"
                size="sm"
              ></b-form-select>
            </b-col>
            <b-col>
              <b-button
                variant="outline-primary"
                @click="addProductClick"
                size="sm"
                ><b-icon icon="link" scale="1.3" aria-hidden="true"></b-icon
              ></b-button>
            </b-col>
          </b-row>
        </b-card>

        <b-card
          v-if="selectedProducer != null && selectedProducer != 0"
          class="m-1"
          style="height: 50px"
          align="center"
        >
          <b-row>
            <b-col>
              <b-card-text>Enregistrer le contrat</b-card-text>
            </b-col>
            <b-col>
              <b-button variant="outline-primary" @click="downloadPDF" size="sm"
                ><b-icon icon="download" scale="1.3" aria-hidden="true"></b-icon
              ></b-button>
            </b-col>
          </b-row>
        </b-card>

        <b-card
          v-if="seasons.length > 0"
          id="my-legend"
          class="m-1"
          style="width: 100%; height: 50px"
        >
          <b-row>
            <b-col>
              <ul>
                <li>
                  <span style="background: #fff"></span>{{ seasons[0].name }}
                </li>
                <li>
                  <span style="background: #28a745"></span>{{ seasons[1].name }}
                </li>
              </ul>
            </b-col>

            <b-col>
              <ul>
                <li>
                  <span style="background: #17a2b8"></span>{{ seasons[2].name }}
                </li>
                <li>
                  <span style="background: #ffc107"></span>{{ seasons[3].name }}
                </li>
              </ul>
            </b-col>
            <b-col v-if="seasons.length > 4">
              <ul>
                <li>
                  <span style="background: #dc3545"></span>{{ seasons[4].name }}
                </li>
              </ul>
            </b-col>
          </b-row>
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
        :headerHeight="headerHeight"
        :gridOptions="gridOptions"
        :rowData="rowData"
        :columnDefs="columnDefs"
        :modules="modules"
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
import jsPDF from "jspdf";
import JsPDFAutotable from "jspdf-autotable";
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
      headerHeight: 20,
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
    JsPDFAutotable,
    "product-detail-modal": ProductDetailModal,
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.fetchProducers();
    this.changeProducer();
    this.fetchProductList();
    this.fetchSeasonalities();
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;

    this.gridApi.sizeColumnsToFit();
    this.fetchContractParams();
  },
  methods: {
    async onCellValueChanged(event) {
      const json = await axios
        .post(
          "/products/" + event.data.id + "/producer/" + this.selectedProducer,
          event.data
        )
        .then((response) => (this.requests = response.data));
      this.producerProducts = json.producerProducts;
    },

    findProducerName(id) {
      this.producers.find((item) => {
        if (item.value === id) {
          return item.text;
        }
      });
    },

    downloadPDF() {
      const doc = new jsPDF("l");
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      const pageHeight = pageSize.height
        ? pageSize.height
        : pageSize.getHeight();

      let producer = this.producerInfo.find((item) => {
        if (item.id === this.producerId) {
          return item;
        }
      });

      doc.setFontSize(15);
      doc.text(this.contractParam.title, 10, 10);
      doc.setFontSize(10);

      doc.text(producer.firstName + " " + producer.name, 10, 20);

      doc.text("GSM: " + (producer.gsm != null ? producer.gsm : ""), 10, 25);

      doc.text(
        "Tel.: " + (producer.phone != null ? producer.phone : ""),
        10,
        30
      );
      doc.text("Mail: " + (producer.mail != null ? producer.mail : ""), 10, 35);

      doc.text(producer.company != null ? producer.company : "", 80, 20);
      doc.text(
        (producer.number != null ? producer.number : "") +
          ", " +
          (producer.road != null ? producer.road : ""),
        80,
        25
      );
      doc.text(
        (producer.postCode != null ? producer.postCode : "") +
          " " +
          (producer.town != null ? producer.town : ""),
        80,
        30
      );

      doc.text("TVA: " + (producer.tva != null ? producer.tva : ""), 160, 20);

      doc.line(0, 40, 400, 35);
      let rows = [];

      this.productsByProducer.forEach((element) => {
        if (element.currentRealQuantity) {
          var temp = [
            element.name,
            element.price + "€",
            element.packaging == null ? "" : element.packaging.name,
            (element.currentRealQuantity.quantity1 == null
              ? 0
              : element.currentRealQuantity.quantity1) +
              "(" +
              (element.price * element.seasonalityProduct.january).toFixed(2) +
              "€)",
            (element.currentRealQuantity.quantity2 == null
              ? 0
              : element.currentRealQuantity.quantity2) +
              "(" +
              (element.price * element.seasonalityProduct.february).toFixed(2) +
              "€)",
            (element.currentRealQuantity.quantity3 == null
              ? 0
              : element.currentRealQuantity.quantity3) +
              "(" +
              (element.price * element.seasonalityProduct.march).toFixed(2) +
              "€)",
            (element.currentRealQuantity.quantity4 == null
              ? 0
              : element.currentRealQuantity.quantity4) +
              "(" +
              (element.price * element.seasonalityProduct.april).toFixed(2) +
              "€)",
            (element.currentRealQuantity.quantity5 == null
              ? 0
              : element.currentRealQuantity.quantity5) +
              "(" +
              (element.price * element.seasonalityProduct.may).toFixed(2) +
              "€)",
            (element.currentRealQuantity.quantity6 == null
              ? 0
              : element.currentRealQuantity.quantity6) +
              "(" +
              (element.price * element.seasonalityProduct.june).toFixed(2) +
              "€)",
            (element.currentRealQuantity.quantity7 == null
              ? 0
              : element.currentRealQuantity.quantity7) +
              "(" +
              (element.price * element.seasonalityProduct.july).toFixed(2) +
              "€)",
            (element.currentRealQuantity.quantity8 == null
              ? 0
              : element.currentRealQuantity.quantity8) +
              "(" +
              (element.price * element.seasonalityProduct.august).toFixed(2) +
              "€)",
            (element.currentRealQuantity.quantity9 == null
              ? 0
              : element.currentRealQuantity.quantity9) +
              "(" +
              (element.price * element.seasonalityProduct.september).toFixed(
                2
              ) +
              "€)",
            (element.currentRealQuantity.quantity10 == null
              ? 0
              : element.currentRealQuantity.quantity10) +
              "(" +
              (element.price * element.seasonalityProduct.october).toFixed(2) +
              "€)",
            (element.currentRealQuantity.quantity11 == null
              ? 0
              : element.currentRealQuantity.quantity11) +
              "(" +
              (element.price * element.seasonalityProduct.november).toFixed(2) +
              "€)",
            (element.currentRealQuantity.quantity12 == null
              ? 0
              : element.currentRealQuantity.quantity12) +
              "(" +
              (element.price * element.seasonalityProduct.december).toFixed(2) +
              "€)",
            (element.currentRealQuantity.quantity1 || 0) +
              (element.currentRealQuantity.quantity2 || 0) +
              (element.currentRealQuantity.quantity3 || 0) +
              (element.currentRealQuantity.quantity4 || 0) +
              (element.currentRealQuantity.quantity5 || 0) +
              (element.currentRealQuantity.quantity6 || 0) +
              (element.currentRealQuantity.quantity7 || 0) +
              (element.currentRealQuantity.quantity8 || 0) +
              (element.currentRealQuantity.quantity9 || 0) +
              (element.currentRealQuantity.quantity10 || 0) +
              (element.currentRealQuantity.quantity11 || 0) +
              (element.currentRealQuantity.quantity12 || 0) +
              "(" +
              (
                (element.currentRealQuantity.quantity1 *
                  element.price *
                  element.seasonalityProduct.january || 0) +
                (element.currentRealQuantity.quantity2 *
                  element.price *
                  element.seasonalityProduct.february || 0) +
                (element.currentRealQuantity.quantity3 *
                  element.price *
                  element.seasonalityProduct.march || 0) +
                (element.currentRealQuantity.quantity4 *
                  element.price *
                  element.seasonalityProduct.april || 0) +
                (element.currentRealQuantity.quantity5 *
                  element.price *
                  element.seasonalityProduct.may || 0) +
                (element.currentRealQuantity.quantity6 *
                  element.price *
                  element.seasonalityProduct.june || 0) +
                (element.currentRealQuantity.quantity7 *
                  element.price *
                  element.seasonalityProduct.july || 0) +
                (element.currentRealQuantity.quantity8 *
                  element.price *
                  element.seasonalityProduct.august || 0) +
                (element.currentRealQuantity.quantity9 *
                  element.price *
                  element.seasonalityProduct.september || 0) +
                (element.currentRealQuantity.quantity10 *
                  element.price *
                  element.seasonalityProduct.october || 0) +
                (element.currentRealQuantity.quantity11 *
                  element.price *
                  element.seasonalityProduct.november || 0) +
                (element.currentRealQuantity.quantity12 *
                  element.price *
                  element.seasonalityProduct.december || 0)
              ).toFixed(2) +
              "€)",
          ];
          rows.push(temp);
        }
      });

      doc.text(this.contractParam.endTxt, 20, pageHeight - 40, {});

      //     doc.text(this.contractParam.endTxt, 20, pageHeight - 15, {
      //   align: 'right'
      // })
      doc.text(
        "Fait à .................., le ......../......./.......",
        200,
        pageHeight - 30,
        {
          //   align: 'right'
        }
      );
      doc.text("Signature", 200, pageHeight - 23, {
        //   align: 'right'
      });

      JsPDFAutotable(doc, {
        head: [
          [
            "Légume",
            "Prix",
            "Condit#",
            "Jan",
            "Fev",
            "Mar",
            "Avr",
            "Mai",
            "Jui",
            "Jul",
            "Aou",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "Tot",
          ],
        ],
        margin: { top: 50 },
        styles: { fontSize: 7 },
        body: rows,
      }),
        doc.save(
          "Contrat_" +
            this.producers.find((item) => {
              if (item.value === this.producerId) {
                return item;
              }
            }).text +
            ".pdf"
        );
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

      this.gridOptions.columnApi.setColumnVisible(
        "quantityTheo1",
        this.contractParam.propositionColumn
      );
      this.gridOptions.columnApi.setColumnVisible(
        "quantityTheo2",
        this.contractParam.propositionColumn
      );
      this.gridOptions.columnApi.setColumnVisible(
        "quantityTheo3",
        this.contractParam.propositionColumn
      );
      this.gridOptions.columnApi.setColumnVisible(
        "quantityTheo4",
        this.contractParam.propositionColumn
      );
      this.gridOptions.columnApi.setColumnVisible(
        "quantityTheo5",
        this.contractParam.propositionColumn
      );
      this.gridOptions.columnApi.setColumnVisible(
        "quantityTheo6",
        this.contractParam.propositionColumn
      );
      this.gridOptions.columnApi.setColumnVisible(
        "quantityTheo7",
        this.contractParam.propositionColumn
      );
      this.gridOptions.columnApi.setColumnVisible(
        "quantityTheo8",
        this.contractParam.propositionColumn
      );
      this.gridOptions.columnApi.setColumnVisible(
        "quantityTheo9",
        this.contractParam.propositionColumn
      );
      this.gridOptions.columnApi.setColumnVisible(
        "quantityTheo10",
        this.contractParam.propositionColumn
      );
      this.gridOptions.columnApi.setColumnVisible(
        "quantityTheo11",
        this.contractParam.propositionColumn
      );
      this.gridOptions.columnApi.setColumnVisible(
        "quantityTheo12",
        this.contractParam.propositionColumn
      );
      this.gridApi.sizeColumnsToFit();
    },

    async fetchProductList() {
      let json = null;
      if(this.selectedProducer == null){
        json = await axios
        .get("/products")
        .then((response) => (this.requests = response.data));
      }else{
      json = await axios
        .get("/products?producerId=" + this.selectedProducer)
        .then((response) => (this.requests = response.data));
      }
      this.products = json;
      json.forEach((element) =>
        this.productList.push({ value: element.id, text: element.name })
      );
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

    async changeProducer(arg) {
      if (this.showUserBoard) {
        await axios
          .get("/producers/abr/" + this.currentUser.username)
          .then((response) => {
            this.requests = response.data;
          });
        arg = this.requests.id;
        this.selectedProducer = arg;
      }

      if (arg) {
        
          const json = await axios
            .get("/products?producerId=" + this.selectedProducer)
            .then((response) => (this.requests = response.data))
            .then((rowData) => (this.rowData = rowData));
          
          this.productsByProducer = json;
        this.producerId = arg;
        this.selectedProducer = this.producerId;
        this.products = [];
        (this.productList = [{ value: null, text: "Produits..." }]),
          this.fetchProductList();
      }
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
        const json = await axios
          .get("/products/producer/" + this.selectedProducer)
          .then((response) => (this.products = response.data))
          .then((rowData) => (this.rowData = rowData));
        this.productsByProducer = json;
      }
    },
    onCellClicked(params) {
      if (params.column.colId == "name") {
        this.productDetail = this.products[params.data.id - 1];
        this.$root.$emit("bv::show::modal", "product-detail-modal", "#btnShow");
      }
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
         resizable: true,
      },
      {
        headerName: "Condit#",
        field: "name",
        width: 80,
        pinned: "left",
        resizable: true,
        valueGetter: function (params) {
          if (params.data.productUnit != null) {
            if (params.data.compactDisplay) {
              return (
                params.data.nbByPackaging * params.data.quantity +
                params.data.productUnit.name
              );
            } else {
              return (
                params.data.nbByPackaging +
                "*" +
                params.data.quantity +
                params.data.productUnit.name
              );
            }
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
        width: 50,
        pinned: "left",
        resizable: true,
      },
      {
        headerName: "Janvier",
        children: [
          {
            field: "quantity1",
            headerName: "Cmd",
            editable: true,
            valueParser: numberParser,
            cellStyle: cellStyleJan,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.january == 1,
            valueGetter: function (params) {
              if (params.data.currentRealQuantity) {
                return params.data.currentRealQuantity.quantity1;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (valueChanged) {
                if (!params.data.currentRealQuantity) {
                  params.data.currentRealQuantity = {
                    id: params.data.id,
                    quantity1: newValInt,
                  };
                } else {
                  params.data.currentRealQuantity.quantity1 = newValInt;
                }
              }
              return valueChanged;
            },
            width: 70,
          },
          {
            field: "quantityTheo1",
            headerName: "Prop",
            editable: false,
            valueParser: numberParser,
            cellStyle: cellStyleJan,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.january == 1,
            valueGetter: function (params) {
              if (params.data.quantities[0] && params.data.quantities[0].quantity1) {
                return params.data.quantities[0].quantity1;
              }
            },
            width: 70,
          },
        ],
      },
      {
        headerName: "Février",
        children: [
          {
            field: "quantity2",
            headerName: "Cmd",
            editable: true,
            valueParser: numberParser,
            cellStyle: cellStyleFeb,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.february == 1,
            valueGetter: function (params) {
              if (params.data.currentRealQuantity) {
                return params.data.currentRealQuantity.quantity2;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (params.data.b !== newValInt) {
                if (!params.data.currentRealQuantity) {
                  params.data.currentRealQuantity = {
                    id: params.data.id,
                    quantity2: newValInt,
                  };
                } else {
                  params.data.currentRealQuantity.quantity2 = newValInt;
                }
              }
              return valueChanged;
            },
            width: 70,
          },
          {
            field: "quantityTheo2",
            headerName: "Prop",
            editable: false,
            valueParser: numberParser,
            cellStyle: cellStyleFeb,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.february == 1,
            valueGetter: function (params) {
              if (params.data.quantities[0] && params.data.quantities[0].quantity2) {
                return params.data.quantities[0].quantity2;
              }
            },
            width: 70,
          },
        ],
      },
      {
        headerName: "Mars",
        children: [
          {
            field: "quantity3",
            headerName: "Cmd",
            editable: true,
            valueParser: numberParser,
            cellStyle: cellStyleMar,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.march == 1,
            valueGetter: function (params) {
              if (params.data.currentRealQuantity) {
                return params.data.currentRealQuantity.quantity3;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (!params.data.currentRealQuantity) {
                params.data.currentRealQuantity = {
                  id: params.data.id,
                  quantity3: newValInt,
                };
              } else {
                params.data.currentRealQuantity.quantity3 = newValInt;
              }
              return valueChanged;
            },
            width: 70,
          },
          {
            field: "quantityTheo3",
            headerName: "Prop",
            editable: false,
            valueParser: numberParser,
            cellStyle: cellStyleMar,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.march == 1,
            valueGetter: function (params) {
              if (params.data.quantities[0] && params.data.quantities[0].quantity3) {
                return params.data.quantities[0].quantity3;
              }
            },
            width: 70,
          },
        ],
      },
      {
        headerName: "Avril",
        children: [
          {
            field: "quantity4",
            headerName: "Cmd",
            editable: true,
            valueParser: numberParser,
            cellStyle: cellStyleApr,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.april == 1,
            valueGetter: function (params) {
              if (params.data.currentRealQuantity) {
                return params.data.currentRealQuantity.quantity4;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (!params.data.currentRealQuantity) {
                params.data.currentRealQuantity = {
                  id: params.data.id,
                  quantity4: newValInt,
                };
              } else {
                params.data.currentRealQuantity.quantity4 = newValInt;
              }
              return valueChanged;
            },
            width: 70,
          },
          {
            field: "quantityTheo4",
            headerName: "Prop",
            editable: false,
            valueParser: numberParser,
            cellStyle: cellStyleApr,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.april == 1,
            valueGetter: function (params) {
              if (params.data.quantities[0] && params.data.quantities[0].quantity4) {
                return params.data.quantities[0].quantity4;
              }
            },
            width: 70,
          },
        ],
      },
      {
        headerName: "Mai",
        children: [
          {
            field: "quantity5",
            headerName: "Cmd",
            editable: true,
            valueParser: numberParser,
            cellStyle: cellStyleMay,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.may == 1,
            valueGetter: function (params) {
              if (params.data.currentRealQuantity) {
                return params.data.currentRealQuantity.quantity5;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (!params.data.currentRealQuantity) {
                params.data.currentRealQuantity = {
                  id: params.data.id,
                  quantity5: newValInt,
                };
              } else {
                params.data.currentRealQuantity.quantity5 = newValInt;
              }
              return valueChanged;
            },
            width: 70,
          },
          {
            field: "quantityTheo5",
            headerName: "Prop",
            editable: false,
            valueParser: numberParser,
            cellStyle: cellStyleMay,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.may == 1,
            valueGetter: function (params) {
              if (params.data.quantities[0] && params.data.quantities[0].quantity5) {
                return params.data.quantities[0].quantity5;
              }
            },
            width: 70,
          },
        ],
      },
      {
        headerName: "Juin",
        children: [
          {
            field: "quantity6",
            headerName: "Cmd",
            editable: true,
            valueParser: numberParser,
            cellStyle: cellStyleJun,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.june == 1,
            valueGetter: function (params) {
              if (params.data.currentRealQuantity) {
                return params.data.currentRealQuantity.quantity6;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (!params.data.currentRealQuantity) {
                params.data.currentRealQuantity = {
                  id: params.data.id,
                  quantity6: newValInt,
                };
              } else {
                params.data.currentRealQuantity.quantity6 = newValInt;
              }
              return valueChanged;
            },
            width: 70,
          },
          {
            field: "quantityTheo6",
            headerName: "Prop",
            editable: false,
            valueParser: numberParser,
            cellStyle: cellStyleJun,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.june == 1,
            valueGetter: function (params) {
              if (params.data.quantities[0] && params.data.quantities[0].quantity6) {
                return params.data.quantities[0].quantity6;
              }
            },
            width: 70,
          },
        ],
      },
      {
        headerName: "Juillet",
        children: [
          {
            field: "quantity7",
            headerName: "Cmd",
            editable: true,
            valueParser: numberParser,
            cellStyle: cellStyleJul,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.july == 1,
            valueGetter: function (params) {
              if (params.data.currentRealQuantity) {
                return params.data.currentRealQuantity.quantity7;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (!params.data.currentRealQuantity) {
                params.data.currentRealQuantity = {
                  id: params.data.id,
                  quantity7: newValInt,
                };
              } else {
                params.data.currentRealQuantity.quantity7 = newValInt;
              }
              return valueChanged;
            },
            width: 70,
          },
          {
            field: "quantityTheo7",
            headerName: "Prop",
            editable: false,
            valueParser: numberParser,
            cellStyle: cellStyleJul,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.july == 1,
            valueGetter: function (params) {
              if (params.data.quantities[0] && params.data.quantities[0].quantity7) {
                return params.data.quantities[0].quantity7;
              }
            },
            width: 70,
          },
        ],
      },
      {
        headerName: "Août",
        children: [
          {
            field: "quantity8",
            headerName: "Cmd",
            editable: true,
            valueParser: numberParser,
            cellStyle: cellStyleAug,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.august == 1,
            valueGetter: function (params) {
              if (params.data.currentRealQuantity) {
                return params.data.currentRealQuantity.quantity8;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (!params.data.currentRealQuantity) {
                params.data.currentRealQuantity = {
                  id: params.data.id,
                  quantity8: newValInt,
                };
              } else {
                params.data.currentRealQuantity.quantity8 = newValInt;
              }
              return valueChanged;
            },
            width: 70,
          },
          {
            field: "quantityTheo8",
            headerName: "Prop",
            editable: false,
            valueParser: numberParser,
            cellStyle: cellStyleAug,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.august == 1,
            valueGetter: function (params) {
              if (params.data.quantities[0] && params.data.quantities[0].quantity8) {
                return params.data.quantities[0].quantity8;
              }
            },
            width: 70,
          },
        ],
      },
      {
        headerName: "Septembre",
        children: [
          {
            field: "quantity9",
            headerName: "Cmd",
            editable: true,
            valueParser: numberParser,
            cellStyle: cellStyleSep,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.september == 1,
            valueGetter: function (params) {
              if (params.data.currentRealQuantity) {
                return params.data.currentRealQuantity.quantity9;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (!params.data.currentRealQuantity) {
                params.data.currentRealQuantity = {
                  id: params.data.id,
                  quantity9: newValInt,
                };
              } else {
                params.data.currentRealQuantity.quantity9 = newValInt;
              }
              return valueChanged;
            },
            width: 70,
          },
          {
            field: "quantityTheo9",
            headerName: "Prop",
            editable: false,
            valueParser: numberParser,
            cellStyle: cellStyleSep,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.september == 1,
            valueGetter: function (params) {
              if (params.data.quantities[0] && params.data.quantities[0].quantity9) {
                return params.data.quantities[0].quantity9;
              }
            },
            width: 70,
          },
        ],
      },
      {
        headerName: "Octobre",
        children: [
          {
            field: "quantity10",
            headerName: "Cmd",
            editable: true,
            valueParser: numberParser,
            cellStyle: cellStyleOct,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.october == 1,
            valueGetter: function (params) {
              if (params.data.currentRealQuantity) {
                return params.data.currentRealQuantity.quantity10;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (!params.data.currentRealQuantity) {
                params.data.currentRealQuantity = {
                  id: params.data.id,
                  quantity10: newValInt,
                };
              } else {
                params.data.currentRealQuantity.quantity10 = newValInt;
              }
              return valueChanged;
            },
            width: 70,
          },
          {
            field: "quantityTheo10",
            headerName: "Prop",
            editable: false,
            valueParser: numberParser,
            cellStyle: cellStyleOct,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.october == 1,
            valueGetter: function (params) {
              if (params.data.quantities[0] && params.data.quantities[0].quantity10) {
                return params.data.quantities[0].quantity10;
              }
            },
            width: 70,
          },
        ],
      },
      {
        headerName: "Novembre",
        children: [
          {
            field: "quantity11",
            headerName: "Cmd",
            editable: true,
            valueParser: numberParser,
            cellStyle: cellStyleNov,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.november == 1,
            valueGetter: function (params) {
              if (params.data.currentRealQuantity) {
                return params.data.currentRealQuantity.quantity11;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (!params.data.currentRealQuantity) {
                params.data.currentRealQuantity = {
                  id: params.data.id,
                  quantity11: newValInt,
                };
              } else {
                params.data.currentRealQuantity.quantity11 = newValInt;
              }
              return valueChanged;
            },
            width: 70,
          },
          {
            field: "quantityTheo11",
            headerName: "Prop",
            editable: false,
            valueParser: numberParser,
            cellStyle: cellStyleNov,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.november == 1,
            valueGetter: function (params) {
              if (params.data.quantities[0] && params.data.quantities[0].quantity11) {
                return params.data.quantities[0].quantity11;
              }
            },
            width: 70,
          },
        ],
      },
      {
        headerName: "Décembre",
        children: [
          {
            field: "quantity12",
            headerName: "Cmd",
            editable: true,
            valueParser: numberParser,
            cellStyle: cellStyleDec,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.december == 1,
            valueGetter: function (params) {
              if (params.data.currentRealQuantity) {
                return params.data.currentRealQuantity.quantity12;
              }
            },
            valueSetter: function (params) {
              var newValInt = parseInt(params.newValue);
              var valueChanged = params.data.b !== newValInt;
              if (!params.data.currentRealQuantity) {
                params.data.currentRealQuantity = {
                  id: params.data.id,
                  quantity12: newValInt,
                };
              } else {
                params.data.currentRealQuantity.quantity12 = newValInt;
              }
              return valueChanged;
            },
            width: 70,
          },
          {
            field: "quantityTheo12",
            headerName: "Prop",
            editable: false,
            valueParser: numberParser,
            cellStyle: cellStyleDec,
            resizable: true,
            suppressNavigable:(params) => params.data.seasonalityProduct.december == 1,
            valueGetter: function (params) {
              if (params.data.quantities[0] && params.data.quantities[0].quantity12) {
                return params.data.quantities[0].quantity12;
              }
            },
            width: 70,
          },
        ],
      },
      {
        headerName: "Qte Tot",
        width: 90,
        pinned: "right",
        valueGetter: function (params) {
          if (!params.data.currentRealQuantity) return 0;
          return (
            (params.data.currentRealQuantity.quantity1 || 0) +
            (params.data.currentRealQuantity.quantity2 || 0) +
            (params.data.currentRealQuantity.quantity3 || 0) +
            (params.data.currentRealQuantity.quantity4 || 0) +
            (params.data.currentRealQuantity.quantity5 || 0) +
            (params.data.currentRealQuantity.quantity6 || 0) +
            (params.data.currentRealQuantity.quantity7 || 0) +
            (params.data.currentRealQuantity.quantity8 || 0) +
            (params.data.currentRealQuantity.quantity9 || 0) +
            (params.data.currentRealQuantity.quantity10 || 0) +
            (params.data.currentRealQuantity.quantity11 || 0) +
            (params.data.currentRealQuantity.quantity12 || 0)
          );
        },
      },

      {
        headerName: "Prix Tot",
        width: 90,
        pinned: "right",
        valueGetter: function (params) {
          if (!params.data.currentRealQuantity) return 0;
          return (
            (
              (params.data.currentRealQuantity.quantity1 *
                params.data.price *
                params.data.seasonalities[
                  params.data.seasonalityProduct.january - 1
                ].percent || 0) +
              (params.data.currentRealQuantity.quantity2 *
                params.data.price *
                params.data.seasonalities[
                  params.data.seasonalityProduct.february - 1
                ].percent || 0) +
              (params.data.currentRealQuantity.quantity3 *
                params.data.price *
                params.data.seasonalities[
                  params.data.seasonalityProduct.march - 1
                ].percent || 0) +
              (params.data.currentRealQuantity.quantity4 *
                params.data.price *
                params.data.seasonalities[
                  params.data.seasonalityProduct.april - 1
                ].percent || 0) +
              (params.data.currentRealQuantity.quantity5 *
                params.data.price *
                params.data.seasonalities[
                  params.data.seasonalityProduct.may - 1
                ].percent || 0) +
              (params.data.currentRealQuantity.quantity6 *
                params.data.price *
                params.data.seasonalities[
                  params.data.seasonalityProduct.june - 1
                ].percent || 0) +
              (params.data.currentRealQuantity.quantity7 *
                params.data.price *
                params.data.seasonalities[
                  params.data.seasonalityProduct.july - 1
                ].percent || 0) +
              (params.data.currentRealQuantity.quantity8 *
                params.data.price *
                params.data.seasonalities[
                  params.data.seasonalityProduct.august - 1
                ].percent || 0) +
              (params.data.currentRealQuantity.quantity9 *
                params.data.price *
                params.data.seasonalities[
                  params.data.seasonalityProduct.september - 1
                ].percent || 0) +
              (params.data.currentRealQuantity.quantity10 *
                params.data.price *
                params.data.seasonalities[
                  params.data.seasonalityProduct.october - 1
                ].percent || 0) +
              (params.data.currentRealQuantity.quantity11 *
                params.data.price *
                params.data.seasonalities[
                  params.data.seasonalityProduct.november - 1
                ].percent || 0) +
              (params.data.currentRealQuantity.quantity12 *
                params.data.price *
                params.data.seasonalities[
                  params.data.seasonalityProduct.december - 1
                ].percent || 0)
            ).toFixed(2) + "€"
          );
        },
      },
    ];
  },
};
window.numberParser = function numberParser(params) {
  return Number(params.newValue);
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
    return "#fff";
  } else if (val === 2) {
    return "#28a745";
  } else if (val === 3) {
    return "#17a2b8";
  } else if (val === 4) {
    return "#ffc107";
  } else {
    return "#dc3545";
  }
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

.my-legend {
  height: 50px;
}

#my-legend .legend-title {
  text-align: left;

  font-weight: bold;
  font-size: 90%;
}
#my-legend ul {
  float: left;
  list-style: none;
}
#my-legend ul li {
  list-style: none;

  margin-left: 5px;
}
#my-legend ul li span {
  float: left;
  height: 16px;
  width: 30px;
  margin-right: 5px;

  border: 1px solid #999;
}

.card-body {
  padding: 0.4rem;
  font-size: 80%;
}
</style>