const moment = require("moment");
const { uploadService } = require("../services");
const inTransaction = require("../utils/inTransaction");

module.exports = async () => {
  try {
    inTransaction(async (trx) =>
      uploadService.deleteUploadsUnfinalized((builder) => builder.where("expires", "<", moment.utc().toDate()), trx)
    );
  } catch (e) {
    console.log(e);
  }
};
