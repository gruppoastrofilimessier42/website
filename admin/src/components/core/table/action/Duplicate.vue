<template>
  <v-tooltip bottom>
    <template #activator="{ on: tooltipOn, attrs: tooltipAttrs }">
      <v-btn icon v-bind="{ ...tooltipAttrs, ...$attrs }" v-on="{ ...tooltipOn, ...$listeners }" @click="duplicate">
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
    </template>
    <span v-if="label">{{ $t("table.actions.duplicateWithName", { item: label }) }}</span>
    <span v-else>{{ $t("table.actions.duplicate") }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import _ from "lodash";
import Vue from "vue";
import ApiBaseService from "~/services/ApiBaseService";

export default Vue.extend({
  props: {
    service: {
      type: Object as () => ApiBaseService,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    label: {
      type: [String, Number],
      default: undefined,
    },
    omitFields: {
      type: Array as () => string[],
      default: null,
    },
  },
  methods: {
    async duplicate() {
      try {
        await this.service.create(_.omit(this.item, this.omitFields as string[]));
        this.$emit("duplicate");
      } catch (error) {}
    },
  },
});
</script>
