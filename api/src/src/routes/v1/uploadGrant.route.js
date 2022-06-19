const express = require("express");
const { auth, trx, validate } = require("../../middlewares");
const { uploadGrantValidation } = require("../../validations");
const { uploadGrantController } = require("../../controllers");

const router = express.Router();

router.route("/").post(auth(), trx(uploadGrantController.createGrant));

router
  .route("/:token")
  .delete(auth(), validate(uploadGrantValidation.deleteGrant), trx(uploadGrantController.deleteGrant));
module.exports = router;
