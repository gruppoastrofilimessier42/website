/* eslint-disable global-require */
const moment = require("moment");
const path = require("path");
const config = require("../../config/config");
const Base = require("../base.model");
const {
  positiveIntNotNull,
  nullablePositiveInt,
  notNullNotEmptyTrimmedString,
  positiveNumberNotNull,
} = require("../../utils/objectionValidation");
const { safeRemove } = require("../../utils/fsUtils");

/**
 * Class representing an objection Upload
 * @extends Base
 */
class BaseUploadUnfinalized extends Base {
  static get tableName() {
    return "uploadsUnfinalized";
  }

  static get hidden() {
    return ["expires", "userId"];
  }

  static get relationMappings() {
    const User = require("../user/user.model");
    return {
      user: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${this.tableName}.userId`,
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
        filename: notNullNotEmptyTrimmedString,
        originalFilename: notNullNotEmptyTrimmedString,
        mime: notNullNotEmptyTrimmedString,
        size: positiveNumberNotNull,
      },
      required: ["filename", "originalFilename", "mime", "size"],
    };
  }

  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    this.expires = moment.utc().add(config.upload.expirationMinutes, "minutes").toDate();
  }

  static async beforeDelete(args) {
    await super.beforeDelete(args);
    const { transaction, items = [] } = args;
    transaction.onCommit(() =>
      Promise.allSettled(items.map((el) => safeRemove(path.join(config.upload.temporaryFolder, el.filename))))
    );
  }
}

module.exports = BaseUploadUnfinalized;
