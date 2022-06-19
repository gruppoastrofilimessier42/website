const Joi = require("joi");

module.exports = {
  password: Joi.string()
    .trim()
    .min(8)
    .pattern(/[a-z]+/i)
    .pattern(/\d/),
};
