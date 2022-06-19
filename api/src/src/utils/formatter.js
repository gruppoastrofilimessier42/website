const httpStatus = require("http-status");
const { json } = require("../config/contentTypes");
const ApiError = require("../errors/apiError/apiError");

const defaultFormatter = {
  default: () => {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE).pushInvalid("unsupportedAcceptType", "/");
  },
};

const paginated = (res, result, customFormatter = {}) => ({
  [json]: () => res.send(result),
  ...defaultFormatter,
  ...Object.keys(customFormatter).reduce((acc, k) => ({ ...acc, [k]: () => res.send(customFormatter[k](result)) }), {}),
});

const format = (res, item, customFormatter = {}) => ({
  [json]: () => res.send(item),
  ...defaultFormatter,
  ...Object.keys(customFormatter).reduce((acc, k) => ({ ...acc, [k]: () => res.send(customFormatter[k](item)) }), {}),
});

module.exports = {
  paginated,
  format,
};
