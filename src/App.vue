
<template>
  <div id="app">
    <div id="nav">
      <top-header></top-header>
    </div>
    <div style="height: 90%">
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

<style  scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  height: 100%;
  padding: 0;
}
</style>
