<template>
  <span>{{ euroValue }}</span>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    value: {
      type: Number,
      required: false,
      default: null,
    },
  },
  computed: {
    formatter(): Intl.NumberFormat {
      return Intl.NumberFormat(this.$i18n.locale, {
        style: "currency",
        currency: "EUR",
      });
    },
    euroValue(): string | null {
      if (typeof this.value === "number") return this.formatter.format(this.value);
      return null;
    },
  },
});
</script>
