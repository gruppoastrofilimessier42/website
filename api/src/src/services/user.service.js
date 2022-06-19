const httpStatus = require("http-status");
const generator = require("generate-password");
const { User } = require("../models");
const ApiError = require("../errors/apiError/apiError");
const { adminUser } = require("../config/config");
const { getByIdForValidation } = require("../utils/validationUtils");
const { isChanged } = require("../utils/valueCheck");
const { roles } = require("../config/roles");

const createUser = async (userBody, db, eagerFields) => {
  return User.$create(userBody, db, eagerFields, { roles: "roles" });
};

const queryUsers = (filter, db) => {
  return User.$paginate(filter, db);
};

const isEmailTaken = async (email, excludeUserId = null, db, eagerFields) => {
  const user = await User.$getQuery(db, eagerFields).findOne({ email }).whereNot({ id: excludeUserId });
  return !!user;
};

const countUsers = async (filter = {}, db) => {
  const res = await User.$getQuery(db).where(filter).count("id", { as: "num" });
  return res[0].num;
};

const getUserById = (id, db, eagerFields) => {
  return User.$getById(id, db, eagerFields);
};

const getUserByEmail = (email, db, eagerFields) => {
  return User.$getQuery(db, eagerFields).findOne({ email });
};

const updateUser = (user, updateBody, db, eagerFields) => {
  return user.$patch(updateBody, db, eagerFields, { roles: "roles" });
};

const deleteUser = (user, db) => {
  return user.$query(db).delete();
};

const countAdmin = (db) => countUsers((qb) => qb.modify("filterByRoles", adminUser.roles), db);

/**
 * Generates a new password for the user
 * @param {User} user
 * @returns {Promise<User>}
 */
const generatePassword = () => {
  return generator.generate({
    length: 8,
    numbers: true,
    excludeSimilarCharacters: true,
    strict: true,
  });
};

const getUserOrNotFound = async (userId, trx, eagerFields) => {
  const error = new ApiError(httpStatus.NOT_FOUND);
  const dbUser = await getUserById(userId, trx, eagerFields);
  error.pushIfNotDBExists(dbUser, "/params/id").throwIf();
  return dbUser;
};

const userValidation = async (user, trx, dbUser) => {
  const error = new ApiError();

  // Can't change my role
  const editingMyself = dbUser?.isEqual(trx.reqUser);
  const isChangingOwnRole =
    editingMyself && isChanged(user, { ...dbUser, roles: dbUser.roles.map((r) => r.code) }, "roles");
  error.pushIfTruthy(isChangingOwnRole, "/body/roles/$", 8);

  // Detect invalid roles
  const invalidRoles = user.roles?.some((role) => !roles.includes(role));
  error.pushIfTruthy(invalidRoles, "/body/roles/$", 100);

  // Detect mail already taken
  const sameEmailUser = await getByIdForValidation(user, "email", trx, dbUser, false)(getUserByEmail);
  return error.pushIfTruthy(sameEmailUser, "/body/email", 7);
};

module.exports = {
  createUser,
  queryUsers,
  countUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getUserOrNotFound,
  userValidation,
  isEmailTaken,
  countAdmin,
  generatePassword,
};
