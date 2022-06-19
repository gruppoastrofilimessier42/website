const allRoles = {
  admin: ["getUsers","manageUsers"],
};

const roles = Object.keys(allRoles);
const roleGrants = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleGrants,
  allGrants: [...new Set(Object.values(roleGrants))],
};
