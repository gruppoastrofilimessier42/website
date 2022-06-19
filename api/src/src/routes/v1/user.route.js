const express = require("express");
const { auth, trx, validate } = require("../../middlewares");
const { userValidation } = require("../../validations");
const { userController } = require("../../controllers");

const router = express.Router();

router
  .route("/")
  .post(auth("manageUsers"), validate(userValidation.createUser), trx(userController.createUser))
  .get(auth("getUsers"), validate(userValidation.getUsers), trx(userController.getUsers));

router
  .route("/:id")
  .get(auth("getUsers"), validate(userValidation.getUser), trx(userController.getUser))
  .patch(auth("manageUsers"), validate(userValidation.updateUser), trx(userController.updateUser));

module.exports = router;
