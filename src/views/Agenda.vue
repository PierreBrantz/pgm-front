<template>
  <b-container fluid>
    <b-row>
      <b-col class="col-md-10 col-sm-10 col-xs-10">
        <full-calendar :options="calendarOptions" />
        <product-modal :eventDate="event"></product-modal>
      </b-col>
      <b-col class="col-md-2 col-sm-2 col-xs-2">
        <sidebar></sidebar>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import Sidebar from "../components/Sidebar.vue";
import ProductModal from "./AddProduct.vue";

export default {
  components: {
    FullCalendar,
    sidebar: Sidebar,
    "product-modal": ProductModal,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin],
        headerToolbar: {
          start: "title",
          end: "dayGridWeek dayGridMonth today prev,next",
        },
        buttonText: {
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaines"
        },
        initialView: "dayGridWeek",
        selectable: true,
        select: this.handleSelect,
        eventClick: this.handleClick,
        events: this.$store.getters.getEvents,
        locale: "fr",
        firstDay: 1,
      },
      event: Object,
    };
  },
  computed: {},
  methods: {
    handleSelect: function (arg) {
      this.$store.commit("ADD_EVENT", {
        id: new Date().getTime(),
        title: "Non Défini",
        start: arg.start,
        end: arg.end,
        allDay: arg.allDay,
        droppable: true,
      });
    },
    handleClick: function (arg) {
      this.event = arg.event;
      this.$root.$emit("bv::show::modal", "modal-product", "#btnShow");
    },
  },
};
</script>