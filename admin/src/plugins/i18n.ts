export default ({ app }: any) => {
  const switchLanguage = (_old: string | undefined, localeCode: string) => {
    app.vuetify.framework.lang.current = localeCode;
    app.$moment.locale(localeCode);
    app.$axios.defaults.headers.common["Accept-Language"] = localeCode;
  };

  app.i18n.onBeforeLanguageSwitch = switchLanguage;
  switchLanguage(undefined, app.i18n.locale);
};
