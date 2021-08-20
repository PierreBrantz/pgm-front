<template>
  <div align="left">
       <b-form-select v-model="selected" :options="options" size="sm" class="mt-3"></b-form-select>
        <!--<div  class="mt-3">Encodé: {{ selected }}</div>-->
        <div  class="mt-3">Prévu: 50</div>
        <div  class="mt-3">Encodé: 32</div>
        <div  class="mt-3">Validé: 12</div>
        <div  class="mt-3">Reporté: 0</div>
  </div>
</template>

<script>
export default {
data() {
      return {
        selected: null,
        options: this.$store.getters.getProductsForSelect,
      }
    }
}
</script>

