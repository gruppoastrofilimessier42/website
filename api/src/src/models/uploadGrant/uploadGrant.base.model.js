/* eslint-disable global-require */
const moment = require("moment");
const { mixin } = require("objection");
const visibilityPlugin = require("objection-visibility").default;
const config = require("../../config/config");
const { stringWitPattern, positiveIntNotNull, nullablePositiveInt } = require("../../utils/objectionValidation");
const Base = require("../base.model");

/**
 * Class representing an objection UploadGrant
 * @extends Base
 */
class BaseUploadGrant extends mixin(Base, [visibilityPlugin]) {
  static get tableName() {
    return "uploadGrants";
  }

  static get hidden() {
    return ["userId", "expires", "id"];
  }

  static get relationMappings() {
    const User = require("../user/user.model");
    return {
      user: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "uploadGrants.userId",
          to: User.tableDotId,
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: positiveIntNotNull,
        userId: nullablePositiveInt,
        token: stringWitPattern(`^[a-f\\d]{${config.upload.tokenLength * 2}}$`),
      },
      required: ["token"],
    };
  }

  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    this.expires = moment.utc().add(config.upload.tokenExpirationMinutes, "minutes").toDate();
  }
}

module.exports = BaseUploadGrant;
