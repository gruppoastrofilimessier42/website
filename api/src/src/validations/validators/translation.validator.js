const Joi = require("joi");
const { isFunction } = require("lodash");
const { locales } = require("../../config/config");
const { longString } = require("../../utils/migrationUtils");
const { emptyStringToNull, nullOrEmptyStringToUndefined, toValue } = require("./transform.validator");

const localeValidators = (maxLength, customValidationCallback) =>
  locales.reduce((localeValidatorsAcc, locale) => {
    const isFallbackLocale = locale === locales[0];
    const validator = isFallbackLocale ? Joi.string().trim().required() : emptyStringToNull;

    const finalValidator = maxLength ? validator.max(longString) : validator;

    return {
      ...localeValidatorsAcc,
      [locale]: isFunction(customValidationCallback) ? customValidationCallback(finalValidator) : finalValidator,
    };
  }, {});

module.exports = {
  unlimitedLengthTranslation(customLocalesValidators, customValidationCallback = null) {
    return module.exports.translation(customLocalesValidators, 0, customValidationCallback);
  },
  translation(customLocalesValidators, maxLength = longString, customValidationCallback = null) {
    return Joi.object().keys({
      ...localeValidators(maxLength, customValidationCallback),
      ...customLocalesValidators,
    });
  },
  optionalTranslation(customLocalesValidators) {
    return Joi.object().keys({
      ...locales.reduce((acc, locale) => ({ ...acc, [locale]: emptyStringToNull.max(longString) }), {}),
      ...customLocalesValidators,
    });
  },
  clearTranslation() {
    return toValue(locales.reduce((acc, locale) => ({ ...acc, [locale]: null }), {}));
  },
  translationFilter(fieldName) {
    return locales.reduce(
      (acc, locale) => ({ ...acc, [`${fieldName}.${locale}`]: nullOrEmptyStringToUndefined.max(longString) }),
      {}
    );
  },
};
