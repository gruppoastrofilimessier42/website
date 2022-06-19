Array.prototype.toIds = function (idField = "id") {
  return this.filter((v) => !!v)
    .map((obj) => obj[idField])
    .filter((v) => !!v);
};

Array.prototype.toValues = function (valueField) {
  return this.filter((v) => !!v)
    .map((obj) => obj[valueField])
    .filter((v) => !!v);
};

Array.prototype.discardIfHasId = function (idField = "id") {
  return this.filter((obj) => !obj[idField]);
};
