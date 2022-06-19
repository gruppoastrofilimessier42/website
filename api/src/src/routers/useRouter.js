const _ = require("lodash");
const { json, urlEncoded, multipart } = require("../config/contentTypes");
const ApiError = require("../errors/apiError/apiError");
const jsonRouter = require("./json.router");
const multipartRouter = require("./multipart.router");
const urlEncodedRouter = require("./urlEncoded.router");

const useRouter = (router, mimeTypes) => (endpoint, route) =>
  router
    .use(endpoint, async (req, res, next) => {
      const contentType = req.get("Content-Type");

      if (!contentType && _.isEmpty(req.body)) {
        return next();
      }
      // eslint-disable-next-line no-param-reassign
      mimeTypes = [].concat(mimeTypes);
      if (contentType && mimeTypes.length && !mimeTypes.includes(contentType)) {
        return next(new ApiError().push(12, "/"));
      }

      switch (contentType) {
        case json:
          return jsonRouter.middleware(req, res, next);
        case urlEncoded:
          return urlEncodedRouter.middleware(req, res, next);
        case multipart:
          return multipartRouter.middleware(req, res, next);
        default:
          return next(new ApiError().pushInvalid(12, "/"));
      }
    })
    .use(endpoint, route);

useRouter.default = (router) => useRouter(router, [json]);

module.exports = useRouter;
