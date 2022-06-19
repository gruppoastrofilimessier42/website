import { Context } from "@nuxt/types";

export default function (context: Context) {
  const { app } = context;
  function formatDate(date: string, format = "DD/MM/YYYY") {
    if (!date || !app.$moment(date).isValid()) {
      return null;
    }
    return app.$moment(date).format(format);
  }

  function parseDate(date: string, format = "DD/MM/YYYY", outputFormat = "YYYY-MM-DD") {
    const momentDate = context.$moment(date, format);

    if (!momentDate.isValid()) {
      return null;
    }

    return momentDate.format(outputFormat);
  }

  return {
    formatDate,
    parseDate,
  };
}
