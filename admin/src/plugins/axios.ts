import { Plugin } from "@nuxt/types";

const plugin: Plugin = ({ $axios, app }) => {
  $axios.onError((error) => {
    if ($axios.isCancel(error)) {
      return;
    }
    const isOperational = !!error?.response?.data?.errors?.[0]?.code;
    if (!isOperational) {
      app.$notifier.showErrorMessage();
    }
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.dir(error);
    }
  });
};

export default plugin;
