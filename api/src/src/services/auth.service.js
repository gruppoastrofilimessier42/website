const tokenService = require("./token.service");
const userService = require("./user.service");
const Token = require("../models/token/token.model");
const { tokenTypes } = require("../config/tokens");
const { dbExists } = require("../utils/valueCheck");

const logout = async (refreshTokenDoc, db) => {
  await refreshTokenDoc.$query(db).delete();
};

const refreshAuth = async (refreshToken, db) => {
  const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH, db);
  const user = await userService.getUserById(refreshTokenDoc.userId, db);
  if (!dbExists(user)) {
    throw new Error();
  }
  await refreshTokenDoc.$query(db).delete();
  return tokenService.generateAuthTokens(user, db);
};

const resetPassword = async (resetPasswordToken, newPassword, db) => {
  const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
  const user = await userService.getUserById(resetPasswordTokenDoc.userId, db);
  if (!dbExists(user)) {
    throw new Error();
  }
  await Token.query(db).delete().where({ userId: user.id, type: tokenTypes.RESET_PASSWORD });
  await userService.updateUser(user, { password: newPassword }, db);
};

module.exports = {
  logout,
  refreshAuth,
  resetPassword,
};
