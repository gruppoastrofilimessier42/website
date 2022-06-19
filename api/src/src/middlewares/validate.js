const _ = require("lodash");
const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../errors/apiError/apiError");

const formatPath = (error) => {
  let errorPath = `/${error.path.join("/")}`;
  if (error.context.path) {
    errorPath += `/${error.context.path}`;
  }
  return errorPath;
};

const validate = (schema) => (req, res, next) => {
  new ApiError(500).pushIfFalsy(schema, "/", 0).throwIf();
  const objSchema = _.isFunction(schema) ? schema(req) : schema;
  const validSchema = _.pick(objSchema, ["params", "query", "body", "headers"]);
  const object = _.pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(object, { abortEarly: false });
  if (error) {
    const apiError = new ApiError();
    // TODO come dovrei fare a tradurre tutti questi?
    error.details.map((e) => apiError.push(12, formatPath(e)));
    return next(apiError.setStatus(httpStatus.BAD_REQUEST));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
