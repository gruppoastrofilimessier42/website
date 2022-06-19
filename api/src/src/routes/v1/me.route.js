const express = require("express");
const { auth, trx, validate } = require("../../middlewares");
const { meValidation } = require("../../validations");
const { meController } = require("../../controllers");

const router = express.Router();

router
  .get("/", auth(), trx(meController.me))
  .patch("/", auth(), validate(meValidation.changeMyPreferences), trx(meController.changeMyPreferences));

module.exports = router;
