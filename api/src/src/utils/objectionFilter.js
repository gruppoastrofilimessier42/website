const _ = require("lodash");
const omitDeep = require("omit-deep-lodash");
const { isFullTextFilter } = require("./objectionUtils");
const { snakeToCamelCase } = require("./valueCheck");

const getAscDescEscapedColumn = (s) => (s.startsWith("+") || s.startsWith("-") ? s.substring(1) : s);
const getAscDesc = (s) => (s.startsWith("-") ? "desc" : "asc");
const reqQueryToCamelCase = (reqQuery) => {
  if (reqQuery?.filter) {
    reqQuery.filter = Object.entries(reqQuery.filter).reduce(
      (acc, [k, val]) => ({ ...acc, [snakeToCamelCase(k)]: val }),
      {}
    );
  }
};

const buildCondition = (condition, value, Model, prop) => {
  // eslint-disable-next-line default-case
  switch (condition) {
    case "like":
      // TODO Translation handling, se token parsato è in translationFields di model, allora aggiungi fallback. Vedi tipo isFullTextFilter per il parsing
      // else if (Object.keys(leafModel.translationFields || {}).includes(k)) {
      // }
      if (isFullTextFilter(Model, prop)) {
        return { $fullText: value };
      }
      return { $like: `%${value.replaceAll("_", "\\_").replaceAll("%", "\\%")}%` };
    case "concatLike":
      return { $concatLike: value };
    case "round":
      return { $round: value };
    case "roundGte":
      return { $roundGte: value };
    case "roundGt":
      return { $roundGt: value };
    case "roundLte":
      return { $roundLte: value };
    case "roundLt":
      return { $roundLt: value };
    case "eq":
      return { $equals: value };
    case "ne":
      return { $or: [{ $notEquals: value }, { $exists: false }] };
    case "gte":
      return { $gte: value };
    case "gt":
      return { $gt: value };
    case "lte":
      return { $lte: value };
    case "lt":
      return { $lt: value };
    case "in":
      return { $in: value };
    case "existsIn":
      return { $existsIn: value };
    case "exists":
      return { $exists: value };
  }
};

const advancedFilterBuilder = (filter, Model) => {
  const sqlFilter = {};
  Object.entries(filter).forEach(([condition, props]) => {
    Object.entries(props || {}).forEach(([prop, v]) => {
      sqlFilter[prop] = { ...sqlFilter[prop], ...buildCondition(condition, v, Model, prop) };
    });
  });
  return sqlFilter;
};

const setDefaultSort = (Model, reqQuery) => {
  if (!reqQuery.sort) {
    // eslint-disable-next-line no-param-reassign
    reqQuery.sort = []
      .concat(Model.idColumn)
      .map((col) => `-${col}`)
      .join(",");
  }
};

class ObjectionFilter {
  /**
   *
   * @param {*} Model
   * @param {*} reqQuery - {Filter: oggetto con due tipi di props: 1) tipo stringa usa like, 2) tipo object usalo direttamente,
   *                        Fields: array su cui fare una projection/select
   *                        }
   *
   * @param {*} eagerFields - Oggetto le cui proprietà sono scritte in sintassi objectionFilter, se una prop ha oggetto vuoto, vuol dire eagerLoading sempre
   * @param {*} filterFields - Array da usare per fare la pick solo di alcuni filtri, presi da reqQuery.filter
   */
  constructor(Model, reqQuery = {}, eagerSchema, filterFields = []) {
    const eagerFields = omitDeep(eagerSchema || Model.eagerSchema, "$fields");
    reqQueryToCamelCase(reqQuery);
    const pageSize = reqQuery.page?.size || 10;
    const isOverLimit = pageSize == -1 || pageSize > 999;
    setDefaultSort(Model, reqQuery);
    this.order = reqQuery.sort.split(",").map((string) => {
      const dottedNotationColumn = getAscDescEscapedColumn(string);
      return {
        column: dottedNotationColumn
          .replace(/\.(?=.*\.)/g, ":")
          .split(".")
          .map((s) => `\`${s}\``)
          .join("."), // add backticks to escape colon and replace all "." but last one to ":"
        order: getAscDesc(string),
      };
    });
    const eagerForOrder = reqQuery.sort.split(",").reduce((acc, string) => {
      const column = string.split(":")[0];
      return { ...acc, [getAscDescEscapedColumn(column)]: {} }; // TODO Vedere qua come eagerloadare senza fare innerjoin!!! Forse usa $exists in or con true e false ad esempio
    }, {});
    this.$limit = isOverLimit ? 999 : pageSize;
    this.page = reqQuery.page?.number ? reqQuery.page.number - 1 : 0;
    this.$offset = this.$limit * this.page;
    this.fields = reqQuery.fields;
    const filter = filterFields.length ? _.pick(reqQuery.filter, filterFields) : reqQuery.filter || {};
    const sqlFilter = advancedFilterBuilder(filter, Model);
    if (Model.isSoftDelete) {
      sqlFilter.deletedAt = { $exists: false };
    }
    this.eager = _.merge(
      {
        $where: {
          ...eagerForOrder,
          ...sqlFilter,
        },
      },
      eagerFields
    );
  }

  /**
   *
   * @param {*} reqQuery - the req.query object to be enriched by deletedAt filter prop
   * @param {*} props - array of prop that should be checked against deletedAt to avoid results having dependecies softDeleted
   */
  static addDeletedAtProps(reqQuery, props = []) {
    const deletedAtProps = props.reduce((acc, prop) => {
      acc[`${prop}.deletedAt`] = { $exists: false };
      return acc;
    }, {});
    reqQuery.filter = {
      ...reqQuery.filter,
      ...deletedAtProps,
    };
  }

  setFiltersInOr(isOr) {
    if (isOr) {
      if (this.eager.$where.$or) {
        return this;
      }
      this.eager.$where = { $or: Object.entries(this.eager.$where).map(([k, v]) => ({ [k]: v })) };
      return this;
    }
    return this.setFiltersInAnd(true);
  }

  setFiltersInAnd(isAnd) {
    if (isAnd) {
      if (!this.eager.$where.$or) {
        return this;
      }
      this.eager.$where = this.eager.$where.$or.reduce((acc, el) => ({ ...acc, ...el }), {});
      return this;
    }
    return this.setFiltersInOr(true);
  }

  removePagination() {
    delete this.$limit;
    delete this.$offset;
    delete this.page;
    return this;
  }
}

module.exports = ObjectionFilter;
