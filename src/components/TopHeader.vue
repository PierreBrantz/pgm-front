<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand href="#">Collectif 5C</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item v-if="showAdminBoard" href="/theoretical"
          >Théorique</b-nav-item
        >
       
        <b-nav-item-dropdown v-if="showAdminBoard" text="Contrats">

          <b-dropdown-item href="/producer">Par Producteur</b-dropdown-item>
          <b-dropdown-item  href="/product">Par Produit</b-dropdown-item>
        
        </b-nav-item-dropdown>

        <b-nav-item v-if="showUserBoard" href="/producer">Contrat</b-nav-item >

        <b-nav-item href="/season" v-if="showAdminBoard">Saisons</b-nav-item>
        
        <b-nav-item href="/weeklyPlanner" v-if="showAdminBoard">Semainier</b-nav-item>

        <b-nav-item-dropdown text="Paramètres" v-if="showAdminBoard">
          <b-dropdown-item href="/addproducer">Création Producteur</b-dropdown-item>
          <b-dropdown-item href="/addproduct">Création Produit</b-dropdown-item>
          <b-dropdown-item href="/editproduct">Edition Produit</b-dropdown-item>
          <b-dropdown-item href="/paramcontract">Contrat</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item v-if="!currentUser" href="/register" right
          ><b-icon icon="person-fill"></b-icon> Sign Up</b-nav-item
        >
        <b-nav-item v-if="!currentUser" href="/login" right>
          <b-icon icon="box-arrow-in-right"></b-icon> Login</b-nav-item
        >

        <b-nav-item v-if="currentUser" href="/profile"><b-icon icon="person-fill"></b-icon> {{
          currentUser.username
        }}</b-nav-item>
        <b-nav-item v-if="currentUser" @click.prevent="logOut"
          ><b-icon icon="box-arrow-right"></b-icon> LogOut</b-nav-item
        >
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {
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
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
</style>

