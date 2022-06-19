const Joi = require("joi");
const {
  jsonToObject,
  nullOrEmptyStringToUndefinedNumber,
  toUndefined,
  booleanAnd01,
} = require("./transform.validator");
const { filterConditions } = require("../../config/config");

const paginationOptions = jsonToObject.object().keys({
  number: nullOrEmptyStringToUndefinedNumber.positive(),
  size: nullOrEmptyStringToUndefinedNumber.integer(),
});

const setExists = (filters, condition) => {
  if (condition === "exists") {
    return { exists: Object.keys(filters).reduce((tot, filter) => ({ ...tot, [filter]: booleanAnd01 }), {}) };
  }
};

const setIn = (filters, condition) => {
  if (condition === "in") {
    const inReducer = (tot, [filter, validator]) => ({ ...tot, [filter]: Joi.array().items(validator) });
    return { in: Object.entries(filters).reduce(inReducer, {}) };
  }
};

const paginationQuery = (filters = {}, queryString = {}) => {
  const validationFilters = filterConditions.reduce((acc, condition) => {
    const existsFilter = setExists(filters, condition);
    const inFilter = setIn(filters, condition);
    return { ...acc, [condition]: filters, ...existsFilter, ...inFilter };
  }, {});
  return Joi.object().keys({
    sort: Joi.string().trim().max(200),
    limit: Joi.number().integer(),
    page: paginationOptions,
    filter: jsonToObject.object().keys(validationFilters),
    ...queryString,
  });
};

const usePagination = (filters = {}, queryString = {}) => ({
  query: paginationQuery(filters, queryString),
  body: toUndefined,
});

module.exports = {
  paginationOptions,
  paginationQuery,
  usePagination,
};
