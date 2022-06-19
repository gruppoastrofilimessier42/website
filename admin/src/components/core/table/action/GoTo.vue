<template>
  <v-tooltip bottom>
    <template #activator="{ on: tooltipOn, attrs: tooltipAttrs }">
      <v-btn
        icon
        :to="clickCallback ? null : $utils.router.withBackTo(link)"
        :append="!to || append"
        v-bind="{ ...tooltipAttrs, ...$attrs }"
        v-on="{ ...tooltipOn, ...$listeners }"
        @click="clickCallback ? clickCallback() : () => {}"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ label }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    label: {
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
    icon: {
      type: String,
      default: "mdi-pencil-outline",
    },
    clickCallback: {
      type: Function,
      default: null,
    },
  },
  computed: {
    link() {
      return this.to;
    },
  },
});
</script>
