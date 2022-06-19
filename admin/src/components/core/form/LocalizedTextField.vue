<template>
  <v-text-field v-bind="$attrs" v-on="$listeners">
    <template #append>
      <div class="text-overline">
        {{ locale }}
      </div>
    </template>
  </v-text-field>
</template>

<script>
export default {
  props: {
    locale: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.v-text-field ::v-deep .v-input__append-inner {
  margin-top: 5px !important;
}
</style>
