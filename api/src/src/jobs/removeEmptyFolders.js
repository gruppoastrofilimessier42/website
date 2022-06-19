const deleteEmpty = require("delete-empty");
const { upload } = require("../config/config");

module.exports = async () => {
  try {
    await deleteEmpty(upload.folder);
  } catch (e) {
    console.log(e);
  }
};
