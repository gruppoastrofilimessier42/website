/* eslint-disable no-param-reassign */
function booleanPlugin(Model) {
  return class extends Model {
    static get booleanFields() {
      return Object.entries(this.jsonSchema.properties)
        .filter((e) => e[1].type === "boolean")
        .map((e) => e[0]);
    }

    static async afterFind(args) {
      const result = (await super.afterFind(args)) || args.result;
      // Convert tinyInt to boolean
      if (this.booleanFields) {
        result.forEach((el) =>
          this.booleanFields.forEach((field) => {
            if (el[field] !== undefined) {
              el[field] = el[field] == null ? null : !!el[field];
            }
          })
        );
      }
      return result;
    }
  };
}

module.exports = booleanPlugin;
