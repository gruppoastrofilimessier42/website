const httpStatus = require("http-status");
const { allowedContentTypes } = require("../config/config");
const { multipart } = require("../config/contentTypes");
const ApiError = require("../errors/apiError/apiError");

const parseMime = (mime) => {
  if (!mime) {
    return;
  }
  if (mime.includes(multipart)) {
    return multipart;
  }
  return mime;
};

const allowedContentTypeChecker = (req, res, next) => {
  const error = new ApiError(httpStatus.FORBIDDEN);
  const mime = req.get("Content-Type");
  const parsedMime = parseMime(mime);
  // block not allowed content types
  if (parsedMime && !allowedContentTypes.includes(parsedMime)) {
    return next(error.push(9, "/"));
  }
  next();
};

module.exports = {
  allowedContentTypeChecker,
  parseMime,
};
