const injectAll = () => {
  require("string.prototype.replaceall").shim();
  require("./array");
};

module.exports = { injectAll };
