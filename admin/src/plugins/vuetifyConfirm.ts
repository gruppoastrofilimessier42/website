import Vue from "vue";
import VuetifyConfirm from "vuetify-confirm";
import { Plugin } from "@nuxt/types";

declare module "vue/types/vue" {
  interface Vue {
    $confirm(str: string, options?: Object): Promise<boolean>;
    $vuetifyConfirm: {
      warning(str: string, options?: Object): Promise<boolean>;
    };
  }
}

const plugin: Plugin = (context) => {
  const config = {
    vuetify: context.app.vuetify,
  };
  Object.defineProperty(config, "buttonTrueText", {
    enumerable: true,
    get: () => context.i18n.t("common.ok"),
  });
  Object.defineProperty(config, "buttonFalseText", {
    enumerable: true,
    get: () => context.i18n.t("common.cancel"),
  });

  Vue.use(VuetifyConfirm, config);
};

// Our custom wrappers
Object.defineProperty(Vue.prototype, "$vuetifyConfirm", {
  get() {
    const vm = this;
    return {
      warning(str: string, options?: Object): Promise<boolean> {
        const defaults = {
          color: "warning",
          buttonTrueColor: "warning",
          title: vm.$t("common.warning"),
          icon: "mdi-alert",
        };
        return vm.$confirm(str, { ...defaults, ...options });
      },
    };
  },
});

export default plugin;
