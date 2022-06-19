<template>
  <!-- TODO Style this in full height -->
  <v-app>
    <!-- Main app container -->
    <v-main>
      <Nuxt />
    </v-main>

    <Snackbar />
  </v-app>
</template>

<style lang="scss" scoped>
.container {
  height: 100%;
}
.v-application {
  // XXX: add here image if you would
  // background-image: url("~assets/images/bg.jpg");
  background-color: $theme-light-primary-color;
}
</style>
