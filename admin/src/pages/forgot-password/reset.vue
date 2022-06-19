<template>
  <div class="wrapper d-flex flex-column justify-center align-center pa-4">
    <FormResetPassword :token="token" />
  </div>
</template>

<script>
import { page } from "~/mixins";
export default {
  mixins: [page],
  auth: "guest",
  layout: "external",
  async asyncData({ $axios, route, error }) {
    try {
      await $axios.$get("/auth/verify-token", {
        params: {
          token: route.query.token,
          type: "resetPassword",
        },
      });
      return {
        token: route.query.token,
      };
    } catch (e) {
      error(e);
    }
  },
  computed: {
    title() {
      return this.$t("page.changePassword.title");
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
}
</style>
