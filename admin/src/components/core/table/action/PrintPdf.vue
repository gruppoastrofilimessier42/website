<template>
  <v-tooltip bottom>
    <template #activator="{ on: tooltipOn, attrs: tooltipAttrs }">
      <v-btn
        :loading="loading"
        icon
        v-bind="{ ...tooltipAttrs, ...$attrs }"
        @click="downloadPdf()"
        v-on="{ ...tooltipOn, ...$listeners }"
      >
        <v-icon>mdi-file-pdf-box</v-icon>
      </v-btn>
    </template>
    <span v-if="label">{{ $t("table.actions.downloadWithName", { item: label }) }}</span>
    <span v-else>{{ $t("table.actions.download") }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    item: {
      type: Object,
      required: false,
      default: undefined,
    },
    label: {
      type: String,
      default: undefined,
    },
    property: {
      type: String,
      default: undefined,
    },
    url: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      loading: false,
    };
  },

  methods: {
    async downloadPdf() {
      try {
        this.loading = true;
        const response = await this.$axios.get(this.url ?? `${this.item[this.property ?? "url"]}/pdf`, {
          responseType: "blob",
        });
        this.$utils.file.downloadItem(response);
      } catch {
        this.$notifier.showErrorMessage(this.$t("pages.error.downloadError.description") as string);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
