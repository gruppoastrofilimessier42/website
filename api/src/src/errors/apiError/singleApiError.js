class SingleApiError extends Error {
  detail;
  code;
  source;
  meta;
  status;
  constructor(detail, code, pointer, meta, status) {
    super(detail);
    this.detail = detail;
    this.code = code;
    this.source = { pointer };
    this.meta = meta;
    this.status = status;
  }
}

module.exports = SingleApiError;
