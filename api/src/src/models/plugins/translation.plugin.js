/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
const _ = require("lodash");
const config = require("../../config/config");
const { isNullOrEmptyString } = require("../../utils/valueCheck");

function translationPlugin(Model) {
  return class extends Model {
    static get translationFields() {
      const Translation = require("../translation/translation.model");
      return Object.entries(this.getRelations())
        .map(([relation, { relatedModelClass }]) => {
          return relatedModelClass === Translation ? relation : undefined;
        })
        .filter((relation) => !!relation);
    }

    async insertTranslations({ transaction }, updateBody = {}) {
      const { translationFields } = this.constructor;
      if (translationFields) {
        const Translation = require("../translation/translation.model");
        const translations = _.merge(_.pick(this, translationFields), _.pick(updateBody, translationFields));
        translationFields.forEach((t) => {
          delete this[t];
          delete updateBody[t];
        });
        const translationsKeys = Object.keys(translations);
        const translationIds = await Promise.all(
          translationsKeys.map(async (translationsKey) => {
            const translationIdField = `${translationsKey}TranslationId`;
            const oldTranslationId = this[translationIdField];
            const body = translations[translationsKey];
            return oldTranslationId
              ? Translation.query(transaction).patchAndFetchById(oldTranslationId, body)
              : Translation.query(transaction).insertAndFetch(body);
          })
        );
        translationsKeys.forEach((translationsKey, i) => {
          this[`${translationsKey}TranslationId`] = translationIds[i].id;
        });
      }
    }

    static async isTranslationTaken(fieldName, value, excludeTaskId, db) {
      const instance = await this.query(db)
        .joinRelated(fieldName)
        .where((qb) => {
          if (this.isSoftDelete) {
            qb.whereNotDeleted();
          }
        })
        .whereNot({ [`${this.tableName}.${this.idColumn}`]: excludeTaskId })
        .where(function () {
          config.locales.forEach((locale) => {
            if (!isNullOrEmptyString(value[locale])) {
              this.orWhere({ [`${fieldName}.${locale}`]: value[locale] });
            }
          });
        })
        .first();
      let duplicatedLocale = false;
      if (instance) {
        Object.keys(value).some((locale) => {
          if (instance[fieldName]?.[locale] === value[locale]) {
            duplicatedLocale = locale;
            return true;
          }
        });
      }
      return duplicatedLocale;
    }

    async $beforeInsert(queryContext) {
      await super.$beforeInsert(queryContext);
      return this.insertTranslations(queryContext);
    }

    static async beforeUpdate(args) {
      await super.beforeUpdate(args);
      const { context, items, inputItems } = args;
      return Promise.all(items.map((item, i) => item.insertTranslations(context, inputItems[i])));
    }

    static async beforeDelete(args) {
      await super.beforeDelete(args);
      const { items, asFindQuery, context } = args;
      const fields = this.translationFields.map((field) => `${field}TranslationId`);
      if (!fields) return;
      const itemList = items?.length ? items : await asFindQuery().select(fields.concat(this.idColumn));
      context.toBeDeletedItems = itemList;
    }

    static async afterDelete(args) {
      await super.afterDelete(args);
      const { items, transaction, context } = args;
      const fields = this.translationFields.map((field) => `${field}TranslationId`);
      if (!fields) return;
      const itemList = context.toBeDeletedItems ?? items;
      const Translation = require("../translation/translation.model");
      const ids = [].concat(...itemList.map((item) => fields.map((field) => item[field])));
      if (ids.length) {
        await Translation.$getQuery(transaction, {}).whereIn(Translation.idColumn, ids).delete();
      }
    }

    $formatJson(json) {
      const obj = super.$formatJson(json);
      const translationIds = this.constructor.translationFields?.map((field) => `${field}TranslationId`);
      return _.omit(obj, translationIds);
    }
  };
}

module.exports = translationPlugin;
