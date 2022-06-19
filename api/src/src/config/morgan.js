const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const config = require("./config");
const logger = require("./logger");

morgan.token("errors", (req, res) => JSON.stringify(res.locals.errors) || "");
morgan.token("userid", (req, res) => req.user?.id);
morgan.token("uid", (req, res) => req.user?.uid);
morgan.token("email", (req, res) => req.user?.email);
morgan.token("body", (req, res) => {
  const toBeSkippedUrls = ["/user/password", "/auth/login", "/auth/refresh-tokens", "/upload-grant", "/upload"];
  if (toBeSkippedUrls.includes(req.originalUrl)) {
    return "";
  }
  if (req.body?.user?.password) {
    req.body.user.password = "*****";
  }
  if (req.body?.password) {
    req.body.password = "*****";
  }
  return JSON.stringify(req.body);
});

const getIpFormat = () => (config.env === "production" ? ":remote-addr - " : "");
const successResponseFormat = `${getIpFormat()}:method :url :status - ":response-time ms" [:userid :uid :email] :body`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - ":response-time ms" - errors: :errors [:userid :uid :email] :body`;

const logHandler = morgan(successResponseFormat, {
  skip: (req, res) => {
    const toBeSkippedUrls = ["/healthcheck"];
    return toBeSkippedUrls.includes(req.originalUrl) || req.method === "OPTIONS";
  },
  stream: rfs.createStream("access.log", {
    ...config.logs,
    compress: "gzip",
    history: "history.txt",
  }),
});

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => {
    const toBeSkippedUrls = ["/healthcheck"];
    return toBeSkippedUrls.includes(req.baseUrl) || res.statusCode >= 400;
  },
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (errors) => logger.error(errors) },
});

module.exports = {
  logHandler,
  successHandler,
  errorHandler,
  logger,
};
