const jwt = require("jsonwebtoken");
const moment = require("moment");
const httpStatus = require("http-status");
const config = require("../config/config");
const { Token } = require("../models");
const { tokenTypes } = require("../config/tokens");
const ApiError = require("../errors/apiError/apiError");

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = { sub: userId, iat: moment().unix(), exp: expires.unix(), type };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false, db) => {
  const tokenBody = { token, userId, expires: expires.toDate(), type, blacklisted };
  return Token.query(db).insert(tokenBody);
};

const getToken = async (token, type, blacklisted = false, db) => {
  return Token.query(db).findOne({ token, type, blacklisted });
};

const verifyToken = async (token, type, db) => {
  const error = new ApiError(httpStatus.NOT_FOUND);
  const payload = jwt.verify(token, config.jwt.secret);
  const dbToken = await Token.query(db).findOne({ token, type, userId: payload.sub, blacklisted: false });
  error.pushIfNotDBExists(dbToken, "/query/token").throwIf();
  return dbToken;
};

const generateAuthTokens = async (user, db) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, "days");
  const refreshToken = generateToken(user.id, refreshTokenExpires);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH, false, db);

  return {
    access: { token: accessToken, expires: accessTokenExpires.toDate() },
    refresh: { token: refreshToken, expires: refreshTokenExpires.toDate() },
  };
};

const generateResetPasswordToken = async (user, db) => {
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, "minutes");
  const resetPasswordToken = generateToken(user.id, expires);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD, false, db);
  return resetPasswordToken;
};

const deleteTokens = async (filter = {}, db) => {
  return Token.query(db).where(filter).delete();
};

module.exports = {
  generateToken,
  saveToken,
  getToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  deleteTokens,
};
