const moment = require("moment");
const { tokenService } = require("../services");
const inTransaction = require("../utils/inTransaction");

module.exports = async () => {
  try {
    inTransaction(async (trx) =>
      tokenService.deleteTokens((builder) => builder.where("expires", "<", moment.utc().toDate()), trx)
    );
  } catch (e) {
    console.log(e);
  }
};
