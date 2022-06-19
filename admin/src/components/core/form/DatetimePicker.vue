<template>
  <v-datetime-picker
    :datetime="datetime"
    v-bind="$attrs"
    :clear-text="$t(`common.clear`)"
    :time-picker-props="{ format: '24hr' }"
    date-format="dd/MM/yyyy"
    v-on="listeners"
  >
    <template #dateIcon>
      <v-icon>mdi-calendar</v-icon>
    </template>
    <template #timeIcon>
      <v-icon>mdi-clock-outline</v-icon>
    </template>
  </v-datetime-picker>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: this.emitValue,
      };
    },
    datetime() {
      return this.value ? this.$moment(this.value).toDate() : this.value;
    },
  },
  methods: {
    emitValue(date) {
      const parsedDate = date ? this.$moment(date).format() : date;
      this.$emit("input", parsedDate);
    },
  },
};
</script>
