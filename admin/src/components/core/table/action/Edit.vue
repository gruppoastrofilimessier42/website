<template>
  <v-tooltip bottom>
    <template #activator="{ on: tooltipOn, attrs: tooltipAttrs }">
      <v-btn
        icon
        :to="$utils.router.withBackTo(link)"
        :append="!to || append"
        v-bind="{ ...tooltipAttrs, ...$attrs }"
        v-on="{ ...tooltipOn, ...$listeners }"
      >
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </template>
    <span v-if="label">{{ $t("table.action.editWithName", { item: label }) }}</span>
    <span v-else>{{ $t("table.action.edit") }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    label: {
      type: [String, Number],
      default: undefined,
    },
    itemId: {
      type: [String, Number],
      required: true,
    },
    to: {
      type: String,
      default: null,
    },
    append: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    link() {
      return this.to ?? `${this.itemId}/edit`;
    },
  },
});
</script>
