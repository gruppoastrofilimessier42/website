const { locales } = require("../../config/config");
const { positiveIntNotNull, nullableString } = require("../../utils/objectionValidation");
const Base = require("../base.model");

/**
 * Class representing an objection Translation
 * @extends Base
 */
class BaseTranslation extends Base {
  static get tableName() {
    return "translations";
  }

  static get hidden() {
    return "id";
  }

  static get jsonSchema() {
    const localeValidators = locales.reduce((localeValidators, locale) => {
      return { ...localeValidators, [locale]: nullableString };
    }, {});

    return {
      type: "object",
      properties: {
        id: positiveIntNotNull,
        ...localeValidators,
      },
    };
  }
}

module.exports = BaseTranslation;
