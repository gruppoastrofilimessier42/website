const { roles } = require("../src/config/roles");
const { common, longString } = require("../src/utils/migrationUtils");

const tables = [
  "whatsHots",
  "uploads",
  "uploadsUnfinalized",
  "translations",
  "userRoles",
  "roles",
  "tokens",
  "uploadGrants",
  "users",
];

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema
    .createTable("users", (table) => {
      common(table, knex);
      table.string("firstName").notNullable();
      table.string("lastName").notNullable();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.string("preferredLanguage").notNullable().defaultTo("en");
    })
    .createTable("translations", (table) => {
      common(table, knex);
      table.string("it", longString);
      table.string("en", longString);
    })
    .createTable("uploadGrants", (table) => {
      common(table, knex);
      table.integer("userId").unsigned().references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
      table.string("token").notNullable().unique().index();
      table.datetime("expires").notNullable();
    })
    .createTable("uploads", (table) => {
      common(table, knex);
      table.integer("userId").unsigned();
      table.string("filename").notNullable().unique().index();
      table.string("originalFilename").notNullable();
      table.string("mime").notNullable();
      table.integer("size").unsigned().notNullable();
    })
    .createTable("uploadsUnfinalized", (table) => {
      common(table, knex);
      table.integer("userId").unsigned();
      table.string("filename").notNullable().unique().index();
      table.string("originalFilename").notNullable();
      table.string("mime").notNullable();
      table.integer("size").unsigned().notNullable();
      table.datetime("expires");
    })
    .createTable("tokens", (table) => {
      common(table, knex);
      table.integer("userId").unsigned().references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
      table.string("token").notNullable().unique().index();
      table.string("type").notNullable();
      table.datetime("expires").notNullable();
      table.boolean("blacklisted").defaultTo(false);
    })
    .createTable("roles", (table) => {
      table.string("code").primary();
    })
    .createTable("userRoles", (table) => {
      table.integer("userId").unsigned().references("id").inTable("users").onDelete("CASCADE").onUpdate("CASCADE");
      table.string("roleCode").references("code").inTable("roles").onDelete("CASCADE").onUpdate("CASCADE");
      table.primary(["userId", "roleCode"]);
    })
    .createTable("whatsHots", (table) => {
      common(table, knex);
      table
        .integer("titleTranslationId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("translations")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
      table
        .integer("imageId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("uploads")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
      table
        .integer("descriptionTranslationId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("translations")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE");
      table.dateTime("publishDateTime").defaultTo(knex.fn.now());
      table.string("link");
    })
    .raw("alter table users add fulltext (first_name,last_name,email)");
  return knex("roles").insert(roles.map((code) => ({ code })));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return tables.reduce((qb, table) => qb.dropTableIfExists(table), knex.schema);
};
