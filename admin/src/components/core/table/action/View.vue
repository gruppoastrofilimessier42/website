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
        <v-icon>mdi-eye-outline</v-icon>
      </v-btn>
    </template>
    <span v-if="label">{{ $t("table.actions.displayWithName", { item: label }) }}</span>
    <span v-else>{{ $t("table.actions.display") }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    label: {
      type: String,
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
      return this.to ?? `${this.itemId}`;
    },
  },
});
</script>
