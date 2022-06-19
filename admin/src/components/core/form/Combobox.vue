<template>
  <div ref="container" style="position: relative">
    <v-combobox
      :items="itemsArray"
      :search-input.sync="search"
      :loading="loading"
      :attach="attachToSelf ? $refs.container : undefined"
      v-bind="$attrs"
      :class="childClass"
      clearable
      :value-comparator="valueComparator"
      v-on="{ ...$listeners, input: emettiRoba }"
    >
      <template #no-data>
        <v-list-item>
          <span class="subheading">{{ $t("common.add") }}&nbsp;</span>
          <v-chip small color="primary">
            {{ search }}
          </v-chip>
        </v-list-item>
      </template>
      <template v-for="(value, slot) of $scopedSlots" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </v-combobox>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import Vue from "vue";
import { CancelTokenSource } from "axios";
import BaseModel from "~/models/BaseModel";
import ApiBaseService from "~/services/ApiBaseService";

export default Vue.extend({
  props: {
    // {JSON:API} model to query
    service: {
      type: Object as () => ApiBaseService,
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
    valueComparator: {
      type: Function,
      // eslint-disable-next-line eqeqeq
      default: (a: any, b: any) => a == b,
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
      return this.items
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
    },
  },

  watch: {
    search() {
      this.debouncedQueryItems();
    },
    itemsCallback() {
      this.queryItems();
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
          result = await this.service.query({
            filters: { [this.filtername]: this.search, ...this.additionalFilters },
            sort: this.filtername,
            queryOptions: { cancelToken: this.cancelToken.token },
          });
        }
        this.items.push(...result);
      } catch {
      } finally {
        this.loading = false;
      }
    },
    emettiRoba(values: any[]) {
      const parsedValues = [
        ...new Set(
          values.map(
            (value) =>
              this.itemsArray.find(
                // eslint-disable-next-line eqeqeq
                (item: any) => item[this.filtername]?.toLowerCase() == (value[this.filtername] || value)?.toLowerCase()
              ) || value
          )
        ),
      ];
      this.items = this.itemsArray.filter((item) => _.isObject(item));
      this.$emit("input", parsedValues);
    },
  },
});
</script>
