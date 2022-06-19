import colors from "vuetify/es5/util/colors";

export default function ({ app }) {
  return {
    breakpoint: {
      mobileBreakpoint: "xs",
    },
    lang: {
      t: (key, ...params) => app.i18n.t(key, params),
    },
    theme: {
      themes: {
        light: {
          primary: "#00a257",
          secondary: "#114418",
          accent: colors.grey.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  };
}
