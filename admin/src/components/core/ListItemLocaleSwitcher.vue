<template>
  <v-list-group v-model="open" class="locale-switcher" no-action inactive :ripple="false" @click.stop.prevent>
    <template #activator>
      <v-list-item-icon>
        <v-icon>mdi-translate</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{ $i18n.localeProperties.name }}</v-list-item-title>
    </template>
    <v-list-item v-for="locale in otherLocales" :key="locale.code" @click="changeLocale(locale.code)">
      <v-list-item-content>
        <v-list-item-title>{{ locale.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      open: false,
    };
  },
  computed: {
    otherLocales(): Object[] {
      return (this.$i18n.locales as Object[]).filter((locale: any) => locale.code !== this.$i18n.locale);
    },
  },
  methods: {
    changeLocale(localeCode: string) {
      this.$i18n.setLocale(localeCode);
      this.open = false;
    },
  },
});
</script>
