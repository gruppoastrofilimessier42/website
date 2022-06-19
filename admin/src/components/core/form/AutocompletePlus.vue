<template>
  <!-- This component is meant to work exactly like our
    custom autocomplete, but it can show extra infos
    about the items that your're looking for thanks 
    to the "extraFields" prop -->

  <FormAutocomplete v-bind="$attrs" v-on="$listeners">
    <template #item="{ parent, item }">
      <v-list-item-content>
        <v-list-item-title class="d-flex">
          <span class="mr-2" v-html="parent.genFilteredText(item[mainField])" />
          <v-spacer />
          <span class="text-caption text--disabled">
            {{ itemFormatter(item) }}
          </span>
        </v-list-item-title>
      </v-list-item-content>
    </template>
  </FormAutocomplete>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  props: {
    mainField: {
      type: String,
      default: undefined,
    },
    itemFormatter: {
      type: Function,
      required: true,
    },
  },
});
</script>
