/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
const { mixin } = require("objection");
const Password = require("objection-password")({ allowEmptyPassword: true });
const Base = require("../base.model");
const config = require("../../config/config");
const { positiveIntNotNull, notNullNotEmptyTrimmedString } = require("../../utils/objectionValidation");
const modifiers = require("./user.modifiers");

/**
 * Class representing an objection User
 * @extends Base
 */
class BaseUser extends mixin(Base, [Password]) {
  static get tableName() {
    return "users";
  }

  static get hidden() {
    return ["password"];
  }

  static get virtualAttributes() {
    return ["grants"];
  }

  static get fullTextIndexes() {
    return {
      $q1: "firstName,lastName,email",
    };
  }

  static get modifiers() {
    return { ...super.modifiers, ...modifiers };
  }

  static get publicFields() {
    return ["firstName", "lastName", "email"];
  }

  static get eagerSchema() {
    return { roles: {} };
  }

  static get relationMappings() {
    const Token = require("../token/token.model");
    const Role = require("../role/role.model");

    return {
      tokens: {
        relation: Base.HasManyRelation,
        modelClass: Token,
        join: {
          from: this.tableDotId,
          to: `tokens.userId`,
        },
      },
      roles: {
        relation: Base.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: this.tableDotId,
          through: {
            from: "userRoles.userId",
            to: "userRoles.roleCode",
          },
          to: "roles.code",
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: positiveIntNotNull,
        firstName: notNullNotEmptyTrimmedString,
        lastName: notNullNotEmptyTrimmedString,
        email: { type: "string", format: "email" },
        password: { type: "string", minlength: 8, pattern: "^(?=.*[A-Za-z])(?=.*\\d).{8,}$" },
        preferredLanguage: { type: "string", enum: config.locales },
      },
      required: ["firstName", "lastName", "email"],
    };
  }

  // static async afterFind(args) {
  //   const result = await super.afterFind(args);
  //   result?.forEach((user) => {
  //     user.z = args.transaction.reqUser;
  //   });
  //   return result;
  // }
}

module.exports = BaseUser;
