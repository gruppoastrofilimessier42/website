/* eslint-disable global-require */
const { notNullNotEmptyTrimmedString } = require("../../utils/objectionValidation");
const Base = require("../base.model");

/**
 * Class representing an objection Role
 * @extends Base
 */
class BaseUserRole extends Base {
  static get tableName() {
    return "roles";
  }

  static get idColumn() {
    return "code";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        code: notNullNotEmptyTrimmedString,
      },
      required: ["code"],
    };
  }

  $formatJson() {
    return this.code;
  }
}

module.exports = BaseUserRole;
