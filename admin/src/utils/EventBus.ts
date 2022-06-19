import Vue from "vue";

const EventBus = new Vue({
  computed: {
    events() {
      return ["current-project:unset"];
    },
  },
});
export default EventBus;
