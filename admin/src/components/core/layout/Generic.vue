<template>
  <v-container fluid class="pa-4 pa-sm-8">
    <div v-if="hasDescriptionSlot" class="description mb-4 mb-sm-8">
      <slot name="description"></slot>
    </div>
    <slot />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  computed: {
    hasDescriptionSlot() {
      return !!this.$slots.description || !!this.$scopedSlots.description;
    },
  },
});
</script>
