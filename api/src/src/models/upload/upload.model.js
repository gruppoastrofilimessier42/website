const randomstring = require("randomstring");
const config = require("../../config/config");
const BaseUpload = require("./upload.base.model");

/**
 * Class representing a token
 * @extends BaseUpload
 */
class Upload extends BaseUpload {
  static generateFilename(ext = "") {
    const baseFilename = randomstring.generate(config.upload.randomFilenameConfig);
    return `${baseFilename}${ext}`;
  }
}

module.exports = Upload;
