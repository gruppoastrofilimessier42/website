const config = require("../config/config");
const knexConfig = require("../../knexfile");

const common = (table, knex) => {
  table.increments("id").primary();
  table.datetime("createdAt").defaultTo(knex.fn.now());
  table.datetime("updatedAt");
};

const softDelete = (table) => {
  table.datetime("deletedAt");
};

const addForeign = (table, col, refTab, onDelete = "RESTRICT", idRefTable, onUpdate = "CASCADE") => {
  const name = [table._tableName, col, "fk"]
    .map((s) => [].concat(s).join("_").toLowerCase())
    .join("_")
    .substr(0, 64);
  return table
    .foreign(col)
    .references(idRefTable || col)
    .inTable(refTab)
    .onDelete(onDelete)
    .onUpdate(onUpdate)
    .withKeyName(name);
};

const longString = 4095;

// eslint-disable-next-line global-require
const getSeedKnex = () => require("knex")(knexConfig[config.env]);

const runSeeds = async (files) => {
  const seedKnex = getSeedKnex();
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    await seedKnex.seed.run({ specific: file });
  }
};

module.exports = {
  addForeign,
  common,
  softDelete,
  longString,
  getSeedKnex,
  runSeeds,
};
