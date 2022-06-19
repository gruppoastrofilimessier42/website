<template>
  <v-data-table
    :headers="tableHeaders"
    :items="items"
    :options.sync="tableOptions"
    :loading="loading"
    :server-items-length="totalResults"
    :footer-props="{ showFirstLastPage: true }"
    multi-sort
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-for="(value, slot) of $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
    <template #[`item.__actions`]="{ item }">
      <slot name="actions" :refresh="fetchItems" :item="item" :loading="loading" />
    </template>
    <template #[`footer.prepend`]>
      <slot name="footer.emptyspace"></slot>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import ApiBaseService from "~/services/ApiBaseService";
import { mergeAndClone } from "@/utils/vue";
import { DataLoader } from "~/models/DataLoader";
import BaseModel from "~/models/BaseModel";
import debounce from "@/utils/debounce";

export default Vue.extend({
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    queryOptions: {
      type: Object,
      default: () => ({}),
    },
    filters: {
      type: Object,
      default: null,
    },
    headers: {
      type: Array as () => any[],
      default: () => [],
    },
    // {JSON:API} model to query
    service: {
      type: Object as () => ApiBaseService,
      required: true,
    },
    // Custom callback
    itemsCallback: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      items: [] as BaseModel[] | any[],
      totalResults: null as number | null,
      tableOptions: {} as any,
    };
  },
  computed: {
    hasSlotActions(): boolean {
      return !!this.$slots.actions || !!this.$scopedSlots.actions;
    },
    internalHeaders(): any[] {
      const headers = [];
      if (this.hasSlotActions) {
        headers.push({
          text: this.$t("common.actions"),
          value: "__actions",
          sortable: false,
          align: "right",
          class: "actions",
          cellClass: "actions",
        });
      }
      return headers;
    },
    tableHeaders(): any[] {
      return [...this.headers, ...this.internalHeaders];
    },
  },
  watch: {
    filters: {
      handler() {
        this.tableOptions.page = 1;
        this.fetchItems();
      },
      deep: true,
    },
    options: {
      handler(newOptions) {
        // Keep "tableOptions" in sync with "options" prop
        mergeAndClone(this, "tableOptions", newOptions);
      },
      deep: true,
      immediate: true,
    },
    tableOptions: {
      handler() {
        this.fetchItems();
      },
      deep: true,
    },
    queryOptions: {
      handler() {
        this.fetchItems();
      },
      deep: true,
    },
  },
  methods: {
    sortParams(sortBy: string[], sortDesc: string[]) {
      const { sortBy: virtualSortBy, sortDesc: virtualSortDesc } = sortBy.reduce(
        (acc: any, item, index) => {
          const header = this.headers.find((header: any) => header.value === item) as any;

          // Check for sort alias
          const sortValues = [].concat(header.sortAlias || header.value);
          const sortDescValues = sortValues.map(() => sortDesc[index]);
          return { sortBy: [...acc.sortBy, ...sortValues], sortDesc: [...acc.sortDesc, ...sortDescValues] };
        },
        { sortBy: [], sortDesc: [] }
      );
      return virtualSortBy.reduce((acc: string = "", sortField: string, i: number) => {
        acc += `${i > 0 ? "," : ""}${virtualSortDesc[i] ? "-" : ""}${sortField}`;
        return acc;
      }, undefined);
    },
    async fetchItems(customRequest?: any, returnValue?: boolean) {
      const {
        itemsPerPage,
        sortBy = [],
        sortDesc = [],
        groupBy = [],
        groupDesc = [],
        page,
      } = customRequest?.tableOptions ?? this.tableOptions;
      const mergedSortBy = [...groupBy, ...sortBy];
      const mergedSortDesc = [...groupDesc, ...sortDesc];
      const sort = this.sortParams(mergedSortBy, mergedSortDesc);

      try {
        if (!returnValue) this.loading = true;
        let result;
        if (this.itemsCallback) {
          result = await (this.itemsCallback as DataLoader)(
            customRequest?.tableOptions ?? this.tableOptions,
            customRequest?.filters ?? this.filters,
            {
              sortBy: mergedSortBy,
              sortDesc: mergedSortDesc,
            }
          );
        } else {
          if (!returnValue) {
            if (!(await debounce(this.fetchItems))) return;
          }

          const query = this.service.query({
            filters: customRequest?.filters ?? this.filters,
            itemsPerPage,
            page,
            sort,
            queryOptions: this.queryOptions,
          });
          // Execute query
          result = await query;

          if (returnValue) {
            return {
              items: result.items,
              meta: result.meta,
            };
          } else {
            this.items = result.items;
            this.totalResults = result.meta?.page.totalResults;
          }
        }
      } catch (e) {
        console.dir(e);
      } finally {
        if (!returnValue) this.loading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.v-data-table ::v-deep {
  .actions {
    min-width: 1px;
    white-space: nowrap;
    width: 1px;
  }
}
</style>
