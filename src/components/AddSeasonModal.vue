<template>
  <b-modal id="add-season-modal" :hide-footer="true" title="Nom de saison">
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <b-row>
          <b-col>
            <b-form-input v-model="newName"></b-form-input>
          </b-col>
        </b-row>

        <b-button class="m-3" type="submit" variant="primary">Sauver</b-button>
        <b-button class="m-3" type="reset" variant="danger">Annuler</b-button>
      </b-form>
    </b-container>
  </b-modal>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  props: ["seasonId", "seasons"],
  data() {
    return {
      newName: "",
      seasonsTmp: null,
      newSeason: null,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.seasons.push({          
          name: this.newName,
          percent: 1,
        });
      axios.post("/seasons", this.seasons).then((response) => {
        this.seasons.splice(this.seasons.length - 1, 1);
        this.seasons.push({
          id: response.data[response.data.length - 1].id,
          name: this.newName,
          percent: 1,
        });
      });
      this.$bvModal.hide("add-season-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("add-season-modal");
    },
  },
};
</script>

<style>
</style>