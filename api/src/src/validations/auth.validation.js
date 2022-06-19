const Joi = require("joi");
const { errorCallback } = require("./helpers");
const userValidator = require("./validators/user.validator");

const login = {
  body: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().max(50).required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().trim().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().trim().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().trim().max(50).email().required().error(errorCallback("string.email", "invalidEmail")),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().trim().required(),
  }),
  body: Joi.object().keys({
    password: userValidator.password.required(),
  }),
};

const verifyToken = {
  query: Joi.object().keys({
    token: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
  }),
};

module.exports = {
  login,
  logout,
  refreshTokens,
  verifyToken,
  forgotPassword,
  resetPassword,
};
