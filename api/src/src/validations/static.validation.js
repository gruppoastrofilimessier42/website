const Joi = require("joi");
const { toUndefined } = require("./validators/transform.validator");

const getFile = {
  params: { filename: Joi.string().required() },
  body: toUndefined,
};

module.exports = { getFile };
