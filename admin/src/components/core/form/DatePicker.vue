<template>
  <!-- PLEASE DO NOT EVER TOUCH THIS COMPONENT AGAIN WITHOUT CONSENT -->
  <div ref="container">
    <v-menu
      ref="menu"
      v-model="menu"
      :attach="attachToSelf ? $refs.container : undefined"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="internalValue"
          outlined
          dense
          maxlength="50"
          :class="childClass"
          v-bind="{ ...attrs, ...$attrs }"
          clearable
          v-on="on"
          @blur="emitValue"
          @click:clear="$emit('input', null)"
        />
      </template>
      <v-date-picker
        :value="$utils.date.formatDate(value, 'YYYY-MM-DD')"
        :min="min"
        :max="max"
        no-title
        @input="$emit('input', $event)"
        @change="save"
      />
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
    defaultValue: {
      type: String,
      default: null,
    },
    max: {
      type: String,
      default: null,
    },
    min: {
      type: String,
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
      menu: false,
      internalValue: null,
    };
  },
  watch: {
    value: {
      handler() {
        this.internalValue = this.$utils.date.formatDate(this.value);
      },
      immediate: true,
    },
  },
  created() {
    if (this.defaultValue) {
      this.$emit("input", this.defaultValue);
    }
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    emitValue(event) {
      const parsedDate = this.$utils.date.parseDate(event.target.value);
      this.internalValue = this.$utils.date.formatDate(parsedDate);
      this.$emit("input", parsedDate);
    },
  },
};
</script>

<style scoped lang="scss">
.v-text-field {
  ::v-deep {
    .v-text-field__slot > .v-label {
      pointer-events: none;
    }
  }
}
</style>
