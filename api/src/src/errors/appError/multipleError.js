class MultipleError extends Error {
  #errors;

  constructor() {
    super();
    this.#errors = [];
  }

  push(e) {
    this.#errors.push(e);
  }

  getErrors() {
    return [].concat(this.#errors);
  }
}

module.exports = MultipleError;
