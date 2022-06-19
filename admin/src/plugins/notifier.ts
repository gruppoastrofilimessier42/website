import { Plugin } from "@nuxt/types";
import colors from "vuetify/es5/util/colors";

declare module "vue/types/vue" {
  interface Vue {
    $notifier: {
      showMessage(content: string, color: string): void;
      showSuccessMessage(content?: string): void;
      showErrorMessage(content?: string | Error): void;
      showFormErrorMessage(content?: string | Error): void;
      showInfoMessage(content: string): void;
    };
  }
}

const plugin: Plugin = (context, inject) => {
  inject("notifier", {
    showMessage(content: string, color: string) {
      context.store.commit("snackbar/showMessage", { content, color });
    },
    showSuccessMessage(content: string = context.app.i18n.t("common.operationSuccess") as string) {
      this.showMessage(content, colors.green.base);
    },
    showErrorMessage(content: string | Error) {
      if (content instanceof Error) {
        const errors = (content as any).response?.data?.errors ?? [];
        const error = errors?.[0];
        if (error?.detail) {
          content = error.detail;
        }
      }
      content = content ?? context.app.i18n.t("error.generic");
      this.showMessage(content, colors.red.base);
    },
    showFormErrorMessage(content: string | Error) {
      if (content instanceof Error) {
        const errors = (content as any).response?.data?.errors ?? [];
        const error = errors?.[0];
        if (error.detail) {
          content = error.detail;
        }
      }
      content = content ?? context.app.i18n.t("error.form.invalid");
      this.showMessage(content, colors.red.base);
    },
    showInfoMessage(content: string) {
      this.showMessage(content, colors.lightBlue.lighten2);
    },
  });
};

export default plugin;
