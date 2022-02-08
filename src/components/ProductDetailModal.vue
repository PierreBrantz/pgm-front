<template>
  <b-modal id="product-detail-modal" :hide-footer="true" 
   :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
  title="Détails">
    <b-container fluid>
      <div v-if="productDetail">
        <b-row class="mb-1">
          <b-col cols="6">Nom:</b-col>
          <b-col cols="6">{{ productDetail.name }}</b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">Type:</b-col>
          <b-col cols="6">{{ productDetail.productType.name  }}</b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">Famille:</b-col>
          <b-col cols="6">{{ productDetail.productFamily.name }}</b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">Unité:</b-col>
          <b-col cols="6">{{ productDetail.productUnit.name }}</b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">Label:</b-col>
          <b-col cols="6">{{ productDetail.productLabel.name  }}</b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">Calibrage:</b-col>
          <b-col cols="6">{{ productDetail.calibration }}</b-col>
        </b-row>
         <b-row class="mb-1">
          <b-col cols="6">Format de vente:</b-col>
          <b-col cols="6">{{ productDetail.salesFormat }}</b-col>
        </b-row>
         <b-row class="mb-1">
          <b-col cols="6">Emballage:</b-col>
          <b-col cols="6">{{ productDetail.packaging.name }}</b-col>
        </b-row>
         <b-row class="mb-1">
          <b-col cols="6">Nombre d'unité:</b-col>
          <b-col cols="6">{{ productDetail.nbByPackaging }}</b-col>
        </b-row>
         <b-row class="mb-1">
          <b-col cols="6">Origine:</b-col>
          <b-col cols="6">{{ productDetail.productOrigin.name }}</b-col>
        </b-row>
         <b-row class="mb-1">
          <b-col cols="6">Coiffe:</b-col>
          <b-col cols="6">{{ productDetail.cap ? "Oui" : "Non"  }}</b-col>
        </b-row>
         <b-row class="mb-1">
          <b-col cols="6">Fragile:</b-col>
          <b-col cols="6">{{ productDetail.fragil ? "Oui" : "Non" }}</b-col>
        </b-row>
      </div>

    </b-container>
  </b-modal>
</template>

<script>

export default {
  components: {},
  props: ["productDetail"],
  data() {
    return {
       headerBgVariant: 'dark',
        headerTextVariant: 'light',
    };
  },
  mounted() {},

};
</script>

<style>
</style>