<template>
  <div class="d-flex flex-row-reverse justify-space-between" :class="{ 'py-4': !inActions }">
    <v-btn color="primary" type="submit" v-bind="$attrs">
      <v-icon left>mdi-content-save-outline</v-icon>
      <slot> {{ $t("common.save") }} </slot>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    inActions: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
});
</script>
