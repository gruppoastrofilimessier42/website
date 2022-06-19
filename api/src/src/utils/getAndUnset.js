const _ = require("lodash");

const getAndUnset = (object, path) => {
  const paths = [].concat(path);
  const values = paths.map((p) => {
    const value = _.get(object, p);
    _.unset(object, p);
    return value;
  });
  return values.length > 1 ? values : values[0];
};

module.exports = getAndUnset;
