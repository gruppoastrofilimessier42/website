const express = require("express");
const { auth, trx, validate } = require("../../middlewares");
const { authValidation } = require("../../validations");
const { authController } = require("../../controllers");

const router = express.Router();

router.post("/login", validate(authValidation.login), trx(authController.login));
router.post("/logout", auth(), validate(authValidation.logout), trx(authController.logout));
router.post("/refresh-tokens", validate(authValidation.refreshTokens), trx(authController.refreshTokens));
router.get("/verify-token", validate(authValidation.verifyToken), trx(authController.verifyToken));
router.post("/forgot-password", validate(authValidation.forgotPassword), authController.forgotPassword);
router.post("/reset-password", validate(authValidation.resetPassword), authController.resetPassword);

module.exports = router;
