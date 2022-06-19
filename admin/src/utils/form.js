import _ from "lodash";
import jsonpointer from "jsonpointer";

/**
 * Vuelidate Error Extractor parsers from JSONAPI response
 * @param {Object} response JSONAPI compliant response
 * @returns {Object}
 */
export function parseApiErrorResponse(response) {
  const res = {};
  const errors = _.get(response, "data.errors", []);
  errors.forEach(function (error) {
    const pointer = jsonpointer.compile(error.source.pointer);
    pointer.set(res, pointer.get(res) || []);
    pointer.get(res).push(error.detail);
  });
  return _.get(res, "body", {});
}
