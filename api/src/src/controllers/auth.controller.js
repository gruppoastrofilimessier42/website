const httpStatus = require("http-status");
const { authService, tokenService, userService, emailService } = require("../services");
const ApiError = require("../errors/apiError/apiError");
const { tokenTypes } = require("../config/tokens");
const catchAsync = require("../utils/catchAsync");
const inTransaction = require("../utils/inTransaction");

const login = async (req, res, trx) => {
  const error = new ApiError(httpStatus.UNAUTHORIZED);
  const { email, password } = req.body;
  const user = await userService.getUserByEmail(email, trx);
  const accessGranted = await user?.verifyPassword(password);
  error.pushIfFalsy(accessGranted, "/body/$", 3).throwIf();

  req.user = user;
  const tokens = await tokenService.generateAuthTokens(user, trx);
  trx.onCommit(() => res.send(tokens));
};

const logout = async (req, res, trx) => {
  const error = new ApiError();
  const { refreshToken } = req.body;
  const refreshTokenDoc = await tokenService.getToken(refreshToken, tokenTypes.REFRESH, false, trx);
  if (!refreshTokenDoc) {
    throw error.pushNotFound("/body/refreshToken");
  }
  await authService.logout(refreshTokenDoc, trx);
  trx.onCommit(() => res.sendStatus(httpStatus.NO_CONTENT));
};

const refreshTokens = async (req, res, trx) => {
  const error = new ApiError(httpStatus.UNAUTHORIZED);
  const { refreshToken } = req.body;
  try {
    const tokens = await authService.refreshAuth(refreshToken, trx);
    trx.onCommit(() => res.send(tokens));
  } catch (e) {
    throw error.pushAuthenticate("/body/refreshToken");
  }
};

const forgotPassword = catchAsync(async (req, res) =>
  inTransaction(async (trx) => {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email, trx);
    if (user) {
      const resetPasswordToken = await tokenService.generateResetPasswordToken(user, trx);
      await emailService.sendResetPasswordEmail(email, resetPasswordToken);
    }
    trx.onCommit(() => res.sendStatus(httpStatus.NO_CONTENT));
  })
);

const resetPassword = catchAsync(async (req, res) =>
  inTransaction(async (trx) => {
    const error = new ApiError();
    try {
      await authService.resetPassword(req.query.token, req.body.password, trx);
    } catch (e) {
      throw error.pushInvalid("resetPasswordFailed", "/query/token");
    }
    trx.onCommit(() => res.status(httpStatus.NO_CONTENT).send());
  })
);

const verifyToken = async (req, res, trx) => {
  const error = new ApiError();
  const { token, type } = req.query;
  try {
    await tokenService.verifyToken(token, type, trx);
  } catch (e) {
    throw error.push(15, "/query/token");
  }
  trx.onCommit(() => res.sendStatus(httpStatus.NO_CONTENT));
};

module.exports = {
  login,
  logout,
  refreshTokens,
  verifyToken,
  forgotPassword,
  resetPassword,
};
