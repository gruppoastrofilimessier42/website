/* eslint-disable global-require */
const path = require("path");
const { safeRemove } = require("../../utils/fsUtils");
const {
  positiveIntNotNull,
  nullablePositiveInt,
  notNullNotEmptyTrimmedString,
  positiveNumberNotNull,
} = require("../../utils/objectionValidation");
const Base = require("../base.model");

/**
 * Class representing an objection Upload
 * @extends Base
 */
class BaseUpload extends Base {
  static get tableName() {
    return "uploads";
  }

  static get virtualAttributes() {
    return [this.uploadFields.url];
  }

  static get relationMappings() {
    const User = require("../user/user.model");
    return {
      user: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${this.tableName}.${this.uploadFields.userId}`,
          to: User.tableDotId,
        },
      },
    };
  }

  static get uploadFields() {
    return {
      userId: "userId",
      filename: "filename",
      originalFilename: "originalFilename",
      mime: "mime",
      size: "size",
      url: "url",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    };
  }

  static get publicFields() {
    const { originalFilename, filename } = this.uploadFields;
    return [originalFilename, filename];
  }

  static get jsonSchema() {
    const { userId, filename, originalFilename, mime, size } = this.uploadFields;
    return {
      type: "object",
      properties: {
        [this.idColumn]: positiveIntNotNull,
        [userId]: nullablePositiveInt,
        [filename]: notNullNotEmptyTrimmedString,
        [originalFilename]: notNullNotEmptyTrimmedString,
        [mime]: notNullNotEmptyTrimmedString,
        [size]: positiveNumberNotNull,
      },
      required: [filename, originalFilename],
    };
  }

  // static async beforeDelete(args) {
  //   await super.beforeDelete(args);
  //   const { items, asFindQuery, transaction, context } = args;
  //   const { uploadMappings } = context;
  //   const itemList = items?.length ? items : await asFindQuery.select([this.idColumn, "filename"]);
  //   transaction.onCommit(async () =>
  //     Promise.all(
  //       uploadMappings.map(({ uploadId, uploadBasePath }) => {
  //         const { filename } = itemList.find((item) => item[this.idColumn] === uploadId);
  //         return safeRemove(path.join(uploadBasePath, filename));
  //       })
  //     )
  //   );
  // }

  // async $beforeInsert(context) {
  //   await super.$beforeInsert(context);
  //   const { transaction, basePath } = context;
  //   transaction.onRollback(() => safeRemove(path.join(basePath, this.filename)));
  // }
}

module.exports = BaseUpload;
