const { roles } = require("../config/roles");

const getUserConfiguration = (req, res) => {
  const result = { roles };
  res.send(result);
};

module.exports = {
  getUserConfiguration,
};
