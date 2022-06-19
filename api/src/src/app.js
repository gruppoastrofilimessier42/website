// eslint-disable-next-line import/order
const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const i18nextMiddleware = require("i18next-http-middleware");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const i18next = require("./config/i18n")(i18nextMiddleware.LanguageDetector);
const { jwtStrategy } = require("./config/passport");
const ApiError = require("./errors/apiError/apiError");
const {
  error: { errorConverter, errorHandler },
  rateLimiter: { authLimiter },
  allowedContentTypeChecker: { allowedContentTypeChecker },
  snakeToCamelCaseQueryParams,
} = require("./middlewares");
const routes = require("./routes/v1");
const { json } = require("./config/contentTypes");

const app = express();

app.use(i18nextMiddleware.handle(i18next));

if (config.env !== "test") {
  app.use(morgan.logHandler);
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
if (config.env === "development") {
  app.use(helmet({ contentSecurityPolicy: false }));
} else {
  app.use(helmet());
}

// block all content types except application/json
app.use(allowedContentTypeChecker);

// parse json request body
app.use(express.json({ type: [json] }));

// sanitize request data
app.use(xss());

// convert querystring keys from snake_case to camelCase
app.use(snakeToCamelCaseQueryParams);

// gzip compression
app.use(compression());

// enable cors
app.use(cors({ exposedHeaders: ["Content-Disposition"] }));
app.options("*", cors());

// Healthcheck
app.use("/healthcheck", require("express-healthcheck")());

app.use(passport.initialize());
// jwt authentication
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use(/^\/(v\d+\/)?auth$/, authLimiter);
}

// latest version routes
app.use("/", routes);
// v1 api routes
app.use("/v1", routes);

// TODO should think about auth? Maybe not, we use 32byte filename
app.use("/contents", express.static(config.upload.folder));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError().setStatus(httpStatus.NOT_FOUND).pushNotFound("/"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = { app };
