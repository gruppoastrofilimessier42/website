<template>
  <v-row>
    <v-col v-for="(singleNote, index) in parsedNotes" :key="index" cols="12" md="6">
      <v-card>
        <v-card-title>
          <div class="text-overline">
            <v-icon left>mdi-note</v-icon>
            {{ parsedNotes.length > 1 && index === 0 ? $t(`common.previousNotes`) : $t(`common.newNote`) }}
          </div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <div v-if="index !== parsedNotes.length - 1">
                <v-textarea rows="8" :value="singleNote" readonly no-resize dense outlined />
              </div>
              <FormField v-else name="note">
                <template slot-scope="{ attrs, on }">
                  <v-textarea
                    rows="8"
                    no-resize
                    dense
                    outlined
                    v-bind="{ ...attrs, ...$attrs }"
                    v-on="{ ...on, ...$listeners }"
                  />
                </template>
              </FormField>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    notes: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      note: null,
    };
  },
  computed: {
    parsedNotes(): string[] | undefined {
      return this.notes ? [this.notes, ""] : [""];
    },
  },
});
</script>
