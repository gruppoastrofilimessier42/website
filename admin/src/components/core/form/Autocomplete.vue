<template>
  <div ref="container" style="position: relative">
    <v-autocomplete
      :items="itemsArray"
      :search-input.sync="search"
      :loading="loading"
      :attach="attachToSelf ? $refs.container : undefined"
      :item-value="itemValue"
      v-bind="$attrs"
      :class="childClass"
      clearable
      :value-comparator="(a, b) => a == b"
      v-on="$listeners"
    >
      <template v-for="(value, slot) of $scopedSlots" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import Vue from "vue";
import { CancelTokenSource } from "axios";
import BaseModel from "~/models/BaseModel";
import ApiBaseService, { QueryInterface } from "~/services/ApiBaseService";

export default Vue.extend({
  props: {
    // {JSON:API} model to query
    service: {
      type: Object as () => ApiBaseService,
      required: true,
    },
    itemValue: {
      type: String,
      required: true,
    },
    filtername: {
      type: String,
      required: true,
    },
    additionalFilters: {
      type: Object,
      default: null,
    },
    oldItems: {
      type: Array as () => BaseModel[],
      default: () => [],
    },
    // Custom callback
    itemsCallback: {
      type: Function,
      default: null,
    },
    childClass: {
      type: String,
      default: null,
    },
    attachToSelf: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      items: [] as BaseModel[] | any[],
      search: null,
      loading: false,
      debouncedQueryItems: () => {},
      cancelToken: null as CancelTokenSource | null,
    };
  },

  computed: {
    itemsArray(): BaseModel[] {
      const filteredOldItems = this.oldItems.filter((v) => !!v);
      const items = this.items
        .filter((item) => !filteredOldItems.some((oldItem) => oldItem.id === item.id))
        .concat(filteredOldItems)
        .sort((a, b) => {
          const textA = a[this.$attrs["item-text"]];
          const textB = b[this.$attrs["item-text"]];
          if (textA > textB) {
            return 1;
          }
          if (textB > textA) {
            return -1;
          }
          return 0;
        });
      this.$emit("emit-item-list", items);
      return items;
    },
  },

  watch: {
    search() {
      this.debouncedQueryItems();
    },
    itemsCallback() {
      this.queryItems();
    },
    additionalFilters: {
      handler(newval, oldval) {
        if (JSON.stringify(newval) !== JSON.stringify(oldval)) {
          this.queryItems();
        }
      },
      deep: true,
    },
  },

  async mounted() {
    this.debouncedQueryItems = _.debounce(this.queryItems, 150);
    await this.queryItems();
  },

  methods: {
    async queryItems() {
      this.loading = true;
      let result;
      try {
        if (this.cancelToken) {
          this.cancelToken.cancel();
        }
        if (this.itemsCallback) {
          result = await this.itemsCallback();
        } else {
          this.cancelToken = this.$axios.CancelToken.source();
          const mergedFilter = _.merge({ like: { [this.filtername]: this.search } }, this.additionalFilters);
          const params = {
            filters: mergedFilter,
            sort: !this.filtername.startsWith("$") ? this.filtername : undefined,
            queryOptions: { cancelToken: this.cancelToken.token },
          } as QueryInterface;
          result = await this.service.query(params);
        }
        result.forEach((r: any) => {
          if (!this.items.find((i) => i[this.itemValue] === r[this.itemValue])) {
            this.items.push(r);
          }
        });
      } catch {
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
