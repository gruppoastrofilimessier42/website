const { json } = require("../config/contentTypes");
const ApiError = require("../errors/apiError/apiError");

const middleware = async (req, res, next) => {
  const error = new ApiError();
  const mime = req.get("Content-Type");
  if (!["GET", "DELETE", "HEAD", "OPTIONS"].includes(req.method) && mime !== json) {
    return next(error.push(9, "/"));
  }
  next();
};

const jsonRouter = (router) => (endpoint, route) => router.use(endpoint, middleware).use(endpoint, route);
jsonRouter.middleware = middleware;

module.exports = jsonRouter;
