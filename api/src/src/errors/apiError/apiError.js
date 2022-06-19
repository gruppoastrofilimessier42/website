/* eslint-disable global-require */
const httpStatus = require("http-status");
const path = require("path");
const { dbExists } = require("../../utils/valueCheck");
const SingleApiError = require("./singleApiError");

const getRelatedEntityByCallback = (entity, trx, pointer, callback, dbEntity, { idPropName, defaultReturn } = {}) => {
  const { getByIdForValidation } = require("../../utils/validationUtils");
  const idField = idPropName || path.basename(pointer);
  return getByIdForValidation(entity, idField, trx, dbEntity, defaultReturn)(callback);
};

class ApiError extends Error {
  constructor(statusCode = httpStatus.BAD_REQUEST, errors = [], isOperational = true, stack = "") {
    super();
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static withSchema(schema, options) {
    const { statusCode, errors, isOperational, stack, ...schemaOptions } = options;
    return new ApiError(statusCode, errors, isOperational, stack).pushWithSchema(schema, schemaOptions);
  }

  throwIf() {
    if (this.hasErrors()) {
      // eslint-disable-next-line no-throw-literal
      throw this;
    }
  }

  hasErrors() {
    return !!this.errors.length;
  }

  setStatus(statusCode) {
    this.statusCode = statusCode;
    return this;
  }

  setIsOperational(isOperational) {
    this.isOperational = isOperational;
    return this;
  }

  push(code, pointer = "/body/", params) {
    const detail = { key: `error.${code}`, params };
    (Array.isArray(pointer) ? pointer : [pointer]).forEach((p) => {
      this.errors.push(new SingleApiError(detail, code, p));
    });
    return this;
  }

  pushNotFound(pointer) {
    return this.push(1, pointer);
  }

  pushAuthenticate(pointer) {
    return this.push(6, pointer);
  }

  pushIfNotDBExists(value, pointer, params) {
    const values = [].concat(value);
    const pointers = [].concat(pointer);
    const paramsList = [].concat(params);
    values.forEach((v, i) => !dbExists(v) && this.push(100, pointers[i], paramsList[i]));
    return this;
  }

  pushIfFalsy(value, pointer, code, params) {
    const values = [].concat(value);
    const pointers = [].concat(pointer);
    const codes = [].concat(code);
    const paramsList = [].concat(params);
    values.forEach((v, i) => !v && this.push(codes[i], pointers[i], paramsList[i]));
    return this;
  }

  pushIfTruthy(value, pointer, code, params) {
    const values = [].concat(value);
    const pointers = [].concat(pointer);
    const codes = [].concat(code);
    const paramsList = [].concat(params);
    values.forEach((v, i) => v && this.push(codes[i], pointers[i], paramsList[i]));
    return this;
  }

  async pushIfNotDBExistsById(entity, trx, pointer, callback, dbEntity, { idPropName, params, defaultReturn } = {}) {
    const relatedEntity = await getRelatedEntityByCallback(entity, trx, pointer, callback, dbEntity, {
      idPropName,
      defaultReturn,
    });
    this.pushIfNotDBExists(relatedEntity, pointer, params);
    return this;
  }

  async pushIfAlreadyTaken(entity, trx, pointer, callback, dbEntity, { idPropName, params, defaultReturn } = {}) {
    const relatedEntity = await getRelatedEntityByCallback(entity, trx, pointer, callback, dbEntity, {
      idPropName,
      defaultReturn,
    });
    this.pushIfTruthy(relatedEntity, pointer, 7, params);
    return this;
  }

  async pushWithSchema(schema, options) {
    const { schemaVerify, validationSchemaBuilder } = require("../../utils/validationUtils");

    const { relatedIdExists = {}, alreadyTaken = {} } = schema;
    const [relatedIdExistsSchema, alreadyTakenSchema] = validationSchemaBuilder([relatedIdExists, alreadyTaken]);
    const relatedIdExistsPromises = schemaVerify(relatedIdExistsSchema, options, this.pushIfNotDBExistsById.bind(this));
    const alreadyTakenPromises = schemaVerify(alreadyTakenSchema, options, this.pushIfAlreadyTaken.bind(this));
    await Promise.all([...relatedIdExistsPromises, ...alreadyTakenPromises]);
    return this;
  }
}

module.exports = ApiError;
