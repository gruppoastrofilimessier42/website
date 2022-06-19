import Vue from "vue";
import { deserializeQueryComponent, serializeQueryComponent } from "~/utils/query";

export default Vue.extend({
  data() {
    return {
      status: {},
    };
  },
  watch: {
    status: {
      handler() {
        this.serializeUrl();
      },
      deep: true,
    },
  },
  created() {
    this.deserializeUrl();
  },
  methods: {
    serializeUrl() {
      const serializedStatus = serializeQueryComponent(this.status);
      this.$router.replace({ query: { ...this.$route.query, s: serializedStatus } }).catch(() => {});
    },
    deserializeUrl() {
      const urlQueryStatus: string = this.$route.query.s as string;
      if (urlQueryStatus) {
        try {
          this.status = deserializeQueryComponent(urlQueryStatus);
        } catch {}
      }
    },
  },
});
