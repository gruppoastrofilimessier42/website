import _ from "lodash";
import { Plugin } from "@nuxt/types";
import Locale from "~/models/Locale";

declare module "vue/types/vue" {
  interface Vue {
    $l: {
      (item: any, locale: Locale): Object | "";
      validator(validators: any): string;
      model(): Object;
      localizedGroups(localizedFields: any): Object;
    };
  }
}

const plugin: Plugin = ({ i18n }, inject) => {
  function l(item: any = {}, locale = i18n.locale) {
    return item[locale] || item[i18n.fallbackLocale as string] || "";
  }
  l.validator = function (validators: any) {
    const localeValidators = _.pick(validators, i18n.localeCodes);
    const commonValidators = _.omit(validators, i18n.localeCodes);
    return i18n.localeCodes.reduce((validators, locale) => {
      return {
        ...validators,
        [locale]: {
          ...localeValidators[locale],
          ...commonValidators,
        },
      };
    }, {});
  };
  l.model = function () {
    return i18n.localeCodes.reduce(
      (model, locale) => ({
        ...model,
        [locale]: null,
      }),
      {}
    );
  };
  l.localizedGroups = function (localizedFields: any) {
    return i18n.localeCodes.reduce(
      (acc, locale) => ({
        ...acc,
        [locale]: localizedFields.map((field: any) => `${field}.${locale}`),
      }),
      {}
    );
  };
  inject("l", l);
};

export default plugin;
