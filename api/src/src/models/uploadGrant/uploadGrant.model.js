const moment = require("moment");
const BaseUploadGrant = require("./uploadGrant.base.model");

/**
 * Class representing a uploadGrant
 * @extends BaseUploadGrant
 */
class UploadGrant extends BaseUploadGrant {
  isExpired() {
    return moment.utc().isAfter(moment.utc(this.expires));
  }
}

module.exports = UploadGrant;
