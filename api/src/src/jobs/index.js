const removeExpiredUploadsUnfinalized = require("./removeExpiredUploadsUnfinalized");
const removeExpiredUploadGrants = require("./removeExpiredUploadGrants");
const removeExpiredTokens = require("./removeExpiredTokens");
const removeEmptyFolders = require("./removeEmptyFolders");

module.exports = {
  removeExpiredUploadsUnfinalized,
  removeExpiredTokens,
  removeExpiredUploadGrants,
  removeEmptyFolders,
};
