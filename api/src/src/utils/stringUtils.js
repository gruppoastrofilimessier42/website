/* eslint-disable security/detect-non-literal-regexp */
const { decode } = require("html-entities");
const _ = require("lodash");

const snakeCase = (str) => {
  const parts = str.split(".");
  return parts.map((part) => _.snakeCase(part)).join(".");
};

const kebabCase = (str) => {
  const parts = str.split(".");
  return parts.map((part) => _.kebabCase(part)).join(".");
};

const regExpEscape = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const substrCount = (str, instr) => {
  const re = regExpEscape(instr);
  return (str.match(new RegExp(re, "g")) || []).length;
};

const entitiesDecode = (value) => {
  return decode(value, { scope: "strict" });
};

const multilanguageEntitiesDecode = (obj, propName) => {
  const o = _.get(obj, propName);
  Object.keys(o).forEach((locale) => {
    _.set(obj, `${propName}.${locale}`, entitiesDecode(o[locale]));
  });
};

module.exports = {
  snakeCase,
  kebabCase,
  regExpEscape,
  substrCount,
  entitiesDecode,
  multilanguageEntitiesDecode,
};
