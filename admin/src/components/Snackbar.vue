<template>
  <v-snackbar v-model="show" :color="color" timeout="5000" v-bind="$attrs" v-on="$listeners">
    <template #action>
      <v-btn text icon @click="show = false">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </template>
    {{ message }}
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: "",
      color: "",
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "snackbar/showMessage") {
        this.message = state.snackbar.content;
        this.color = state.snackbar.color;
        this.show = true;
      }
    });
  },
};
</script>
