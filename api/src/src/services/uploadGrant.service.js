const { randomBytes } = require("crypto");
const { UploadGrant } = require("../models");
const config = require("../config/config");

const createGrant = async (userId, db) => {
  const token = randomBytes(config.upload.tokenLength).toString("hex");
  return UploadGrant.query(db).insert({ userId, token });
};

const getGrantByToken = async (token, db) => {
  return UploadGrant.query(db).findOne({ token });
};

const deleteGrant = async (grant, db) => {
  return grant.$query(db).delete();
};

const deleteGrants = async (filter = {}, db) => {
  return UploadGrant.query(db).where(filter).delete();
};

module.exports = {
  createGrant,
  getGrantByToken,
  deleteGrant,
  deleteGrants,
};
