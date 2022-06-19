/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable security/detect-non-literal-require */
const i18next = require("i18next");

const locales = ["it", "en"];

const resources = locales.reduce((acc, locale) => ({ ...acc, [locale]: require(`../locales/${locale}`) }), {});

let i18n;

module.exports = (...middlewares) => {
  if (!i18n) {
    middlewares.forEach((m) => i18next.use(m));
    i18next.init({
      fallbackLng: locales[0],
      resources,
      detection: { order: ["header"] },
    });
    i18n = i18next;
  }
  return i18n;
};
