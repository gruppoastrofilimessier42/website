const extractRelationFields = (obj, ...collections) => {
  collections.forEach((c) => {
    Object.keys(c).forEach((k) => {
      const key = c[k];
      const newValue = obj[key];
      delete obj[key];

      if (typeof newValue !== "undefined") {
        c[k] = newValue;
      } else {
        delete c[k];
      }
    });
  });
};

module.exports = {
  extractRelationFields,
};
