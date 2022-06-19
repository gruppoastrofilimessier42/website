const { ref } = require("objection");

module.exports = {
  filterByRoles(query, roles) {
    query.whereExists(query.modelClass().relatedQuery("roles").whereIn(ref("code"), roles));
  },
  selectContactFields(qb) {
    qb.columns(["firstName", "lastName", "email"]);
  },
};
