const uploader = {
  data() {
    return {
      uploads: {},
    };
  },
  methods: {
    async uploadFile(context, field, file) {
      const fieldName = field + "Filename";
      if (file === null) {
        context.$model[field] = null;
        context[fieldName].$model = null;
        return;
      }
      if (!file?.size) {
        const uploadField = context.$model[field];
        if (uploadField) {
          const hasWhitespace = uploadField.originalFilename?.slice(-1) === " ";
          const text = uploadField.originalFilename;
          uploadField.originalFilename = hasWhitespace ? text.slice(0, -1) : text + " ";
        }
        return;
      }
      context[fieldName].$model = null;
      try {
        const { filename, originalFilename } = await this.$form.uploadFile(context, fieldName, file, this.uploads);
        context[fieldName].$model = filename;
        if (context.$model[field]) {
          context.$model[field].originalFilename = originalFilename;
        } else {
          this.$set(context.$model, field, { originalFilename });
        }
      } catch (e) {
        context[fieldName].$model = null;
      }
    },
    isUploading(context, fieldName) {
      return !!this.uploads[context]?.[fieldName]?.uploading;
    },
    isAnythingUploading() {
      for (const ctx of Object.keys(this.uploads)) {
        for (const field of Object.keys(this.uploads[ctx])) {
          if (this.uploads[ctx][field].uploading) {
            return true;
          }
        }
      }
      return false;
    },
    uploadError(propName) {
      return (model) => !(this.uploads[model]?.[propName]?.error && !this.uploads[model]?.[propName]?.aborted);
    },
    uploadValidations(uploadFields = []) {
      const fieldsValidators = uploadFields.reduce((fieldsValidators, uploadField) => {
        const field = Object.keys(uploadField)[0];
        const fieldName = field + "Filename";
        if (fieldsValidators[field]) {
          fieldsValidators[field] = {};
        }
        fieldsValidators[fieldName] = {
          uploadError: this.uploadError(fieldName),
          ...Object.values(uploadField)?.[0],
        };

        return fieldsValidators;
      }, {});
      return {
        ...fieldsValidators,
        uploading: {
          isUploading() {
            return !this.isAnythingUploading();
          },
        },
      };
    },
    newFile(originalFilename) {
      return new File([""], originalFilename);
    },
  },
};

export default uploader;
