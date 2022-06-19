<template>
  <div class="wrapper d-flex flex-column justify-center align-center pa-4">
    <v-card class="error-card pa-1" elevation="12">
      <v-card-title class="flex-column justify-center text-h4">
        <div class="mb-4"><v-icon color="primary" size="128">mdi-alert-outline</v-icon></div>
        <div class="text-center">{{ errorMessage }}</div>
      </v-card-title>
      <v-card-text class="text-center">
        {{ descriptionMessage }}
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn block to="/" color="primary">{{ $t("error.page.backHome") }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { page } from "~/mixins";

export default {
  mixins: [page],
  layout: "external",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  computed: {
    title() {
      return this.errorMessage;
    },
    errorMessage() {
      if (this.error.statusCode === 404) {
        return this.$t("error.page.pageNotFound.title");
      }
      return this.$t("error.page.genericError.title");
    },
    descriptionMessage() {
      if (this.error.statusCode === 404) {
        return this.$t("error.page.pageNotFound.description");
      }
      return this.$t("error.page.genericError.description");
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
}
.error-card {
  max-width: 400px;
  width: 100%;
}
</style>
