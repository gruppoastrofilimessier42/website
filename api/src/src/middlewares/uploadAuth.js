const httpStatus = require("http-status");
const ApiError = require("../errors/apiError/apiError");
const { userService } = require("../services");
const uploadGrantService = require("../services/uploadGrant.service");
const { startTransaction } = require("../utils/objectionUtils");
const { dbExists } = require("../utils/valueCheck");

const uploadAuth = async (req, res, next) => {
  const apiError = new ApiError();
  const token = req.header("x-upload-grant-token");

  const trx = await startTransaction();
  try {
    if (!token) {
      apiError.setStatus(httpStatus.UNAUTHORIZED).pushAuthenticate("/headers/x-upload-grant-token");
      throw apiError;
    }
    const uploadGrant = await uploadGrantService.getGrantByToken(token, trx);
    if (!uploadGrant || uploadGrant.isExpired()) {
      apiError.setStatus(httpStatus.UNAUTHORIZED).pushAuthenticate("/headers/x-upload-grant-token");
      throw apiError;
    }

    const user = await userService.getUserById(uploadGrant.userId, trx);
    if (!dbExists(user)) {
      apiError.setStatus(httpStatus.UNAUTHORIZED).pushAuthenticate("/headers/x-upload-grant-token");
      throw apiError;
    }

    req.user = user;
    await uploadGrant.$query(trx).delete();
    trx.commit();
    next();
  } catch (e) {
    trx.rollback();
    return next(e);
  }
};

module.exports = uploadAuth;
