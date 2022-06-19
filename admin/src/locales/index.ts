import Locale from "~/models/Locale";

const locales: Locale[] = [
  { code: "it", iso: "it-IT", name: "Italiano", shortName: "Ita" },
  { code: "en", iso: "en-US", name: "English", shortName: "Eng" },
];

module.exports = {
  locales,
  localeCodes: locales.map((locale) => locale.code),
  fallbackLocale: "en",
};
