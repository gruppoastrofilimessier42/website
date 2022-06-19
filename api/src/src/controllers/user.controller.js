const httpStatus = require("http-status");
const { userService, emailService } = require("../services");
const { User } = require("../models");
const { paginated, format } = require("../utils/formatter");

const createUser = async (req, res, trx) => {
  const user = req.body;
  const error = await userService.userValidation(user, trx);
  error.throwIf();
  user.password = userService.generatePassword();
  const createdUser = await userService.createUser(user, trx);
  trx.onCommit(() => {
    emailService.sendPasswordEmail(createdUser.email, user.password);
    res.status(httpStatus.CREATED).format(format(res, createdUser));
  });
};

const getUsers = async (req, res, trx) => {
  const filter = User.makeFilter(req.query);
  const result = await userService.queryUsers(filter, trx);
  trx.onCommit(() => res.format(paginated(res, result)));
};

const getUser = async (req, res, trx) => {
  const { id } = req.params;
  const user = await userService.getUserOrNotFound(id, trx);
  trx.onCommit(() => res.format(format(res, user)));
};

const updateUser = async (req, res, trx) => {
  const { id } = req.params;
  const dbUser = await userService.getUserOrNotFound(id);
  const { resetPassword, ...user } = req.body;
  const error = await userService.userValidation(user, trx, dbUser);
  error.throwIf();
  if (resetPassword) {
    user.password = userService.generatePassword();
  }

  const updatedUser = await userService.updateUser(dbUser, user, trx);
  trx.onCommit(() => {
    if (resetPassword) {
      emailService.sendPasswordEmail(updatedUser.email, user.password);
    }
    res.format(format(res, updatedUser));
  });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
};
