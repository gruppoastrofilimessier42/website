/* eslint-disable global-require */
const _ = require("lodash");
const urljoin = require("url-join");
const path = require("path");
const { isNullOrEmptyString } = require("../../utils/valueCheck");
const config = require("../../config/config");
const { safeRemove } = require("../../utils/fsUtils");

// RICORDATI CHE AD ESEMPIO PER GLI ARTICOLI DEVI DEFINIRE LA RELAZIONE COME HASMANY E NON MANYTOMANY PER POTER CANCELLARE I FILES ALLA CANCELLAZIONE DI UN ARTICOLO

function uploadPlugin(Model) {
  return class extends Model {
    /**
     * Path where uploads for a specific model instance would be stored.
     * Can be overriden by models and can be async, so if a file need to be stored with a path related to a parent
     * we can just fetch the needed properties from db or anything else.
     */
    get path() {
      return path.join(this.constructor.tableName, this[this.constructor.idColumn].toString());
    }

    static get keep() {
      return this.isSoftDelete;
    }

    static get customFileFields() {
      return {
        certificatoCratore: {
          path: "certificatoCreatore/limettoqua/equasotto",
        },
      };
    }

    static get uploadRelations() {
      const Upload = require("../upload/upload.model");
      return this.relations.filter(
        (relation) => relation instanceof this.BelongsToOneRelation && relation.relatedModelClass === Upload
      );
    }

    static getToBeDeletedUploadRelations() {
      return this.uploadRelations.filter((relation) => !this.relationMappings[relation.name].keep);
    }

    static getToBeDeletedChildrenRelations() {
      const relations = Object.entries(this.getRelations())
        .filter(([, { relatedModelClass }]) => relatedModelClass !== this)
        .map(([, relation]) => relation);
      return relations.filter(
        (relation) =>
          relation instanceof this.HasManyRelation &&
          !this.relationMappings[relation.name].composition &&
          relation.relatedModelClass.hasUploadRelationDeep()
      );
    }

    static hasUploadRelationDeep() {
      if (this.getToBeDeletedUploadRelations().length) {
        return true;
      }
      if (!_.isEmpty(this.customFileFields)) {
        return true;
      }
      return !!this.getToBeDeletedChildrenRelations().length;
    }

    static deleteCustomUploads(items, itemUploadPaths, trx) {
      trx.onCommit(() => {
        const customFileFieldsList = Object.entries(this.customFileFields);
        return Promise.all(
          customFileFieldsList.map(([filenameColumn, { path: basePath }]) => {
            const toBeDeleted = items.filter((item) => !!item[filenameColumn]);
            const removePromise = toBeDeleted.map((item) => {
              const itemBasePath = basePath ?? itemUploadPaths[item.stringId];
              return safeRemove(path.join(config.upload.folder, itemBasePath, item[filenameColumn]));
            });
            return Promise.all(removePromise);
          })
        );
      });
    }

    static async deleteChildren(items, trx) {
      const toBeDeletedChildrenRelations = this.getToBeDeletedChildrenRelations();
      const itemIds = items.map((item) => item.$id());
      const removeQueries = toBeDeletedChildrenRelations.map(({ relatedModelClass }) =>
        relatedModelClass.query(trx).findByIds(itemIds).delete()
      );
      return Promise.all(removeQueries);
    }

    static async deleteUploads({ transaction: trx, items = [], asFindQuery }) {
      const Upload = require("../upload/upload.model");
      const relations = this.getToBeDeletedUploadRelations();
      // DELETE UPLOAD ITEMS
      const toBeDeletedUploadProps = relations.toValues("ownerProp");
      // If delete query is started from a static query we need to fetch the "affected items"
      const itemList = items?.length ? items : await asFindQuery().select(toBeDeletedUploadProps.concat(this.idColumn));
      // Prepare an object with all item paths to be used synchronously after;
      const itemUploadPathsList = await Promise.all(
        itemList.map(async (item) => ({ id: item.stringId, path: await item.path }))
      );
      const itemUploadPaths = itemUploadPathsList.reduce(
        (acc, itemUploadPath) => ({ ...acc, [itemUploadPath.id]: itemUploadPath.path }),
        {}
      );
      // We need the uploadMappings to keep a reference between every uploadId and the specific uploadPath,
      // because in Upload.beforeDelete we must fetch the uploads to retrieve the filename to build the full path
      const getUploadMappings = (item) => {
        const uploadBasePath = itemUploadPaths[item.stringId];
        return toBeDeletedUploadProps.map((uploadProp) => ({ uploadId: item[uploadProp], uploadBasePath }));
      };
      const uploadMappings = itemList.map(getUploadMappings).flat();
      const uploadIds = uploadMappings.toValues("uploadId");
      this.deleteCustomUploads(itemList, itemUploadPaths, trx);
      const deleteUploadQuery = Upload.query(trx).context({ uploadMappings }).findIds(uploadIds).delete();
      const deleteChildrenQuery = this.deleteChildren(itemList, trx);
      await Promise.all([deleteUploadQuery, deleteChildrenQuery]);
    }

    static async beforeDelete(args) {
      await super.beforeDelete(args);
      await this.deleteUploads(args);
    }

    static async afterFind(args) {
      const result = (await super.afterFind(args)) || args.result;
      this.uploadRelations.map(({ name: relationName, ownerProp, relatedProp }) => {
        result.map(async (item) => {
          // item.
        });
      });
    }

    // static async afterFind(args) {
    //   const Upload = require("../upload/upload.model");
    //   const result = (await super.afterFind(args)) || args.result;
    //   if (this.tableName === Upload.tableName) {
    //     return result;
    //   }
    //   const { transaction } = args;

    //   await Promise.all(
    //     result.map(async (el) => {
    //       if (!el.isModel) {
    //         return;
    //       }
    //       const { fileFields = {}, hidden = [] } = el.constructor;
    //       const files = await async.reduce(Object.keys(fileFields), {}, async (acc, responseFileField) => {
    //         // INVECE DI CICLARE SUI FILE FIELDS CICLA SU uploadRelations e poi ricordati anche i custom file fields
    //         if (hidden.includes(fileFields[responseFileField])) {
    //           return acc;
    //         }
    //         const fileColumnName = fileFields[responseFileField];
    //         const fileId = el[fileColumnName];
    //         if (!isNullOrEmptyString(fileId)) {
    //           const { createdAt, updatedAt, id, userId, filename, ...file } = await Upload.query(transaction).findById(
    //             fileId
    //           );
    //           const relativeFolders = path
    //             .relative(config.root.folder, path.join(config.upload.folder, await el.path))
    //             .split(path.sep)
    //             .map(encodeURIComponent);
    //           const url = urljoin(config.api.url, ...relativeFolders, filename);
    //           acc[responseFileField] = { ...file, url };
    //         }
    //         return acc;
    //       });
    //       Object.assign(el, files);
    //     })
    //   );
    //   return result;
    // }

    $formatJson(json) {
      const obj = super.$formatJson(json);
      const fileIds = Object.values(this.constructor.fileFields || {});
      return _.omit(obj, fileIds);
    }
  };
}

module.exports = uploadPlugin;
