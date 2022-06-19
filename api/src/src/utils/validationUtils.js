const _ = require("lodash");
const ApiError = require("../errors/apiError/apiError");
const { isNullOrEmptyString } = require("./valueCheck");

const getByIdForValidation =
  (updateObject, idPropName, db, dbObj, defaultReturn = true) =>
  (callback) => {
    const idPropNames = [].concat(idPropName);
    const hasAllProps = idPropNames.every((propName) => !isNullOrEmptyString(updateObject[propName]));
    const atLeastOnePropChanged =
      !dbObj || idPropNames.some((prop) => updateObject[prop] && updateObject[prop] !== dbObj[prop]);
    const shouldCall = hasAllProps && atLeastOnePropChanged;
    const values = idPropNames.map((prop) => updateObject[prop]);
    const callbackValues = values.length > 1 ? values : values[0];
    return shouldCall ? callback(callbackValues, db) : defaultReturn;
  };

const validateNestedResources = (objects, oldObjects, pointer, error = new ApiError(), idField = "id") => {
  // Check that all ids in request are ids related to this entity
  if (objects) {
    const oldIds = oldObjects.toIds(idField);
    const ids = objects.toIds(idField);
    if (ids.some((id) => !oldIds.includes(id))) {
      error.push(100, pointer);
    }
  }
  return error;
};

const buildPointer = (field) => `/body/${field}`;

const functionToObjectReducer = (acc, [idField, callbackOrObj]) => ({
  ...acc,
  [idField]: _.isFunction(callbackOrObj) ? { callback: callbackOrObj, pointer: `/body/${idField}` } : callbackOrObj,
});

const validationSchemaBuilder = (validationSchema) => {
  const schemas = [].concat(validationSchema);
  const validators = schemas.map((schema) => Object.entries(schema).reduce(functionToObjectReducer, {}));
  return schemas.length > 1 ? validators : validators[0];
};

const schemaVerify = (schema, { entity, trx, dbEntity }, errorCallback) =>
  Object.entries(schema).map(([idPropName, { callback, pointer = buildPointer(idPropName), params, defaultReturn }]) =>
    errorCallback(entity, trx, pointer, callback, dbEntity, { idPropName, params, defaultReturn })
  );

module.exports = {
  getByIdForValidation,
  validateNestedResources,
  buildPointer,
  functionToObjectReducer,
  validationSchemaBuilder,
  schemaVerify,
};
