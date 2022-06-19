const Joi = require("joi");
const { roles } = require("../config/roles");
const { User } = require("../models");
const { idParams, byIdsWithNoBody, toUndefinedProps } = require("./helpers");
const { positiveInteger } = require("./validators/numbers.validator");
const { usePagination } = require("./validators/pagination.validator");
const { nullOrEmptyStringToUndefined } = require("./validators/transform.validator");

const createUser = {
  body: Joi.object().keys({
    ...toUndefinedProps(User),
    email: nullOrEmptyStringToUndefined.email().required(),
    firstName: nullOrEmptyStringToUndefined.required(),
    lastName: nullOrEmptyStringToUndefined.required(),
    preferredLanguage: nullOrEmptyStringToUndefined.default("it"),
    roles: Joi.array()
      .items(Joi.valid(...roles).required())
      .min(1),
  }),
};

const getUsers = usePagination({
  id: positiveInteger,
  email: nullOrEmptyStringToUndefined,
  firstName: nullOrEmptyStringToUndefined,
  lastName: nullOrEmptyStringToUndefined,
  "roles.code": nullOrEmptyStringToUndefined,
  $q1: nullOrEmptyStringToUndefined,
});

const getUser = byIdsWithNoBody();

const updateUser = {
  ...idParams(),
  body: Joi.object().keys({
    ...toUndefinedProps(User),
    firstName: nullOrEmptyStringToUndefined,
    lastName: nullOrEmptyStringToUndefined,
    email: nullOrEmptyStringToUndefined.email(),
    preferredLanguage: nullOrEmptyStringToUndefined,
    roles: Joi.array().items(Joi.valid(...roles).required()),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
};
