/* eslint-disable security/detect-unsafe-regex */
const urljoin = require("url-join");
const path = require("path");
const Knex = require("knex");
const { buildFilter } = require("objection-filter");
const _ = require("lodash");
const Base = require("../models/base.model");
const { sqlVirtualReplace, sqlExtractSelectFromWhere } = require("./sqlVirtualReplace");
const { locales } = require("../config/config");
const config = require("../config/config");
const extendQueryBuilder = require("./extendQueryBuilder");
const { snakeCase, substrCount } = require("./stringUtils");

let knex;

const KnexInit = async (knexConfig) => {
  if (knex) {
    return knex;
  }

  const migrationKnex = Knex(knexConfig);
  await migrationKnex.migrate.latest();
  await migrationKnex.destroy();

  extendQueryBuilder(Knex);
  knex = Knex(knexConfig);
  await knex.raw("SET autocommit=0");
  knex.onTransactionEnd = async function (callback) {
    await callback();
  };
  knex.onCommit = async function (callback) {
    await callback();
  };
  knex.onRollback = async function () {};
  return knex;
};

const startTransaction = async () => {
  const trx = await Base.startTransaction();
  trx.successCallbacks = [];
  trx.errorCallbacks = [];
  const { commit, rollback } = trx;
  trx.commit = async function (...args) {
    await commit.apply(trx, args);
    await Promise.allSettled(trx.successCallbacks.map((f) => f()));
  };
  trx.rollback = async function (...args) {
    await rollback.apply(trx, args);
    await Promise.allSettled(trx.errorCallbacks.map((f) => f()));
  };
  trx.onTransactionEnd = async function (callback) {
    this.successCallbacks.push(callback);
    this.errorCallbacks.push(callback);
  };
  trx.onCommit = async function (callback) {
    this.successCallbacks.push(callback);
  };
  trx.onRollback = async function (callback) {
    this.errorCallbacks.push(callback);
  };

  return trx;
};

const creatorCallback = (Model, object) => async (db) => {
  return Model.query(db).insertAndFetch(object);
};

const updaterCallback = (modelInstance, updateBody) => async (db) => {
  return modelInstance.$patch(updateBody, db);
};

const addFileProps = (reqObject, modelInstance) => {
  const fileFields = Object.values(modelInstance.constructor.fileFields || {});
  const fileProps = _.pick(modelInstance, fileFields);
  Object.assign(reqObject, fileProps);
};

const $jsonContains = (columnName, value) => (builder) =>
  builder.whereRaw(`JSON_CONTAINS(${columnName}, ?)`, `"${value}"`);

/**
 *
 * @param {Model} Model
 * @param {ObjectionFilter} filter
 * @param {transaction | knex} db
 * @returns
 */
const paginate = (Model, filter = {}, db, context = {}, additionalQueryBuilder = {}, isFilter) => {
  const operators = {
    $fullText: (property, operand, builder) => {
      const indexCols = Model.fullTextIndexes[property.split(".").pop()];
      const snakeCaseIndexCols = indexCols.split(",").map(snakeCase).join();
      const value = operand
        .replace(/[+\-><\(\)~*\"@\s]+/g, " ")
        .split(" ")
        .filter((val) => !!val)
        .map((val) => `+${val}`)
        .join(" ");
      return value && builder.whereRaw(`MATCH(${snakeCaseIndexCols}) AGAINST('${value}*' IN BOOLEAN MODE)`);
    },
    $existsIn: (property, operand, builder) => {
      const tableColumn = operand.split(".");
      const [table, column] = tableColumn.length > 1 ? tableColumn : [Model.tableName, ...tableColumn];
      return column && builder.whereIn(property, (iqb) => iqb.distinct(column).from(table));
    },
    $notEquals: (property, operand, builder) => {
      return builder.where(property, "<>", operand);
    },
    $round: (property, operand, builder) => {
      const parts = property.split(".");
      const field = `${parts[0]}.${snakeCase(parts[1])}`;
      return builder.where(builder.knex().raw(`round(${field}, 4)`), operand);
    },
    $roundGte: (property, operand, builder) => {
      const parts = property.split(".");
      const field = `${parts[0]}.${snakeCase(parts[1])}`;
      return builder.where(builder.knex().raw(`round(${field}, 4)`), ">=", operand);
    },
    $roundGt: (property, operand, builder) => {
      const parts = property.split(".");
      const field = `${parts[0]}.${snakeCase(parts[1])}`;
      return builder.where(builder.knex().raw(`round(${field}, 4)`), ">", operand);
    },
    $roundLte: (property, operand, builder) => {
      const parts = property.split(".");
      const field = `${parts[0]}.${snakeCase(parts[1])}`;
      return builder.where(builder.knex().raw(`round(${field}, 4)`), "<=", operand);
    },
    $roundLt: (property, operand, builder) => {
      const parts = property.split(".");
      const field = `${parts[0]}.${snakeCase(parts[1])}`;
      return builder.where(builder.knex().raw(`round(${field}, 4)`), "<", operand);
    },
    $concatLike: (properties, operand, builder) => {
      let firstTableName = "";
      const concat = `CONCAT(${properties
        .split(",")
        .map((property) => {
          const parts = property.split(".");
          if (!firstTableName) {
            [firstTableName] = parts;
          }
          if (parts.length === 1) {
            parts.splice(0, 0, firstTableName);
          }
          return `${parts[0]}.${snakeCase(parts[1])}`;
        })
        .join(", ' ', ")})`;
      return builder.where(
        builder.knex().raw(concat),
        "like",
        `%${operand.replaceAll("_", "\\_").replaceAll("%", "\\%")}%`
      );
    },
  };
  const options = { operators };
  const { order, ...objectionFilters } = filter;
  const query = buildFilter(Model, db, options).build(objectionFilters).modify(additionalQueryBuilder).context(context);

  const knexQuery = query.toKnexQuery();
  const rawSql = knexQuery.toSQL();
  const clonedQuery = knexQuery.clone().clear("order").clear("offset").clear("limit").toSQL();

  query.onBuildKnex((kqb, qb) => {
    const sql = sqlVirtualReplace(rawSql.sql, Model);
    const newKqb = new kqb.constructor(kqb.client);
    const match = sqlExtractSelectFromWhere(sql);
    if (match) {
      const selectFields = match.groups.selectFields.split(",").map((field) => qb.knex().raw(field));
      const fromBindings = rawSql.bindings.slice(0, substrCount(match.groups.from, "?"));
      newKqb.from(qb.knex().raw(match.groups.from, fromBindings));
      qb.from(qb.knex().raw(match.groups.from, fromBindings)); // Serve solo per far capire a objection nel buildKnexQuery che NON DEVE usare il suo builder ma il nostro newKqb!!!
      newKqb.select(...selectFields);
      if (match.groups.where) {
        const whereBindings = _.difference(rawSql.bindings, fromBindings);
        newKqb.where(qb.knex().raw(match.groups.where, whereBindings));
      }
    }
    if (order) {
      const orderWithTranslation = order.map((obj) => {
        const columnNamePath = obj.column.split(".")[0]; // Get rid of .it .en and so on
        const columnNamePathTokens = columnNamePath.split(":");
        const columnName = columnNamePathTokens.pop(); // Take only last part, for example "name"
        const columnPath = columnNamePathTokens.join(":"); // Recreate the columnPath, useful in case of eager realtion
        if (Model.translationFields?.includes(columnName)) {
          return {
            ...obj,
            column: `coalesce(${obj.column}, ${columnPath ? `${columnPath}.` : ""}${columnName}.${locales[0]})`,
          };
        }
        return obj;
      });
      const orderString = orderWithTranslation
        .map(({ column, order }) => {
          const match = column.match(/^`raw\((?<rawField>.*)\)`$/);
          if (match) {
            return `cast(coalesce(${match.groups.rawField}, "") as unsigned) ${order}, ${match.groups.rawField} ${order}`;
          }
          // Snake case without changing : to _ and rejoin with backtick
          const snakeCol = column
            .split(":")
            .map((str) => snakeCase(str))
            .join(":")
            .split(".")
            .map((str) => `\`${str}\``)
            .join(".");
          const columnName = column.replaceAll("`", "");
          const hasProperty =
            columnName === Model.idColumn || Object.keys(Model.jsonSchema?.properties || {}).includes(columnName);
          const tablePrefix = snakeCol.includes(".") ? "" : `\`${snakeCase(Model.tableName)}\`.`;
          const realTablePrefix = hasProperty ? tablePrefix : "";
          return `cast(coalesce(${realTablePrefix}${snakeCol}, "") as unsigned) ${order}, ${realTablePrefix}${snakeCol} ${order}`;
        }) // Beacuse we use raw, need to convert column to snake_case
        .join(",");
      newKqb.orderByRaw(orderString);
    }
    if (filter.$limit) {
      newKqb.limit(filter.$limit);
    }
    if (filter.$offset) {
      newKqb.offset(filter.$offset);
    }
    return newKqb;
  });

  const clonedQuerySql = sqlVirtualReplace(clonedQuery.sql, Model);
  // TODO la replace fatta con select * non funziona nei casi in cui hai select tabella.*
  const countQuery = db
    .fromRaw(`(${clonedQuerySql.replace("select *", "select 1")}) as xxxxxxxxxxxxx`, clonedQuery.bindings)
    .select(db.raw("count(*) as count"));
  if (isFilter) {
    return query;
  }

  return Promise.all([query, countQuery]).then(([results, totalResultsResponse]) => {
    const { count: totalResults } = totalResultsResponse[0];
    const ret = {
      size: filter.$limit,
      number: filter.page + 1,
      results,
      totalPages: Math.ceil(totalResults / filter.$limit),
      totalResults,
    };
    return ret;
  });
};

const getRelatedTables = async (tableName, trx) =>
  trx
    .select("i.tableName", "k.columnName", "k.referencedTableName", "k.referencedColumnName")
    .from({ i: "informationSchema.tableConstraints" })
    .leftJoin({ k: "informationSchema.keyColumnUsage" }, "i.constraintName", "k.constraintName")
    .where("i.constraintType", "FOREIGN KEY")
    .andWhere("k.referencedTableName", snakeCase(tableName));

const changeReferenceEverywhere = async (srcEntity, dstEntity, trx) => {
  const referencedTable = srcEntity.constructor.tableName;
  const relatedTables = await getRelatedTables(referencedTable, trx);
  return Promise.all(
    relatedTables.map((relatedTable) => {
      const { tableName, columnName, referencedColumnName } = relatedTable;
      return trx(tableName)
        .update({ [columnName]: dstEntity[referencedColumnName] })
        .where(columnName, srcEntity[referencedColumnName]);
    })
  );
};

const duplicateReference = (originalEntity, entity, relatedTable, trx) => {
  const relatedTables = [].concat(relatedTable);
  return Promise.all(
    relatedTables.map(async (relatedTable) => {
      const { tableName, columnName, referencedColumnName } = relatedTable;
      const toBeDuplicatedRows = await trx(tableName).where(columnName, originalEntity[referencedColumnName]);
      return Promise.all(
        toBeDuplicatedRows.map(({ id, ...toBeDuplicatedRow }) =>
          trx(tableName).insert({ ...toBeDuplicatedRow, [columnName]: entity[referencedColumnName] })
        )
      );
    })
  );
};

const getLeafModelAndAttribute = (Model, relationString) => {
  const relations = relationString.split(".");
  if (relations.length === 1) {
    return [Model, relationString];
  }
  const relation = relations.shift();
  const relatedModel = Model.getRelations()[relation].relatedModelClass;
  if (relations.length === 1) {
    return [relatedModel, relations[0]];
  }
  return getLeafModelAndAttribute(relatedModel, relations.join("."));
};

const isFullTextFilter = (Model, relationString) => {
  const [leafModel, prop] = getLeafModelAndAttribute(Model, relationString); // TODO verificare se funziona con i fulltext tipo $q1
  return Object.keys(leafModel.fullTextIndexes || {}).includes(prop);
};

const getTrxFromQB = (qb) => qb.context().transaction;

const addFileUrl = (uploadInstance, relativePathCallback) => {
  const uploadInstances = [].concat(uploadInstance).filter((v) => !!v);
  if (!uploadInstances.length) {
    return;
  }
  const UploadModel = uploadInstances[0].constructor;
  uploadInstances.forEach((el) => {
    const relativePath = relativePathCallback
      ? relativePathCallback(el)
      : path.join(UploadModel.tableName, el[UploadModel.uploadFields.filename]);
    const filePath = path
      .relative(config.root.folder, path.join(config.upload.folder, relativePath))
      .split(path.sep)
      .map(encodeURIComponent);
    const url = urljoin(config.api.url, ...filePath);
    el[UploadModel.uploadFields.url] = url;
  });
};

module.exports = {
  $jsonContains,
  paginate,
  startTransaction,
  creatorCallback,
  updaterCallback,
  KnexInit,
  addFileProps,
  getRelatedTables,
  changeReferenceEverywhere,
  getLeafModelAndAttribute,
  isFullTextFilter,
  getTrxFromQB,
  addFileUrl,
  duplicateReference,
};
