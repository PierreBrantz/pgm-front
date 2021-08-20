<template>
  <b-modal id="modal-product" :hide-footer=true title="Encodage d'un produit">
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <b-row class="m-1">
          <b-col sm="3">
            <label>Nom :</label>
          </b-col>
          <b-col sm="9">
            <b-form-select
              id="productNameId"
              v-model="form.name"
              :options="options"
              size="sm"
            ></b-form-select>
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
            <label>Couleur :</label>
          </b-col>
           <b-col sm="9">
            <color-picker-select></color-picker-select>
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
    <div>
      <b-alert
      :show="dismissCountDown"
      dismissible
      variant="success"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      <p>{{ form.name }} ajouté avec succès</p>     
    </b-alert>
    </div>
  </b-modal>
  
</template>

<script>
import ColorPickerSelect from '../components/ColorPickerSelect.vue'
export default {
  components: {    
    "color-picker-select": ColorPickerSelect
},
  props: ['eventDate'],
  data() {
    return {
      selected: null,
      options: this.$store.getters.getProductsForSelect,
      form:[{name:"", quantity: 0}],
      dismissSecs: 2,
      dismissCountDown: 0,
    }
  },
    methods: {
    onSubmit(event) {
      event.preventDefault();   
      this.$store.commit("UPDATE_EVENT",
           {
            id: this.eventDate.id,
            title: this.form.name,            
            backgroundColor: '#378006'
            
          });
          this.$bvModal.hide('modal-1');
    }, 
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide('modal-1');
     },
     countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
    showAlert() {
        this.dismissCountDown = this.dismissSecs
      }
    
  },
};
</script>

<style>
</style>