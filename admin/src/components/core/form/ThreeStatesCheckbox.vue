<template>
  <v-checkbox
    :indeterminate="indeterminate"
    :input-value="currentValue"
    :label="stateLabel"
    v-bind="$attrs"
    v-on="$listeners"
    @change="toggleIndeterminate"
  >
  </v-checkbox>
</template>

<script>
export default {
  props: {
    standardLabel: {
      type: String,
      default: undefined,
    },
    labelTrue: {
      type: String,
      default: undefined,
    },
    labelFalse: {
      type: String,
      default: undefined,
    },
    labelUndefined: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      indeterminate: true,
      previousClickWasFalse: false,
      currentEventValue: false,
    };
  },

  computed: {
    currentValue() {
      return this.indeterminate ? undefined : !!this.currentEventValue;
    },
    stateLabel() {
      let stateLabel = this.standardLabel || "";
      const typeOfCurrentVal = typeof this.currentValue;
      if (typeOfCurrentVal === "undefined" && this.labelUndefined) {
        stateLabel = this.labelUndefined;
      }
      if (this.currentValue && this.labelTrue) {
        stateLabel = this.labelTrue;
      }
      if (!this.currentValue && typeOfCurrentVal === "boolean" && this.labelFalse) {
        stateLabel = this.labelFalse;
      }
      return stateLabel;
    },
  },

  methods: {
    toggleIndeterminate(event) {
      this.currentEventValue = event;
      if (event) {
        this.indeterminate = false;
        this.previousClickWasFalse ? (this.indeterminate = true) : (this.previousClickWasFalse = true);
      }
      if (this.indeterminate) {
        this.previousClickWasFalse = false;
      }
      this.$emit("input", this.currentValue);
    },
  },
};
</script>
