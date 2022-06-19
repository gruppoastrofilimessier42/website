/* eslint-disable no-param-reassign */
function modifiersPlugin(Model) {
  return class extends Model {
    static get modifiers() {
      const model = this;
      return {
        publicSelect(qb) {
          if (model.publicFields.length) {
            model.publicFieldsAndId?.forEach((field) => qb.column(model.ref(field)));
          }
        },
        // getNextOrder(qb) {
        //   qb.select(model.raw("CAST(COALESCE(max(`order`) + 1, 1) as int) as nextOrder"));
        // },
      };
    }
  };
}

module.exports = modifiersPlugin;
