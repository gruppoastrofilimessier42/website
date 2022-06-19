<template>
  <LayoutGeneric>
    <EntityUserForm :user="user" />
  </LayoutGeneric>
</template>

<script lang="ts">
import Vue from "vue";
import page from "@/mixins/page";
import UserService from "~/services/UserService";

export default Vue.extend({
  name: "GamEditUserPage",
  mixins: [page],
  async asyncData({ route }) {
    const user = await UserService.get(parseInt(route.params.id));
    return { user };
  },
  computed: {
    title() {
      return this.$t(`page.users.edit.title`);
    },
    allowBack() {
      return true;
    },
  },
});
</script>
