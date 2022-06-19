<template>
  <v-tooltip bottom>
    <template #activator="{ on: tooltipOn, attrs: tooltipAttrs }">
      <v-btn
        :loading="loading"
        icon
        v-bind="{ ...tooltipAttrs, ...$attrs }"
        @click="downloadItem()"
        v-on="{ ...tooltipOn, ...$listeners }"
      >
        <v-icon>mdi-download-outline</v-icon>
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
      required: true,
    },
    label: {
      type: String,
      default: undefined,
    },
    property: {
      type: String,
      default: undefined,
    },
    nameProp: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
    };
  },

  methods: {
    async downloadItem() {
      try {
        this.loading = true;
        const response = await this.$axios.get(this.item[this.property ?? "url"], {
          responseType: "blob",
        });
        this.$utils.file.downloadItem(response, this.name ?? this.item[this.nameProp ?? "nome"]);
      } catch {
        this.$notifier.showErrorMessage(this.$t("pages.error.downloadError.description") as string);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
