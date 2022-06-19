import { locales, localeCodes, fallbackLocale } from "./locales";

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: "server",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - Gam42",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/scss/style"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/vueReactiveProvide",
    "@/plugins/notifier",
    "@/plugins/vuelidate",
    "@/plugins/vuetifyConfirm",
    "@/plugins/axios",
    "@/plugins/moment",
    "@/plugins/utils",
    "@/plugins/form",
    "@/plugins/i18n",
    "@/plugins/l",
    "@/plugins/vuetifyDatetimePicker",
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: ["~/components", "~/components/core", "~/components/app"],
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/stylelint
    "@nuxtjs/stylelint-module",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    // https://www.npmjs.com/package/@nuxtjs/moment
    "@nuxtjs/moment",
  ],

  // Moment module
  moment: {
    defaultLocale: fallbackLocale,
    // The "en.js" file does not exist in moment/locales. By the way, "en" is the default locale therefore we can filter it altogether
    locales: localeCodes.filter((locale) => {
      return locale !== "en";
    }),
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://auth.nuxtjs.org/guide/setup
    "@nuxtjs/auth-next",
    // https://i18n.nuxtjs.org/setup
    "@nuxtjs/i18n",
    // https://www.npmjs.com/package/vuetify-dialog
    "vuetify-dialog/nuxt",
  ],

  // Router
  router: {
    middleware: ["auth"],
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_URL,
  },

  env: {
    apiBaseURL: process.env.API_URL,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    optionsPath: "~/vuetify.options.js",
    treeShake: true,
  },

  // Auth module
  auth: {
    plugins: ["@/plugins/services"],
    redirect: {
      login: "/login",
      logout: "/login",
      home: "/",
    },
    strategies: {
      local: {
        scheme: "refresh",
        token: {
          property: "access.token",
        },
        refreshToken: {
          property: "refresh.token",
          data: "refreshToken",
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: {
            url: "/auth/login",
            method: "POST",
          },
          logout: false,
          user: {
            url: "/me",
            method: "GET",
          },
          refresh: {
            url: "/auth/refresh-tokens",
            method: "POST",
          },
        },
      },
    },
  },

  // i18n module
  i18n: {
    locales: locales.map((locale) => ({
      ...locale,
      file: `${locale.code}/index.js`,
    })),
    defaultLocale: fallbackLocale,
    lazy: true,
    langDir: "locales/",
    detectBrowserLanguage: {
      useCookie: true,
    },
    strategy: "no_prefix",
    vueI18n: {
      fallbackLocale,
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
