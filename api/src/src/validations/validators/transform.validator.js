const Joi = require("joi");

const jsonToObject = Joi.extend((joi) => {
  return {
    type: "object",
    base: joi.object(),
    coerce(value) {
      if (value[0] !== "{" && !/^\s*\{/.test(value)) {
        return;
      }
      try {
        return { value: JSON.parse(value) };
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
  };
});

const numberToId = Joi.extend((joi) => {
  return {
    type: "object",
    base: joi.object(),
    coerce(value) {
      return { value: { id: value } };
    },
  };
})
  .object()
  .keys({ id: Joi.number().positive() });

module.exports = {
  emptyStringToNull: Joi.string().trim().allow(null, "").empty("").default(null),
  nullToEmptyString: Joi.string().trim().allow(null, "").empty(null).default(""),
  emptyStringToUndefined: Joi.string().trim().max(50).allow(null, "").empty(""),
  nullToUndefined: Joi.string().trim().allow(null, "").empty(null),
  nullOrEmptyStringToUndefined: Joi.string().trim().allow(null, "").empty(Joi.alternatives(null, "")),
  nullOrEmptyDateToUndefined: Joi.date().iso().allow(null, "").empty(Joi.alternatives(null, "")),
  emptyDateToUndefined: Joi.date().iso().allow(null, "").empty(Joi.alternatives("")),
  toUndefined: Joi.any().empty(Joi.any()),
  notNullToUndefined: Joi.allow(null).empty(Joi.invalid(null)),
  nullOrEmptyStringToUndefinedNumber: Joi.number().allow(null, "").empty(Joi.alternatives(null, "")),
  jsonToObject,
  numberToId,
  numbersToIds: Joi.array().items(numberToId),
  booleanAnd01: Joi.boolean().truthy(1, "1").falsy(0, "0").allow(null).empty(null),
  toValue: (value) => Joi.any().empty(Joi.any()).default(value),
};
