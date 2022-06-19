const positiveIntNotNull = {
  type: "integer",
  minimum: 1,
};

const nullableBoolean = {
  type: ["boolean", "null"],
};

const notNullableBoolean = {
  type: "boolean",
};

const nullablePositiveInt = {
  type: ["integer", "null"],
  minimum: 1,
};

const nullableNonNegativeInt = {
  type: ["integer", "null"],
  minimum: 0,
};

const nonNegativeIntNotNull = {
  type: ["integer"],
  minimum: 0,
};

const nonNegativeNumberNotNull = {
  type: "number",
  minimum: 0,
};
const nullableNonNegativeNumber = {
  type: ["number", "null"],
  minimum: 0,
};
const positiveNumberNotNull = {
  type: "number",
  minimum: 1,
};
const nullablePositiveNumber = {
  type: ["number", "null"],
  minimum: 1,
};

const nullableNumber = {
  type: ["number", "null"],
};

const nullableString = {
  type: ["string", "null"],
};

const notNullNotEmptyTrimmedString = {
  type: ["string"],
  pattern: "^(?!\\s+)(?!(.|\\n)*\\s+$).*",
};

const nullableNotEmptyTrimmedString = {
  type: ["string", "null"],
  pattern: "^(?!\\s+)(?!(.|\\n)*\\s+$).*",
};

const stringWitPattern = (pattern) => ({
  type: "string",
  pattern,
});

const length = (value) => ({
  minLength: value,
  maxLength: value,
});

module.exports = {
  positiveIntNotNull,
  nullablePositiveInt,
  nullableNonNegativeInt,
  nullableString,
  nullableNotEmptyTrimmedString,
  notNullNotEmptyTrimmedString,
  nonNegativeNumberNotNull,
  nonNegativeIntNotNull,
  nullableNonNegativeNumber,
  positiveNumberNotNull,
  nullablePositiveNumber,
  nullableNumber,
  nullableBoolean,
  notNullableBoolean,
  stringWitPattern,
  length,
};
