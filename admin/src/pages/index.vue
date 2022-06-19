<template>
  <LayoutGeneric>
    <!-- <div class="d-flex justify-end">
      <v-card flat outlined width="350">
        <v-container class="d-flex justify-space-around align-center">
          <v-avatar tile>
            <img :src="require('~/assets/images/logo.svg')" />
          </v-avatar>
          <span class="font-weight-bold text--secondary text-h6"> {{ $t("app.name") }}</span>
        </v-container>
      </v-card>
    </div> -->
  </LayoutGeneric>
</template>

<script lang="ts">
import Vue from "vue";
import { page } from "@/mixins";

export default Vue.extend({
  mixins: [page],

  computed: {
    title() {
      return this.$t("page.dashboard.welcome");
    },
  },
});
</script>
