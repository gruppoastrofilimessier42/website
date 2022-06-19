const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../errors/apiError/apiError");

const verifyCallback = (req, resolve, reject, requiredGrants) => async (err, user, info) => {
  const error = new ApiError();
  if (err || info || !user) {
    return reject(error.setStatus(httpStatus.UNAUTHORIZED).pushAuthenticate("/"));
  }
  req.user = user;

  if (requiredGrants.length) {
    const hasRequiredGrants = requiredGrants.every((requiredRight) => user.grants.includes(requiredRight));
    if (!hasRequiredGrants) {
      return reject(error.setStatus(httpStatus.FORBIDDEN).push("forbidden", "/"));
    }
  }

  resolve();
};

const auth =
  (...requiredGrants) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate("jwt", { session: false }, verifyCallback(req, resolve, reject, requiredGrants))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
