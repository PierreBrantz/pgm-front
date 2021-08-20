<template>
  <b-modal id="modal-request" :hide-footer=true title="Ajout d'une demande">
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <b-row class="m-1">
          <b-col sm="3">
            <label>Nom :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="productNameId"
              v-model="form.name"              
              size="sm"
            ></b-form-input>            
          </b-col>
        </b-row>
        <b-row class="m-1">
          <b-col sm="3">
            <label>Quantité :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="quantityId"
              v-model="form.quantity"
              type="number"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="m-1">
          <b-col sm="3">
            <label>Unité :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="unitId"
              v-model="form.unit"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
         <b-row class="m-1">
          <b-col sm="3">
            <label>Début de période :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="startPeriodId"
              v-model="form.startPeriod"
              type="date"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="m-1">
          <b-col sm="3">
            <label>Fin de période :</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="endPeriodId"
              v-model="form.endPeriod"
              type="date"
              size="sm"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-button class="m-3" type="submit" variant="primary"
              >Sauver</b-button
            >
            <b-button class="m-3" type="reset" variant="danger"
              >Annuler</b-button
            >
 
          
      </b-form>
      
    </b-container>
    
  </b-modal>
  
</template>

<script>

export default {
  components: {    
    
},
  props: [],
  data() {
    return {
      
      form:[{name:"", quantity: 0, unit: "", startPeriod: null, endPeriod: null}]
 
    }
  },
    methods: {
    onSubmit(event) {    
      this.$store.dispatch("created",{request : this.form});       
      event.preventDefault();
      this.$bvModal.hide('modal-request');
    }, 
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide('modal-request');
     }   
  },
};
</script>

<style>
</style>