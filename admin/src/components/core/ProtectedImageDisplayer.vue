<template>
  <v-img :aspect-ratio="aspectRatio" v-bind="$attrs" :src="url">
    <template v-if="(!url && !src) || unavailable">
      <slot>
        <div class="wrapper d-flex justify-center align-center flex-column primary">
          <v-icon size="100">mdi-camera-off</v-icon>
          <span class="text-overline text-nowrap text--secondary">
            {{ $t(`pages.catalog.view.previewNotAvailable`) }}
          </span>
        </div>
      </slot>
    </template>
    <div v-if="!url && src" class="loader d-flex justify-center align-center">
      <v-progress-circular color="primary" indeterminate />
    </div>
  </v-img>
</template>

<script>
export default {
  props: {
    aspectRatio: {
      type: Number,
      required: true,
    },
    src: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      url: null,
      unavailable: false,
    };
  },
  watch: {
    src: {
      handler() {
        this.url = null;
        this.unavailable = false;
        this.fetchProtectedImage();
      },
      immediate: true,
    },
  },
  methods: {
    arrayBufferToBase64(buffer) {
      return Buffer.from(buffer, "binary").toString("base64");
    },
    async fetchProtectedImage() {
      if (!this.src) {
        this.url = null;
        return;
      }

      try {
        const response = await this.$axios.$get(this.src, {
          responseType: "arraybuffer",
        });
        const base64 = this.arrayBufferToBase64(response);
        this.url = `data:image/jpeg;base64,${base64}`;
      } catch {
        this.unavailable = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  border-radius: 4px;
  height: 100%;
}
.loader {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
