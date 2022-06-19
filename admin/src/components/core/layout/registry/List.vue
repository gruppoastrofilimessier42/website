<template>
  <v-container fluid class="pa-4 pa-sm-8" :class="{ 'has-fab': hasFab }">
    <div v-if="hasFilters" class="mb-4">
      <slot name="filters" />
    </div>
    <v-card>
      <slot />
    </v-card>
    <slot name="fab">
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-btn
            v-if="!hideFab"
            fab
            fixed
            bottom
            right
            color="primary"
            append
            :to="$utils.router.withBackTo('create')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        {{ $t("table.action.add") }}
      </v-tooltip>
    </slot>
  </v-container>
</template>

<script>
export default {
  props: {
    hideFab: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasFilters() {
      return !!this.$slots.filters;
    },
    hasFabSlot() {
      return !!this.$slots.fab || !!this.$scopedSlots.fab;
    },
    hasFab() {
      return !this.hideFab || this.hasFabSlot;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  &.has-fab {
    padding-bottom: 88px !important;
  }
}
</style>
