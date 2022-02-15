<template>
  <b-modal id="season-name-modal" :hide-footer="true" title="Nom de saison">
    <b-container fluid>
      <b-form @submit="onSubmit" @reset="onCancel">
        <b-row>
          <b-col>
            <b-form-input v-model="seasons[seasonId - 1].name"></b-form-input>
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
  methods: {
    onSubmit(event) {
      event.preventDefault();
      axios.post("/seasons", this.seasons);

      this.$bvModal.hide("season-name-modal");
    },
    onCancel(event) {
      event.preventDefault();
      this.$bvModal.hide("season-name-modal");
    },
  },
};
</script>

<style>
</style>