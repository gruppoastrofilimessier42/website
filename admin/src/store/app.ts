// Vuex
const pack = require("../package.json");

export const state = () => ({
  packageVersion: pack.version,
});

export const getters = {
  version: (state: any) => {
    return state.packageVersion;
  },
};
