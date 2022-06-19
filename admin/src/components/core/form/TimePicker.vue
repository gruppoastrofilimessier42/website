<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        :value="internalValue"
        v-bind="{ ...attrs, ...$attrs }"
        readonly
        autocomplete="off"
        clearable
        :class="childClass"
        @click:clear="$emit('input', null)"
        v-on="on"
      />
    </template>
    <v-time-picker
      v-model="internalValue"
      format="24hr"
      :min="min"
      :max="max"
      @input="$emit('input', $event)"
      @change="save"
    />
  </v-menu>
</template>

<script>
export default {
  props: {
    value: {
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
  },
  data() {
    return {
      menu: false,
      internalValue: this.value,
    };
  },
  methods: {
    save(time) {
      this.$refs.menu.save(time);
    },
  },
};
</script>
