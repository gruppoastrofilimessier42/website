const { updateUser } = require("../services/user.service");
const { format } = require("../utils/formatter");

const me = async (req, res) => {
  res.format(format(res, req.user));
};

const changeMyPreferences = async (req, res, trx) => {
  await updateUser(req.user, req.body, trx);
  trx.onCommit(() => res.send());
};

module.exports = {
  me,
  changeMyPreferences,
};
