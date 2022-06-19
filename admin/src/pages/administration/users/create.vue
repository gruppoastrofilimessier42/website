<template>
  <LayoutGeneric>
    <EntityUserForm />
  </LayoutGeneric>
</template>

<script lang="ts">
import Vue from "vue";
import page from "@/mixins/page";

export default Vue.extend({
  mixins: [page],
  computed: {
    title() {
      return this.$t(`page.users.create.title`);
    },
    allowBack() {
      return true;
    },
  },
});
</script>
