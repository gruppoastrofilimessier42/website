<template>
  <v-tooltip bottom>
    <template #activator="{ on: tooltipOn, attrs: tooltipAttrs }">
      <v-badge v-if="Number(numberOfItems) && badge" color="primary" overlap :content="numberOfItems">
        <v-btn
          icon
          :to="$utils.router.withBackTo(link)"
          :append="!to || append"
          v-bind="{ ...tooltipAttrs, ...$attrs }"
          v-on="{ ...tooltipOn, ...$listeners }"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
      </v-badge>
      <v-btn
        v-else
        icon
        :to="$utils.router.withBackTo(link)"
        :append="!to || append"
        v-bind="{ ...tooltipAttrs, ...$attrs }"
        v-on="{ ...tooltipOn, ...$listeners }"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>

    <span v-if="label">{{ label }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    to: {
      type: String,
      required: true,
    },
    badge: {
      type: Boolean,
      default: false,
    },
    numberOfItems: {
      type: [String, Number],
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      required: true,
    },
    append: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    link() {
      return this.to;
    },
  },
});
</script>
