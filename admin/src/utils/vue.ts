import _ from "lodash";
import Vue from "vue";

/**
 * Clone and decouple prop
 * @param {Object} context - The object containing dataName key, like the first parameter of Vue.set()
 * @param {String} dataName - The data name you want to set, like the second parameter of Vue.set()
 * @param {String} prop - The prop to clone
 */
export function mergeAndClone(context: any, dataName: string, prop: any) {
  Vue.set(context, dataName, { ...context[dataName], ..._.cloneDeep({ ...prop }) });
}
