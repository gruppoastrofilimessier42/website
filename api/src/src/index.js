require("./plugins").injectAll();
const schedulerSetup = require("./scheduler");
const db = require("./config/db");
const config = require("./config/config");
const logger = require("./config/logger");

let server;

db.init().then(() => {
  // eslint-disable-next-line global-require
  const { app } = require("./app");
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
  schedulerSetup();
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
