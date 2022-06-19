const ApiError = require("../errors/apiError/apiError");
const {
  allowedContentTypeChecker: { parseMime },
} = require("../middlewares");

const middleware = async (req, res, next) => {
  const error = new ApiError();
  const mime = req.get("Content-Type");
  if (parseMime(mime) !== "multipart/form-data") {
    return next(error.push(9, "/"));
  }
  next();
};
const multipartRouter = (router) => (endpoint, route) => router.use(endpoint, middleware).use(endpoint, route);
multipartRouter.middleware = middleware;

module.exports = multipartRouter;
