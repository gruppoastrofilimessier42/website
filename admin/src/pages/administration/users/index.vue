<template>
  <EntityUserTable :options.sync="status.options" :filters.sync="status.filters" />
</template>

<script lang="ts">
import Vue from "vue";
import { page, status } from "@/mixins";

export default Vue.extend({
  mixins: [status, page],
  data() {
    return {
      status: {
        filters: {},
        options: {},
      },
    };
  },
  computed: {
    title() {
      return this.$t("page.users.home.title");
    },
  },
});
</script>
