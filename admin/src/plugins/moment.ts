import { Plugin } from "@nuxt/types";

const plugin: Plugin = ({ $moment, i18n }) => {
  $moment.locale(i18n.locale);
  i18n.onBeforeLanguageSwitch = (_oldLocale, newLocale) => {
    $moment.locale(newLocale);
  };
};

export default plugin;
