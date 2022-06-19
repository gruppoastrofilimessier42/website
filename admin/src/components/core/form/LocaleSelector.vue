<template>
  <v-menu v-model="isOpen" bottom left offset-y>
    <template #activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        {{ selectedLocale.name }}
        <v-icon right> mdi-menu-down </v-icon>
      </v-btn>
    </template>

    <v-list dense>
      <v-list-item v-for="locale in localesList" :key="locale.code" class="text-overline" @click="setLocale(locale)">
        {{ locale.name }}
        <v-badge v-if="hasError(locale)" dot color="red">&nbsp;</v-badge>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import Locale from "~/models/Locale";
export default Vue.extend({
  props: {
    validator: {
      type: Object,
      default: () => {},
    },
  },
  data(): any {
    return {
      isOpen: false,
      selectedLocale: this.$i18n.localeProperties,
    };
  },
  computed: {
    localesList(): Locale[] {
      return (this.$i18n.locales as Locale[]).filter((locale: Locale) => locale.code !== this.selectedLocale.code);
    },
    hasAnyLocaleError(): boolean {
      return !!this.localesList.find((locale: Locale) => this.hasError(locale));
    },
  },
  methods: {
    hasError(locale: Locale): boolean {
      return !!this.validator?.[locale.code]?.$anyError;
    },
    setLocale(locale: Locale) {
      this.selectedLocale = locale;
      this.$emit("update:locale", locale);
    },
    openIfErrors(): void {
      // Check if there's an error on any OTHER locale
      this.isOpen = this.localesList.some((locale: Locale) => this.validator?.[locale.code]?.$anyError);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "~vuetify/src/components/VBtn/_variables.scss";

.v-list-item {
  font-size: map-get($btn-font-sizes, "default") !important;
  letter-spacing: $btn-letter-spacing !important;
}
</style>
