<template>
  <v-app>
    <!-- Left bar -->
    <v-navigation-drawer ref="drawer" v-model="drawer" :mini-variant="mini" :expand-on-hover="mini" fixed app width="280px">
      <v-list class="pt-0">
        <!-- App title -->
        <v-list-item class="pa-2" @click="goHome">
          <v-list-item-avatar rounded="0">
            <img :src="require('~/assets/images/logo.svg')" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold text--secondary text-h6">{{ $t("app.name") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- App menu -->
        <Menu :items="menu" @link-clicked="minifyDrawer" />
      </v-list>
      <v-spacer />

      <!-- Version -->
      <div class="version my-2 text-center text-overline grey--text">
        {{ $t("common.version") }} {{ $store.getters["app/version"] }}
      </div>
    </v-navigation-drawer>

    <!-- Top bar -->
    <v-app-bar fixed app color="primary">
      <v-app-bar-nav-icon v-if="$vuetify.breakpoint.xsOnly" @click.stop="toggleDrawer" />
      <v-btn v-if="!!$utils.router.backOptions(defaultBack)" icon @click="$utils.router.smartBack(defaultBack)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-app-bar-title>
        <div>{{ title }}</div>
      </v-app-bar-title>
      <v-spacer />

      <v-menu bottom left offset-y transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn v-if="$vuetify.breakpoint.xsOnly" icon v-bind="attrs" v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
          <v-btn v-else text rounded large class="mr-n3" v-bind="attrs" v-on="on">
            <v-icon left>mdi-account</v-icon>
            {{ $auth.user.firstName }} {{ $auth.user.lastName }}
            <!-- TODO: add virtual prompt property -->
            <v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <!-- Locale switcher -->
          <div v-if="localesNumber > 1 || localesNumber === 'startValue'">
            <ListItemLocaleSwitcher @enumlocales="localesNumber = $event" />
            <v-divider />
          </div>

          <!-- Logout -->
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t(`common.exit`) }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main app container -->
    <v-main>
      <Nuxt />
    </v-main>

    <Snackbar />
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: undefined,
      defaultBack: undefined,
      localesNumber: "startValue",
      clipped: false,
      drawer: this.$vuetify.breakpoint.smAndUp,
    };
  },
  computed: {
    user() {
      return this.$auth.user;
    },
    mini() {
      return !this.$vuetify.breakpoint.xsOnly;
    },
    menu() {
      return [
        {
          icon: "mdi-newspaper",
          title: `navbar.contents`,
          children: [
            {
              title: "entity.whatsHot.collection",
              to: "/contents/whats-hots",
            },
            {
              title: "entity.review.collection",
              to: "/contents/reviews",
            },
            {
              title: "entity.partner.collection",
              to: "/contents/partners",
            },
            {
              title: "entity.appFeature.collection",
              to: "/contents/app-features",
            },
            {
              title: "entity.tutorial.collection",
              to: "/contents/tutorials",
            },
            {
              title: "entity.blogCategory.collection",
              to: "/contents/blog-categories",
            },
            {
              title: "entity.blogArticle.collection",
              to: "/contents/blog-articles",
            },
            {
              title: "entity.faq.collection",
              to: "/contents/faq",
            },
          ],
        },
        // {
        //   icon: "mdi-account-tie",
        //   title: `navbar.administration`,
        //   children: [
        //     {
        //       title: "entity.user.collection",
        //       to: "/administration/users",
        //     },
        //   ],
        // },
      ];
    },
  },
  created() {
    this.$nuxt.$on("UpdatePageTitle", (title) => {
      this.title = title;
    });
    this.$nuxt.$on("UpdatePageDefaultBack", (defaultBack) => {
      this.defaultBack = defaultBack;
    });
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    goHome() {
      this.$router.push("/");
      this.minifyDrawer();
    },
    async logout() {
      try {
        await this.$axios.post(
          "/auth/logout",
          {
            refreshToken: this.$auth.strategy.refreshToken.get(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (e) {
        // nothing to do
      }
      this.$auth.logout();
    },
    minifyDrawer() {
      // Trick to "minify" the drawer while not mobile
      if (this.mini) {
        this.$refs.drawer.isMouseover = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-app-bar-title::v-deep {
  .v-app-bar-title__content {
    width: auto !important;
  }
}
.v-navigation-drawer::v-deep {
  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
  }
}
.version {
  display: none;
}
.v-navigation-drawer--is-mouseover,
.v-navigation-drawer--is-mobile {
  .version {
    display: block;
  }
}
</style>
