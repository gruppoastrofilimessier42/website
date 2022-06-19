import Vue from "vue";

export default ({ $axios, app }, inject) => {
  async function revokeGrant(grant) {
    try {
      await $axios.$delete("/upload-grant/" + grant);
    } catch (e) {}
  }

  async function getGrantToken(cancelToken) {
    return (
      await $axios.$post(
        "/upload-grant",
        {},
        {
          cancelToken,
        }
      )
    ).token;
  }

  function prepareUploadInfo(context, fieldName, uploadInfos) {
    if (!uploadInfos[context]) {
      Vue.set(uploadInfos, context, {});
    }

    let uploadInfo = null;

    if (uploadInfos[context][fieldName]) {
      uploadInfo = uploadInfos[context][fieldName];
      uploadInfo.cancelToken?.cancel();
    }

    uploadInfo = {
      aborted: false,
      uploading: false,
      error: false,
      cancelToken: $axios.CancelToken.source(),
    };
    Vue.set(uploadInfos[context], fieldName, uploadInfo);

    return uploadInfo;
  }

  /**
   * Perform file uploading of the file within the fieldName within the context
   * @param {*} context
   * @param {*} fieldName
   * @param {*} file
   * @param {*} uploadInfos
   */
  async function uploadFile(context, fieldName, file, uploadInfos) {
    const uploadInfo = prepareUploadInfo(context, fieldName, uploadInfos);

    // User cancel pressing X
    if (!file) {
      uploadInfo.aborted = true;
      return;
    }

    let grantToken = null;
    try {
      uploadInfo.uploading = true;

      // Get the grant token
      grantToken = await getGrantToken(uploadInfo.cancelToken.token);

      // Prepare data
      const formData = new FormData();
      formData.append("file", file);

      // Upload the file
      const response = await $axios.$post("/upload", formData, {
        headers: {
          "X-Upload-Grant-Token": grantToken,
        },
        cancelToken: uploadInfo.cancelToken.token,
      });
      return { filename: response.filename, originalFilename: file.name };
    } catch (e) {
      grantToken && (await revokeGrant(grantToken));

      uploadInfo.error = true;
      throw e;
    } finally {
      uploadInfo.uploading = false;
    }
  }

  inject("form", {
    uploadFile,
  });
};
