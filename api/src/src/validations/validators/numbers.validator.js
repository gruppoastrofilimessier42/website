const Joi = require("joi");

const max = 2147483640;
const min = -2147483640;

const emptyToNull = Joi.valid(null, "").empty("").default(null);

const nonNegativeNumber = Joi.number().positive().allow(0).max(max);
const nonNegativeInteger = nonNegativeNumber.integer();

const positiveNumber = Joi.number().positive().max(max);
const positiveInteger = positiveNumber.integer();

const number = Joi.number().max(max).min(min);
const integer = number.integer();

module.exports = {
  nonNegativeNumber,
  nonNegativeInteger,
  positiveNumber,
  positiveInteger,
  number,
  integer,

  nullableNonNegativeNumber: Joi.alternatives(emptyToNull, nonNegativeNumber),
  nullableNonNegativeInteger: Joi.alternatives(emptyToNull, nonNegativeInteger),

  nullablePositiveNumber: Joi.alternatives(emptyToNull, positiveNumber),
  nullablePositiveInteger: Joi.alternatives(emptyToNull, positiveInteger),

  nullableNumber: Joi.alternatives(emptyToNull, number),
  nullableInteger: Joi.alternatives(emptyToNull, integer),
  emptyToNull,
};
