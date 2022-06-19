<template>
  <v-row>
    <v-col>
      <slot :filterValue="filterValue" :setFilter="setFilter">
        <v-text-field v-bind="$attrs" :value="filterValue" v-on="$listeners" @input="setFilter">
          <template #append>
            <span ref="container" class="d-flex align-center" style="position: relative">
              <v-menu :attach="$refs.container">
                <template #activator="{ on, attrs }">
                  <v-btn text small class="align-self-center" color="default" v-bind="attrs" v-on="on">
                    {{ $t(`pages.catalog.search.${condition}`) }}
                    <v-icon right> mdi-menu-down </v-icon>
                  </v-btn>
                </template>

                <v-list class="white">
                  <v-list-item
                    v-for="item in conditions"
                    :key="item"
                    class="text-uppercase"
                    @click="filtersProvider.setCondition({ [filterName]: item })"
                  >
                    {{ $t(`pages.catalog.search.${item}`) }}
                  </v-list-item>
                </v-list>
              </v-menu>
            </span>
          </template>
        </v-text-field>
      </slot>
    </v-col>
  </v-row>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  inject: ["filtersProvider"],
  props: {
    filterName: {
      type: String,
      required: true,
    },
    conditions: {
      type: Array,
      required: true,
    },
  },
  computed: {
    condition() {
      return this.filtersProvider.queryFiltersConditions[this.filterName] || this.conditions[0];
    },
    filterObj() {
      return this.filtersProvider.queryFilters[this.condition];
    },
    filterValue() {
      return this.filterObj[this.filterName];
    },
  },
  created() {
    this.filtersProvider.setCondition({ [this.filterName]: this.conditions[0] });
  },
  methods: {
    setFilter(value) {
      this.$set(this.filterObj, this.filterName, value);
    },
  },
});
</script>
