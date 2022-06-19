const _ = require("lodash");
const Joi = require("joi");

const isNullOrEmptyString = function (str) {
  return typeof str === "undefined" || str === null || `${str}`.length === 0;
};

const createRegExp = function (value) {
  const strValue = `${value}`;
  if (value === null || typeof value === "undefined" || !strValue.length) {
    return /.*/;
  }
  try {
    const matches = value.match(/^([|\/])?(.*?)\1([gmiyus]+)?$/);
    if (!matches[2].length) {
      return false;
    }
    return new RegExp(matches[2], matches[3]);
  } catch (e) {
    return false;
  }
};

const isValidUrl = function (str) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};

const isString = function (value) {
  return typeof value === "string" || value instanceof String;
};

const isNumber = function (value) {
  const str = "" + value;
  return !isNaN(str);
};

const isInt = function (value) {
  const str = `${value}`;
  return isNumber(str) && "" + parseInt(str) === str;
};

const isPositiveInt = function (value) {
  const str = `${value}`;
  return isInt(str) && parseInt(str, 10) >= 0;
};

const isEmail = function (value) {
  const { error } = Joi.string().email().required().validate(value);
  return !error;
};

const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const hexColorRegex = /^#(?=[a-f0-9]*$)(?:.{3}|.{6})$/i;

const dbExists = (value) => value && !value.deletedAt;

const snakeToCamelCase = (str) => str.replace(/(_[a-zA-Z])/g, (k) => k[1].toUpperCase());

function GetBits(value) {
  let b = 1;
  const res = [];
  while (b <= value) {
    // eslint-disable-next-line no-bitwise
    if (b & value) {
      res.push(b);
    }
    // eslint-disable-next-line no-bitwise
    b <<= 1;
  }
  return res;
}

const isChanged = (updateObject, oldObject, prop) => {
  return !_.isUndefined(updateObject[prop]) && !_.isEqual(updateObject[prop], oldObject[prop]);
};

module.exports = {
  isNullOrEmptyString,
  createRegExp,
  isValidUrl,
  isString,
  isNumber,
  isInt,
  isPositiveInt,
  isEmail,
  isJsonString,
  hexColorRegex,
  dbExists,
  snakeToCamelCase,
  GetBits,
  isChanged,
};
