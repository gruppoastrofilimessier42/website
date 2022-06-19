const Joi = require("joi");
const { nonNegativeInteger } = require("../validators/numbers.validator");
const { toUndefined } = require("../validators/transform.validator");

const errorCallback = (joiCode, key) => (errors) => {
  errors.forEach((e) => {
    if (e.code === joiCode) {
      e.message = { key };
    }
  });
  return errors;
};

const idParams = (idFields = "id") => {
  const arrayIdFields = [].concat(idFields);
  const params = arrayIdFields.reduce((acc, idField) => ({ ...acc, [idField]: nonNegativeInteger.required() }), {});
  return { params };
};

const byIdsWithNoBody = (idFields = "id") => ({
  ...idParams(idFields),
  body: toUndefined,
});

const emptyRequest = Joi.object().keys({ body: toUndefined, params: toUndefined, query: toUndefined });

const idArray = Joi.array().items(Joi.number().positive());

const toUndefinedProps = (Model) => {
  const { virtualAttributes, idColumn, modifierVirtualAttributes } = Model;
  const relations = Object.keys(Model.getRelations() ?? {});
  const fileFields = Object.keys(Model.fileFields ?? {});
  const fullTextIndexes = Object.keys(Model.fullTextIndexes ?? {});
  const toBeCleared = ["createdAt", "updatedAt"]
    .concat(virtualAttributes)
    .concat(fullTextIndexes)
    .concat(relations)
    .concat(fileFields)
    .concat(idColumn)
    .concat(modifierVirtualAttributes);
  return toBeCleared.filter((prop) => !!prop).reduce((acc, prop) => ({ ...acc, [prop]: toUndefined }), {});
};

module.exports = {
  errorCallback,
  idParams,
  byIdsWithNoBody,
  idArray,
  emptyRequest,
  toUndefinedProps,
};
