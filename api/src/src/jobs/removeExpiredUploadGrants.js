const moment = require("moment");
const { uploadGrantService } = require("../services");
const inTransaction = require("../utils/inTransaction");

module.exports = async () => {
  try {
    inTransaction(async (trx) =>
      uploadGrantService.deleteGrants((builder) => builder.where("expires", "<", moment.utc().toDate()), trx)
    );
  } catch (e) {
    console.log(e);
  }
};
