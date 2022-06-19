const express = require("express");
const multer = require("multer");
const { trx, uploadAuth } = require("../../middlewares");
const { uploadController } = require("../../controllers");
const config = require("../../config/config");
const Upload = require("../../models/upload/upload.model");

const storage = multer.diskStorage({
  destination: config.upload.temporaryFolder,
  filename(req, file, cb) {
    const uniqueName = Upload.generateFilename();
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.route("/").post(uploadAuth, upload.single("file"), trx(uploadController.upload));

module.exports = router;
