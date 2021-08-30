<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
    
        <!--
        
        <b-nav-item href="/request">Demande</b-nav-item>
        -->
        <b-nav-item href="/theoretical">Théorique</b-nav-item>
         <b-nav-item-dropdown text="Contrats" right>
          <b-dropdown-item href="/producer">Par Producteur</b-dropdown-item>
            <b-dropdown-item href="/product">Par Produit</b-dropdown-item>
        </b-nav-item-dropdown>
 
        <b-nav-item href="/season">Saisons</b-nav-item>
      
        <!-- Navbar dropdowns 
        <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">FR</b-dropdown-item>
        </b-nav-item-dropdown>-->

        <!-- 
        <b-nav-item-dropdown text="User" right>
          <b-dropdown-item href="#">Account</b-dropdown-item>
          <b-dropdown-item href="#">Settings</b-dropdown-item>
        </b-nav-item-dropdown>
        -->
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>


export default {
  
};
</script>

<style scoped>
</style>

