<template>
  <b-container fluid>
    <b-row>
      <b-col class="col-md-12 col-sm-12 col-xs-12">
        <div>
        <h3> <b-icon @click.prevent="setPreviousMonth()" icon="caret-left" aria-hidden="true"></b-icon> 
              Demandes pour {{getMonthName(currentMonth)}}  
              <b-icon @click.prevent="setNextMonth()" icon="caret-right" aria-hidden="true"></b-icon>
        </h3>
  
        </div>
        <br>
        <div align="left" v-for="request in requests" :key="request.id">
            {{ request.name }} : {{ request.quantity }} {{ request.unit }}
            <b-icon @click.prevent="remove(request)" icon="trash" aria-hidden="true"></b-icon>
        </div>
       
      
       <b-button class="m-3" @click="onClick" variant="primary"
              >Ajouter une demande</b-button
            >
             <request-modal></request-modal>
      </b-col>
    </b-row>
     
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex';
import RequestModal from "./AddProducer.vue";

export default {
  components: {   
    "request-modal": RequestModal,
  },
  data() {
    return {
      form:[{name:"", quantity: 0, startPeriod: null, endPeriod: null}],
      currentMonth: 0
    };
  },
  computed:{ 
  ...mapGetters(["requests"])
    },
  mounted() { 
    this.fetchRequests();
    this.currentMonth = this.getCurrentMonth();
   
  },
  methods: {
    async fetchRequests(){   
     await this.$store.dispatch("fetchRequests",{month : this.getCurrentMonth()}); 
    },

    getCurrentMonth: function(){    
      const date = new Date();
      return date.getMonth();
    },
    getMonthName: function(index) {

      const months    = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    
      return months[index];
    },
    setNextMonth(){
      this.currentMonth = this.currentMonth + 1;
       this.$store.dispatch("fetchRequests",{month : this.currentMonth});
    },
    setPreviousMonth(){
      this.currentMonth = this.currentMonth - 1;
       this.$store.dispatch("fetchRequests",{month : this.currentMonth});
    },

    onClick: function (arg) {
      this.$root.$emit("bv::show::modal", "modal-request", "#btnShow");
    },
    remove: function(request){
      this.$store.dispatch("deleteRequest",{request : request});  
    }
  
  }
};
</script>

<style>
</style>