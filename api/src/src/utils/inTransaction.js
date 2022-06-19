const { startTransaction } = require("./objectionUtils");

const inTransaction = async (callback, next) => {
  const trx = await startTransaction();
  try {
    const res = await callback(trx);
    await trx.commit();
    if (next) next();
    else return res;
  } catch (e) {
    await trx.rollback();
    if (next) next(e);
    else throw e;
  }
};

module.exports = inTransaction;
