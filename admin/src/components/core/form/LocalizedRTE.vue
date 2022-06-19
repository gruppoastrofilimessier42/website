<template>
  <div>
    <v-input v-bind="$attrs" :class="childClass">
      <template #append>
        <div class="text-overline">
          {{ locale }}
        </div>
      </template>
    </v-input>
    <RichTextEditor :custom-init="customInit" v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
export default {
  props: {
    locale: {
      type: String,
      required: true,
    },
    customInit: {
      type: Object,
      default: null,
    },
    childClass: {
      type: [String, Object],
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.v-input ::v-deep .v-label {
  margin-top: 6px !important;
}
</style>
