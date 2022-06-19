class SingleError extends Error {
  #field;

  constructor(message, field) {
    super(message);
    this.#field = field;
  }

  getFieldName() {
    return this.#field;
  }
}

module.exports = SingleError;
