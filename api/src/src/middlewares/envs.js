const httpStatus = require("http-status");
const { env } = require("../config/config");
const ApiError = require("../errors/apiError/apiError");

const envs =
  (...envs) =>
  async (req, res, next) => {
    const error = new ApiError(httpStatus.FORBIDDEN);
    if (!envs.includes(env)) {
      error.push(10, "/", { env });
      return next(error);
    }
    next();
  };

module.exports = envs;
