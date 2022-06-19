const schedule = require("node-schedule");
const {
  removeExpiredUploadGrants,
  removeExpiredTokens,
  removeExpiredUploadsUnfinalized,
  removeEmptyFolders,
} = require("./jobs");

module.exports = function schedulerSetup() {
  schedule.scheduleJob({ hour: 3, minute: 0 }, removeExpiredUploadGrants);
  schedule.scheduleJob({ hour: 3, minute: 5 }, removeExpiredTokens);
  schedule.scheduleJob({ hour: 3, minute: 10 }, removeExpiredUploadsUnfinalized);
  schedule.scheduleJob({ hour: 3, minute: 20 }, removeEmptyFolders);
};
