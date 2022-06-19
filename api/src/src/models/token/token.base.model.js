const Base = require("../base.model");
const { tokenTypes } = require("../../config/tokens");
const {
  notNullNotEmptyTrimmedString,
  nullablePositiveInt,
  positiveIntNotNull,
} = require("../../utils/objectionValidation");

/**
 * Class representing an objection Token
 * @extends Base
 */
class BaseToken extends Base {
  static get tableName() {
    return "tokens";
  }

  static get booleanFields() {
    return ["blacklisted"];
  }

  static get relationMappings() {
    // eslint-disable-next-line global-require
    const User = require("../user/user.model");
    return {
      user: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "tokens.userId",
          to: "users.id",
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
        token: notNullNotEmptyTrimmedString,
        type: { type: "string", enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD] },
        blacklisted: { type: ["boolean", "null"] },
      },
      required: ["token", "type"],
    };
  }
}

module.exports = BaseToken;
