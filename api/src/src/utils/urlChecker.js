const axios = require("axios").default;

const exists = async (link) => {
  try {
    const response = await axios.head(link);

    return response.status === 200;
  } catch {
    return false;
  }
};

module.exports = {
  exists,
};
