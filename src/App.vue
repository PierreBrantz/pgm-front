
<template>
  <div id="app">
    <div id="nav">
      <top-header></top-header>
    </div>
    <div style="height: 100%">
      <router-view />
    </div>
  </div>
</template>

<script>
import TopHeader from "@/components/TopHeader.vue";
export default {
  components: {
    "top-header": TopHeader,
  },
};
</script>

<style >
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  height: 99%;
  padding-bottom: 55px;
  
}
</style>
