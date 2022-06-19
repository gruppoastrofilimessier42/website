const Joi = require("joi");
const { locales } = require("../config/config");

const changeMyPreferences = {
  body: Joi.object().keys({
    preferredLanguage: Joi.string().allow(...locales),
  }),
};

module.exports = {
  changeMyPreferences,
};
