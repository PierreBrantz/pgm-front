<template>
   <div>
 
    <b-card>
      <p class="card-text">Récap mois de {{ getCurrentMonth() }}</p>
    <month-recap></month-recap>
    </b-card>
  
  </div>
</template>


<script>
import MonthRecap from './MonthRecap.vue' 
export default {
components: {    
    "month-recap": MonthRecap
},

methods: {    
    getCurrentMonth: function() {
        const date = new Date();
        return date.toLocaleString('fr', { month: 'long' });
    }
}
}
</script>

<style>

</style>