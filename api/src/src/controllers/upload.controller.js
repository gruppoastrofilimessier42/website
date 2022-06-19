const httpStatus = require("http-status");
const { uploadService } = require("../services");

const upload = async (req, res, trx) => {
  const { file, user } = req;
  const { filename } = await uploadService.createUploadUnfinalized(file, user.id, trx);
  trx.onCommit(() => res.status(httpStatus.CREATED).send({ filename }));
};

module.exports = {
  upload,
};
