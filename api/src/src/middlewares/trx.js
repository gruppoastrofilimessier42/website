/* eslint-disable no-param-reassign */
const catchAsync = require("../utils/catchAsync");
const inTransaction = require("../utils/inTransaction");

const trx = (controller) =>
  catchAsync((req, res) =>
    inTransaction((db) => {
      db.trxContext = { reqUser: req.user };
      db.reqUser = req.user;
      req.trx = db;
      return controller(req, res, db);
    })
  );

module.exports = trx;
