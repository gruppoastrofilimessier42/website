const BaseUser = require("./user.base.model");
const { roleGrants } = require("../../config/roles");

class User extends BaseUser {
  get grants() {
    return this.roles?.reduce((grants, role) => {
      const currentRoleGrants = roleGrants.get(role.code) || [];
      return [...new Set([...currentRoleGrants, ...grants])];
    }, []);
  }

  isAdmin() {
    return this.roles.some((r) => r.code === "admin");
  }

  hasGrants(...grants) {
    return grants.every((grant) => this.grants.includes(grant));
  }
}

module.exports = User;
