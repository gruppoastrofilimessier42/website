const { Model } = require("objection");
const logger = require("./logger");
const config = require("./config");
const knexConfig = require("../../knexfile");
const { userService } = require("../services");
const { KnexInit } = require("../utils/objectionUtils");
const inTransaction = require("../utils/inTransaction");

const setup = async () => {
  const knex = await KnexInit(knexConfig[config.env]);
  Model.knex(knex);
  try {
    await knex.raw("select 1+1 as result");
    logger.info("knex successful connected to db");
  } catch (e) {
    logger.error("Can't connect to db");
    throw e;
  }
  return knex;
};

// Setup db and install the first user
const init = async () => {
  const knex = await setup();
  const { adminUser, env } = config;
  if (!["production", "development"].includes(env)) {
    return knex;
  }
  await inTransaction(async (trx) => {
    if (!(await userService.countAdmin(trx))) {
      await userService.createUser(adminUser, trx);
      trx.onCommit(() => logger.info(`Admin '${adminUser.email}' created`));
    }
  });
  return knex;
};

module.exports = { init };
