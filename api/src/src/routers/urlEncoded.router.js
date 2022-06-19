const express = require("express");
const { urlEncoded } = require("../config/contentTypes");
const ApiError = require("../errors/apiError/apiError");

const middleware = async (req, res, next) => {
  const error = new ApiError();
  const mime = req.get("Content-Type");
  if (mime !== urlEncoded) {
    return next(error.push(9, "/"));
  }
  next();
};
const urlEncodedRouter = (router) => (endpoint, route) =>
  router
    .use(endpoint, middleware)
    .use(endpoint, express.urlencoded({ extended: true }))
    .use(endpoint, route);
urlEncodedRouter.middleware = middleware;

module.exports = urlEncodedRouter;
