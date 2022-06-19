/* eslint-disable no-param-reassign */
const { isObject, isArray } = require("lodash");
const { snakeToCamelCase } = require("../utils/valueCheck");

const toCamelCaseObjectKeys = (obj) => {
  Object.entries(obj).forEach(([key, value]) => {
    const camelCaseKey = snakeToCamelCase(key);
    obj[camelCaseKey] = value;
    if (camelCaseKey !== key) {
      delete obj[key];
    }
    if (isArray(value)) {
      value.forEach((v) => isObject(v) && toCamelCaseObjectKeys(v));
    } else if (isObject(value)) {
      toCamelCaseObjectKeys(value);
    }
  });
};

module.exports = (req, res, next) => {
  if (req.query) {
    toCamelCaseObjectKeys(req.query);
  }
  next();
};
