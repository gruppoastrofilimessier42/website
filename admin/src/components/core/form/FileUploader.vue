<template>
  <div>
    <v-file-input
      persistent-hint
      :show-size="false"
      v-bind="$attrs"
      :value="currentFile"
      :class="childClass"
      @change="previewFile($event)"
      v-on="$listeners"
    />
    <div v-if="preview" class="image-preview">
      <v-img v-if="previewImage" :src="previewImage" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    file: {
      type: Object,
      default: null,
    },
    childClass: {
      type: String,
      default: null,
    },
    preview: {
      type: Boolean,
    },
  },
  data() {
    return {
      previewImage: this.file?.url ?? null,
      currentFile: this.file ? new File([""], this.file.originalFilename) : null,
    };
  },
  watch: {
    file() {
      if (this.file) {
        if (this.file.url) {
          this.previewImage = this.file.url;
        }
        this.currentFile = new File([""], this.file.originalFilename);
      } else {
        this.previewImage = null;
        this.currentFile = null;
      }
    },
  },
  methods: {
    previewFile(file: File) {
      if (!this.preview) return;

      if (!file) {
        this.previewImage = null;
        return;
      }

      if (file.type !== "") {
        this.previewImage = null;
        const reader = new FileReader();
        reader.onload = () => {
          this.previewImage = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.image-preview {
  text-align: center;
}
</style>
