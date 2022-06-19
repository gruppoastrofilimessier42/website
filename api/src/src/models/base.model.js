/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
const { Model, mixin, QueryBuilder } = require("objection");
const path = require("path");
const _ = require("lodash");
const async = require("async");
const moment = require("moment");
const urljoin = require("url-join");
const visibilityPlugin = require("objection-visibility").default;
const { snakeCase } = require("../utils/stringUtils");
const config = require("../config/config");
const { isNullOrEmptyString } = require("../utils/valueCheck");
const { safeRemove } = require("../utils/fsUtils");
const BaseQueryBuilder = require("./base.queryBuilder");
const { extractRelationFields } = require("./base.utils");
const { uploadPlugin, booleanPlugin, modifiersPlugin, translationPlugin } = require("./plugins");

/**
 * Base class for all objection models
 * @extends Model
 */
class Base extends mixin(Model, [
  visibilityPlugin,
  /* uploadPlugin, */ booleanPlugin,
  modifiersPlugin,
  translationPlugin,
]) {
  static get QueryBuilder() {
    return BaseQueryBuilder;
  }

  static get tableDotId() {
    return `${this.tableName}.${this.idColumn}`;
  }

  static get eagerSchema() {
    return {};
  }

  static get publicFields() {
    return [];
  }

  static get publicFieldsAndId() {
    return this.publicFields?.concat(this.idColumn);
  }

  static get relations() {
    return Object.values(this.getRelations());
  }

  get stringId() {
    return this.$id().toString();
  }

  get isModel() {
    return !!this[this.constructor.idColumn];
  }

  get relations() {
    return this.constructor.relations;
  }

  static async beforeUpdate(args) {
    const { context } = args;
    if (context.softDelete) {
      await this.beforeDelete(args);
    } else if (context.undelete) {
      // nothing to do
    } else {
      await super.beforeUpdate(args);
    }
  }

  // TODO butta dopo aver fatto plugin upload
  static async afterFind(args) {
    const result = (await super.afterFind(args)) || args.result;
    if (["Upload"].includes(this.name)) {
      return result;
    }

    const { transaction } = args;
    const Upload = require("./upload/upload.model");

    await Promise.all(
      result.map(async (el) => {
        if (!el.isModel) {
          return;
        }

        const { fileFields = {}, hidden = [] } = el.constructor;

        //Uploads routine
        const files = await async.reduce(Object.keys(fileFields), {}, async (files, responseFileField) => {
          if (hidden.includes(fileFields[responseFileField])) {
            return files;
          }
          const fileColumnName = fileFields[responseFileField];
          const fileId = el[fileColumnName];
          if (!isNullOrEmptyString(fileId)) {
            const { createdAt, updatedAt, id, userId, filename, ...file } = await Upload.query(transaction).findById(
              fileId
            );
            const relativeFolders = path
              .relative(config.root.folder, path.join(config.upload.folder, await el.path))
              .split(path.sep)
              .map(encodeURIComponent);
            const url = urljoin(config.api.url, ...relativeFolders, filename);
            files[responseFileField] = { ...file, url };
          }
          return files;
        });
        Object.assign(el, files);
      })
    );
    return result;
  }

  // TODO butta dopo aver fatto plugin upload
  static async beforeDelete(args) {
    await super.beforeDelete(args);
    const { items = [], transaction } = args;

    // on commit remove from fs any file related to each item if needed
    transaction.onCommit(async () => {
      await Promise.allSettled(
        items.map(async (el) => {
          const elClass = el.constructor;
          const shouldDeleteFsDependencies = el.isModel && elClass.deleteFilesOnDeletion && elClass.fileFields;
          if (!shouldDeleteFsDependencies) {
            return;
          }

          const elFolderPath = path.join(config.upload.folder, await el.path);
          // remove only single files instead of the entire directory
          if (el.singleFileDeletion) {
            const Upload = require("./upload/upload.model");
            const fileFields = Object.values(el.constructor.fileFields);
            await Promise.all(
              fileFields
                .filter((fileField) => !!el[fileField])
                .map(async (fileField) => {
                  const { filename } = await Upload.query(transaction).findById(el[fileField]);
                  safeRemove(path.join(elFolderPath, filename));
                })
            );
          }
          // remove entire directory
          else {
            safeRemove(elFolderPath);
          }
        })
      );
    });
  }

  // TODO butta dopo aver fatto plugin upload
  static get deleteFilesOnDeletion() {
    return !this.isSoftDelete;
  }

  // TODO butta dopo aver fatto plugin upload
  get path() {
    return path.join(this.constructor.tableName, this[this.constructor.idColumn].toString());
  }

  static $getById(id, db, eagerFields = this.eagerSchema) {
    return this.query(db).withGraphFetched(eagerFields).findById(id);
  }

  static $getQuery(db, eagerFields = this.eagerSchema) {
    return this.query(db).withGraphJoined(eagerFields);
  }

  static $paginate(filter, db, context, additionalQueryBuilder, isFilter) {
    const { paginate } = require("../utils/objectionUtils");
    return paginate(this, filter, db, context, additionalQueryBuilder, isFilter);
  }

  /**
   *
   * @returns {import("objection").QueryBuilder}
   */
  static $filter(filter, db, context, additionalQueryBuilder) {
    return this.$paginate(filter.removePagination(), db, context, additionalQueryBuilder, true);
  }

  static makeFilter(reqQuery, eagerSchema, filterFields) {
    const ObjectionFilter = require("../utils/objectionFilter");
    return new ObjectionFilter(this, reqQuery, eagerSchema, filterFields);
  }

  static async $create(body, db, eagerFields = this.eagerSchema, relationIds = {}, relationObjs = {}) {
    const clonedRelationIds = _.cloneDeep(relationIds);
    const clonedRelationObjs = _.cloneDeep(relationObjs);
    extractRelationFields(body, clonedRelationIds, clonedRelationObjs);
    const createdObj = await this.query(db).insertAndFetch(body);
    const relationIdsPromises = Object.entries(clonedRelationIds).map(([k, v]) =>
      createdObj.$insertRelationIds(k, db, v)
    );
    const relationObjectsPromises = Object.entries(clonedRelationObjs).map(([k, v]) =>
      createdObj.$insertRelationObjects(k, db, v)
    );
    await Promise.all([...relationIdsPromises, ...relationObjectsPromises]);
    return createdObj.$query(db).withGraphFetched(eagerFields);
  }

  static async idsExist(resource, propName, db, dbResource, idColumn = this.idColumn, rawOldIds) {
    const ids = [].concat(resource?.[propName]).filter((id) => !!id);
    const oldIds = [].concat(rawOldIds || dbResource?.[propName]).filter((id) => !!id);
    if (!ids.length) {
      return true;
    }
    const toBeCheckedIds = _.difference(ids, oldIds);
    if (!toBeCheckedIds.length) {
      return true;
    }
    const placeholders = toBeCheckedIds.map(() => "?").join(",");
    return !!(
      await this.query(db)
        .knex()
        .raw(
          `select ? = (select count(*) from ${snakeCase(
            this.tableName
          )} where ${idColumn} in (${placeholders})) as res`,
          [toBeCheckedIds.length, ...toBeCheckedIds]
        )
    )?.[0]?.[0].res;
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.createdAt = moment.utc().toDate();
  }

  async $beforeUpdate(opt, queryContext) {
    this.updatedAt = moment.utc().toDate();
    if (!queryContext.softDelete) {
      await super.$beforeUpdate(opt, queryContext);
    }
  }

  // questo è quello giusto
  // $formatJson(json) {
  //   const { createdAt, updatedAt, deletedAt, ...ret } = super.$formatJson(json);
  //   return ret;
  // }

  $formatJson(json) {
    const { createdAt, updatedAt, deletedAt, ...ret } = super.$formatJson(json);
    const filesIds = Object.values(this.constructor.fileFields || {});
    return _.omit(ret, [...filesIds]);
  }

  // Return a new updated object WITHOUT mutate the original
  async $patch(
    updateBody,
    db,
    eagerFields = this.constructor.eagerSchema,
    relationIds = {},
    relationObjs = {},
    modifiers
  ) {
    const clonedRelationIds = _.cloneDeep(relationIds);
    const clonedRelationObjs = _.cloneDeep(relationObjs);
    extractRelationFields(updateBody, clonedRelationIds, clonedRelationObjs);
    const instance = this.$clone();
    const updatePromise = instance.$query(db).patch(updateBody);
    const relationIdsPromises = Object.entries(clonedRelationIds).map(([k, v]) => instance.$patchRelationIds(k, db, v));
    const relationObjectsPromises = Object.entries(clonedRelationObjs).map(([k, v]) =>
      instance.$patchRelationObjects(k, db, v)
    );
    await Promise.all([updatePromise, ...relationIdsPromises, ...relationObjectsPromises]);
    const updated = await this.$query(db).withGraphFetched(eagerFields).modify(modifiers);
    return Object.assign(instance, updated); // Use assign to keep properties added by modifiers ecc...
  }

  async $patchRelationIds(relationName, db, ids) {
    await this.$relatedQuery(relationName, db).unrelate();
    return this.$insertRelationIds(relationName, db, ids);
  }

  async $insertRelationIds(relationName, db, ids = []) {
    // if(relazione === Upload){
    // const uploadId = // UploadUnfinalized.finalize(id) copia il file nella vera destinazione,
    // crea un upload finalizzato e elimina il corrispondente unfinalizedUpload(non il file), ritorna uploadId
    // Nella beforeDelete di UploadUnfinalized faccio db.onCommit(elimino file temporaneo) - FATTO
    // Nella beforeCreate di Upload faccio db.onRollback( elimino file vero) - MANCA IL PATH! Convienve farlo in uploadPlugin mi sa
    // }
    return Promise.all([].concat(ids).map((id) => this.$relatedQuery(relationName, db).relate(id)));
  }

  async $insertRelationObjects(relationName, db, objects = []) {
    return Promise.all([].concat(objects).map((obj) => this.$relatedQuery(relationName, db).insert(obj)));
  }

  // static async getNextOrder(db) {
  //   return (await this.query(db).modify("getNextOrder").first()).nextOrder;
  // }

  async $patchRelationObjects(relation, db, object) {
    if (!object) {
      return;
    }
    const objects = [].concat(object);
    const idField = this.constructor.getRelations()[relation].relatedModelClass.idColumn;
    const oldIds = [].concat(this[relation]).toIds(idField);
    const toBeUpdatedObjectIds = objects.toIds(idField);
    const toBeDeletedObjectIds = _.difference(oldIds, toBeUpdatedObjectIds);
    const toBeCreatedObjects = objects.discardIfHasId(idField);
    const toBeUpdatedObjects = objects.filter((ref) => toBeUpdatedObjectIds?.includes(ref[idField]));
    const createPromises = toBeCreatedObjects?.map((obj) => this.$relatedQuery(relation, db).insert(obj)) || [];
    const updatePromises =
      toBeUpdatedObjects?.map((obj) => this.$relatedQuery(relation, db).findById(obj[idField]).patch(obj)) || [];
    const deletePromise = this.$relatedQuery(relation, db).whereIn(idField, toBeDeletedObjectIds).delete();
    return Promise.all([...createPromises, ...updatePromises, deletePromise]);
  }

  isEqual(modelInstance) {
    return [].concat(this.constructor.idColumn).every((idCol) => modelInstance?.[idCol] === this[idCol]);
  }
}

module.exports = Base;
