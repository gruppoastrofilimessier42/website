const httpStatus = require("http-status");
const uploadGrantService = require("../services/uploadGrant.service");
const ApiError = require("../errors/apiError/apiError");

const createGrant = async (req, res, trx) => {
  const grant = await uploadGrantService.createGrant(req.user.id, trx);
  trx.onCommit(() => res.status(httpStatus.CREATED).send({ token: grant.token }));
};

const deleteGrant = async (req, res, trx) => {
  const error = new ApiError();
  const { token } = req.params;
  const uploadGrant = await uploadGrantService.getGrantByToken(token, trx);
  if (!uploadGrant) {
    throw error.setStatus(httpStatus.NOT_FOUND).pushNotFound("/params/token");
  }
  if (req.user.id !== uploadGrant.userId) {
    throw error.setStatus(httpStatus.FORBIDDEN).push(16, "/params/token");
  }
  await uploadGrantService.deleteGrant(uploadGrant, trx);
  trx.onCommit(() => res.status(httpStatus.NO_CONTENT).send());
};

module.exports = {
  createGrant,
  deleteGrant,
};
