const httpStatus = require("http-status");
const { ForeignKeyViolationError } = require("objection");
const config = require("../config/config");
const { json } = require("../config/contentTypes");
const logger = require("../config/logger");
const ApiError = require("../errors/apiError/apiError");
const errorCodes = require("../errors/errorCodes");
const { isString } = require("../utils/valueCheck");

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (err instanceof ForeignKeyViolationError) {
    error = new ApiError().push(17, "/");
  }

  if (err instanceof SyntaxError) {
    error = new ApiError().push(11, "/");
  }

  if (!(error instanceof ApiError) && config.env === "production") {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const errors = [
      {
        message: { key: errorCodes.GENERIC },
        code: errorCodes.GENERIC,
      },
    ];
    error = new ApiError(statusCode, errors, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, errors } = err;

  errors?.forEach((e) => {
    e.detail = isString(e.detail) ? req.t(e.detail) : req.t(e.detail.key, e.detail.params);
  });

  if (!err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    if (config.env === "production" || config.env === "test") {
      errors = [
        {
          message: { key: errorCodes.GENERIC },
          code: errorCodes.GENERIC,
        },
      ];
    }
  }

  res.locals.errors = errors;

  let resStack;
  if (config.env === "development") {
    resStack = { stack: err.stack };
    logger.error(err.stack);
  }

  const defaultResponse = { errors, ...resStack };

  const formatter = {
    [json]: () => res.send(defaultResponse),
    default: () => res.send(defaultResponse),
  };

  res.status(statusCode).format(formatter);
};

module.exports = {
  errorConverter,
  errorHandler,
};
