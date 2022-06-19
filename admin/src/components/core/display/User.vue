<template>
  <v-chip outlined>
    <v-icon left> mdi-account-outline </v-icon>
    {{ `${user.prompt}` }}
  </v-chip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
});
</script>
