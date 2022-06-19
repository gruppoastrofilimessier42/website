const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");
const { Upload, UploadUnfinalized } = require("../models");
const config = require("../config/config");
const { safeRemove } = require("../utils/fsUtils");

const createUploadUnfinalized = async (file, userId, db) => {
  return UploadUnfinalized.query(db).insertAndFetch({
    userId,
    filename: file.filename,
    originalFilename: file.originalname,
    mime: file.mimetype,
    size: file.size,
  });
};

const getUploadByFilename = async (filename, db) => {
  return Upload.query(db).findOne({ filename });
};

const getUploadUnfinalizedByFilename = async (filename, db) => {
  return UploadUnfinalized.query(db).findOne({ filename });
};

const findUploads = async (filter = {}, db) => {
  return Upload.query(db).where(filter);
};

const findUploadsUnfinalized = async (filter = {}, db) => {
  return UploadUnfinalized.query(db).where(filter);
};

const removeOldFileFromDisk = async (destinationFolder, oldFilename) => {
  if (oldFilename) {
    return safeRemove(path.join(destinationFolder, oldFilename));
  }
};

const createFileProps = (object, fileBasicNames = []) => {
  return fileBasicNames
    .filter((basicName) => !_.isUndefined(object[`${basicName}Filename`]))
    .reduce((fileProps, basicName) => {
      const columnName = `${basicName}Id`;
      const inputName = `${basicName}Filename`;
      const filename = object[inputName];
      const oldFileId = object[columnName];
      const fileProp = { basicName, columnName, inputName, filename, oldFileId };
      fileProps.push(fileProp);
      delete object[inputName];
      delete object[basicName];
      delete object[columnName];
      return fileProps;
    }, []);
};

const addFilesIds = (object, fileMappings) => {
  const dbFilesIds = fileMappings
    .filter((fileMapping) => fileMapping.newFileId)
    .map((fileMapping) => ({ [fileMapping.columnName]: fileMapping.newFileId }));
  _.merge(object, ...dbFilesIds);
};

const saveFilesOnDB = async (object, fileBasicNames, db) => {
  const filesProps = createFileProps(object, fileBasicNames);
  if (!filesProps.length) {
    return;
  }
  const fileMappings = await Promise.all(
    filesProps.map(async (fileProp) => {
      const { filename, columnName, oldFileId, basicName } = fileProp;
      let upload;
      let ext;
      const oldFile = oldFileId ? await Upload.query(db).findById(oldFileId) : undefined;
      await oldFile?.$query(db).delete();
      if (filename) {
        const uploadUnfinalized = await UploadUnfinalized.query(db).findOne({ filename });
        ext = path.extname(uploadUnfinalized.originalFilename);
        await uploadUnfinalized.$query(db).delete();
        uploadUnfinalized.filename = uploadUnfinalized.filename + ext;
        upload = await Upload.query(db).insert(_.omit(uploadUnfinalized, "id", "expires"));
      }
      return {
        columnName,
        newFileId: upload?.id,
        unfinalizedFilename: filename,
        ext,
        oldFileId,
        oldFilename: oldFile?.filename,
      };
    })
  );
  addFilesIds(object, fileMappings);
  return fileMappings;
};

const saveFilesOnDisk = async (modelInstance, fileMappings) => {
  if (!fileMappings?.length) {
    return;
  }
  const destinationFolder = path.join(config.upload.folder, await modelInstance.path);
  if (!fs.existsSync(destinationFolder)) {
    await fs.mkdirp(destinationFolder);
  }
  await Promise.all(
    fileMappings
      .filter(({ unfinalizedFilename }) => !!unfinalizedFilename)
      .map(async ({ unfinalizedFilename, ext }) => {
        const destinationPath = path.join(destinationFolder, unfinalizedFilename + ext);
        const unfinalizedPath = path.join(config.upload.temporaryFolder, unfinalizedFilename);
        await fs.move(unfinalizedPath, destinationPath, { overwrite: true });
      })
  );
};

const removeFilesOnDisk = async (modelInstance, fileMappings) => {
  if (!fileMappings?.length) {
    return;
  }
  const destinationFolder = path.join(config.upload.folder, await modelInstance.path);
  if (!fs.existsSync(destinationFolder)) {
    return;
  }

  await Promise.allSettled(
    fileMappings.map(async (file) => {
      const { oldFilename } = file;
      await removeOldFileFromDisk(destinationFolder, oldFilename);
    })
  );
};

const withFiles = async (object, fileBasicNames, callback, db) => {
  const dbFilesMapping = await saveFilesOnDB(object, fileBasicNames, db);
  const modelInstance = await callback(db);
  await saveFilesOnDisk(modelInstance, dbFilesMapping);
  await db.onCommit(async () => removeFilesOnDisk(modelInstance, dbFilesMapping));
  return modelInstance;
};

const deleteUploadsUnfinalized = async (filter = {}, db) => {
  return UploadUnfinalized.query(db).where(filter).delete();
};

module.exports = {
  createUploadUnfinalized,
  findUploads,
  findUploadsUnfinalized,
  getUploadByFilename,
  getUploadUnfinalizedByFilename,
  withFiles,
  saveFilesOnDB,
  saveFilesOnDisk,
  removeFilesOnDisk,
  deleteUploadsUnfinalized,
};
