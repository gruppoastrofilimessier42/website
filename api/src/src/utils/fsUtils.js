const glob = require("glob");
const path = require("path");
const fs = require("fs-extra");
const crypto = require("crypto");
const urljoin = require("url-join");
const config = require("../config/config");

const safeRemove = async (fsPath) => {
  try {
    return fs.remove(fsPath);
  } catch (e) {
    // nothing to do
  }
};

const findFiles = (pattern, folder, options = {}) => {
  return glob.sync(pattern, {
    nocase: true,
    cwd: folder,
    absolute: true,
    ...options,
  });
};

const findFilesAsync = async (pattern, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    glob(
      pattern,
      {
        nocase: true,
        cwd: folder,
        absolute: true,
        ...options,
      },
      (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      }
    );
  });
};

const getFilePathByFileName = (relativeDirPath, fileName) => {
  const files = findFiles(fileName, relativeDirPath);
  if (!files.length) {
    return undefined;
  }
  const filePath = files[0];
  return filePath;
};

const getFileUrlByFileName = (relativeDirPath, fileName) => {
  const filePath = getFilePathByFileName(relativeDirPath, fileName);
  if (!filePath) return undefined;
  const relativeFolders = path.relative(config.root.folder, filePath).split(path.sep).map(encodeURIComponent);
  return urljoin(config.api.url, ...relativeFolders);
};

function getRandomFilename(ext) {
  const name = crypto.randomBytes(16).toString("hex");
  return ext ? `${name}${ext}` : name;
}

module.exports = {
  safeRemove,
  getFilePathByFileName,
  getFileUrlByFileName,
  findFiles,
  findFilesAsync,
  getRandomFilename,
};
