import Vue from "vue";
import { MetaInfo } from "vue-meta";

export default Vue.extend({
  head(): MetaInfo {
    return { title: this.title };
  },
  computed: {
    title(): string | undefined {
      return undefined;
    },
    defaultBack(): string | undefined {
      return undefined;
    },
  },
  watch: {
    title: {
      handler() {
        this.updatePage();
      },
      immediate: true,
    },
  },
  mounted() {
    this.$i18n.onLanguageSwitched = this.updatePageTitle;
  },
  methods: {
    updatePage() {
      this.updatePageTitle();
      this.updatePageDefaultBack();
    },
    updatePageTitle() {
      this.$nuxt.$emit("UpdatePageTitle", this.title);
    },
    updatePageDefaultBack() {
      this.$nuxt.$emit("UpdatePageDefaultBack", this.defaultBack);
    },
  },
});
