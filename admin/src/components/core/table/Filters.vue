<template>
  <v-expansion-panels v-model="open" accordion>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <span>
          <v-icon>mdi-filter-outline</v-icon>
          {{ $t("common.filters") }}
        </span>
        <template #actions>
          <v-icon color="primary"> $expand </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form @submit.prevent="apply">
          <!-- Main slot containing filter elements -->
          <slot
            :tableFilters="tableFilters"
            :setCondition="setCondition"
            :tableFiltersConditions="tableFiltersConditions"
          />
          <!-- Actions -->
          <div class="pt-6 pb-2 d-flex justify-end">
            <v-btn color="primary" type="submit" :disabled="!dirty"> {{ $t("common.apply") }} </v-btn>
            <v-btn class="ml-4" :disabled="!dirtyFromTheBeginning" @click="clearFilters">
              {{ $t("common.cancel") }}
            </v-btn>
          </div>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import { mergeAndClone } from "@/utils/vue";

export default Vue.extend({
  reactiveProvide: {
    name: "filtersProvider",
    include: ["tableFilters", "tableFiltersConditions", "setCondition"],
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
    initOpen: {
      type: Boolean,
      required: false,
      default: false,
    },
    initialFilters: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tableFiltersConditions: {},
      tableFilters: this.initializeFilters(),
      currentInitialFilters: this.initializeFilters(this.initialFilters),
      open: this.initOpen, // NOTE: the drawer opens with a 0 value
      dirty: false,
      dirtyFromTheBeginning: false,
    };
  },
  watch: {
    filters() {
      this.currentInitialFilters = this.initializeFilters(this.filters);
      this.dirty = false;
    },
    tableFilters: {
      handler() {
        this.dirty =
          JSON.stringify(this.initializeFilters(this.tableFilters)) !==
          JSON.stringify(this.initializeFilters(this.currentInitialFilters));
        this.dirtyFromTheBeginning =
          JSON.stringify(this.initializeFilters(this.tableFilters)) !==
          JSON.stringify(this.initializeFilters(this.initialFilters));
      },
      deep: true,
    },
    initialFilters: {
      handler() {
        this.clearFilters();
        this.currentInitialFilters = this.initializeFilters(this.initialFilters);
      },
      deep: true,
    },
  },
  created() {
    mergeAndClone(this, "tableFilters", _.merge(this.filters, this.initialFilters));
    this.$emit("update:filters", _.cloneDeep(this.tableFilters));
    this.open =
      this.open ||
      JSON.stringify(this.initializeFilters(this.tableFilters)) !==
        JSON.stringify(this.initializeFilters(this.initialFilters))
        ? 0
        : null; // NOTE: the drawer opens with a 0 value
  },

  methods: {
    initializeFilters(spreadFilter) {
      return { eq: {}, like: {}, gte: {}, lte: {}, exists: {}, ...spreadFilter };
    },
    setCondition(obj) {
      const key = Object.keys(obj)[0];
      const newCondition = obj[key];
      const oldCondition = this.tableFiltersConditions[key];
      this.$set(this.tableFiltersConditions, key, newCondition);
      if (oldCondition) {
        const value = this.tableFilters[oldCondition][key];
        delete this.tableFilters[oldCondition][key];
        this.$set(this.tableFilters[newCondition], key, value);
      }
    },
    clearFilters() {
      this.tableFilters = _.cloneDeep(this.initializeFilters(this.initialFilters));
      this.$emit("update:filters", _.cloneDeep(this.tableFilters));
    },
    apply() {
      this.$emit("update:filters", _.cloneDeep(this.tableFilters));
    },
  },
});
</script>
