<template>
  <v-tooltip v-bind="$attrs" content-class="pa-1" v-on="$listeners">
    <template v-for="(value, slot) of $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
    <ProtectedImageDisplayer width="300px" :src="src" :aspect-ratio="aspectRatio" />
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    aspectRatio: {
      type: Number,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
  },
});
</script>
