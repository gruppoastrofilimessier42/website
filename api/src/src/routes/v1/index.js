const express = require("express");
const authRoute = require("./auth.route");
const configurationRoute = require("./configuration.route");
const uploadGrantRoute = require("./uploadGrant.route");
const uploadRoute = require("./upload.route");
const meRoute = require("./me.route");
const userRoute = require("./user.route");
const staticRoute = require("./static.route");

const { jsonRouter, useRouter, multipartRouter } = require("../../routers");
const { json } = require("../../config/contentTypes");

const router = express.Router();

useRouter.default(router)("/auth", authRoute);
jsonRouter(router)("/configurations", configurationRoute);
multipartRouter(router)("/upload", uploadRoute);
useRouter(router, json)("/upload-grant", uploadGrantRoute);
useRouter(router, json)("/me", meRoute);
useRouter(router, json)("/users", userRoute);

router.use("/static", staticRoute);

module.exports = router;
