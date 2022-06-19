const express = require("express");
const { auth, trx } = require("../../middlewares");
const { configurationController } = require("../../controllers");

const router = express.Router();

router.get("/user", auth("manageUsers"), trx(configurationController.getUserConfiguration));

module.exports = router;
