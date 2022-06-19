const extendQueryBuilder = (Knex) => {
  Knex.QueryBuilder.extend("distinctNotNullAsValue", function (column) {
    return this.distinctAsValue(column).whereNotNull(column).orderBy("value");
  });
  Knex.QueryBuilder.extend("distinctAsValue", function (column) {
    return this.distinct(`${column} as value`).orderBy("value");
  });
};

module.exports = extendQueryBuilder;
