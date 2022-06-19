<template>
  <div>
    <slot
      :attrs="{
        errorMessages: errorMessages,
      }"
      :on="{
        input: somethingChanged,
        change: somethingChanged,
      }"
      :hasErrors="hasAnyErrors"
      :errors="errorMessages"
    />
  </div>
</template>
<script>
import Vue from "vue";
import _ from "lodash";
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";

function get(source, path, def) {
  const newPath = path.replace(/\.\$each/g, "").replace(/\.\$model/g, "");
  return _.get(source, newPath, def);
}

export default {
  extends: singleErrorExtractorMixin,
  inject: ["formWrapper"],
  data() {
    return {
      ownErrors: get(this.formWrapper.serverErrors, this.name, []),
    };
  },
  computed: {
    errorMessages() {
      return [
        ...this.activeErrorMessages,
        // For errors on collections, use the $ key as array of errors
        ...((this.ownErrors.$ ?? this.ownErrors) || []),
      ];
    },
    hasAnyErrors() {
      return this.hasErrors || !!this.ownErrors.length;
    },
    theseServerErrors() {
      return get(this.formWrapper.serverErrors, this.name, []);
    },
  },
  watch: {
    theseServerErrors: {
      deep: true,
      handler(newValue) {
        this.ownErrors = newValue;
      },
    },
  },
  methods: {
    somethingChanged() {
      Vue.set(this, "ownErrors", []);
    },
  },
};
</script>
