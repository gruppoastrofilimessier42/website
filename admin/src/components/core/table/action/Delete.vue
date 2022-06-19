<template>
  <v-tooltip bottom>
    <template #activator="{ on: tooltipOn, attrs: tooltipAttrs }">
      <v-btn
        icon
        color="error"
        v-bind="{ ...tooltipAttrs, ...$attrs }"
        @click="deleteItem"
        v-on="{ ...tooltipOn, ...$listeners }"
      >
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
    </template>
    <span v-if="label">{{ $t("table.action.deleteWithName", { item: label }) }}</span>
    <span v-else>{{ $t("table.action.delete") }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    label: {
      type: [String, Number],
      default: undefined,
    },
    url: {
      type: String,
      default: null,
    },
    deleteCallback: {
      type: Function,
      default: null,
    },
  },
  computed: {
    callback(): Function {
      const defaultCallback = async () => {
        return await this.$axios.$delete(this.url);
      };
      return this.deleteCallback ?? defaultCallback;
    },
  },
  methods: {
    async deleteItem() {
      const confirmMessage = this.$t("table.action.confirmDeletion", { item: this.label }) as string;
      const result = await this.$vuetifyConfirm.warning(confirmMessage);
      if (!result) {
        return;
      }
      try {
        await this.callback();

        const successMessage = this.$t("table.action.itemDeleted", { item: this.label }) as string;
        this.$notifier.showSuccessMessage(successMessage);

        this.$emit("delete");
      } catch (e: any) {
        this.$notifier.showErrorMessage(e);
      }
    },
  },
});
</script>
