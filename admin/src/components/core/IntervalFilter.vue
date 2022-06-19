<template>
  <v-row :dense="vertical">
    <v-col :cols="colSize">
      <slot name="from">
        <v-text-field
          v-model="filter.gte[filtersModel]"
          type="number"
          maxlength="50"
          dense
          outlined
          hide-details
          :label="`${label} (${$t('common.from')})`"
          :prepend-inner-icon="prependInnerIcon"
          :prepend-icon="prependIcon"
          append-icon="mdi-greater-than-or-equal"
        />
      </slot>
    </v-col>
    <v-col :cols="colSize">
      <slot name="to">
        <v-text-field
          v-model="filter.lte[filtersModel]"
          type="number"
          maxlength="50"
          dense
          outlined
          hide-details
          :label="`${label} (${$t('common.to')})`"
          :prepend-inner-icon="prependInnerIcon"
          :prepend-icon="prependIcon"
          append-icon="mdi-less-than-or-equal"
        />
      </slot>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    filtersModel: {
      type: String,
      required: true,
    },
    parentFilter: {
      type: Object,
      required: true,
    },
    prependInnerIcon: {
      type: String,
      default: null,
    },
    prependIcon: {
      type: String,
      default: null,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: null,
    },
  },

  computed: {
    filter() {
      return this.parentFilter;
    },
    colSize() {
      return this.vertical ? 12 : 6;
    },
  },
};
</script>
