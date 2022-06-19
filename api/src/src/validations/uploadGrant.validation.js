const Joi = require("joi");

const deleteGrant = {
  params: Joi.object().keys({
    token: Joi.string().trim().required(),
  }),
};

module.exports = {
  deleteGrant,
};
