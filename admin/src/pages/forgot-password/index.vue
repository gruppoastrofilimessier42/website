<template>
  <div class="wrapper d-flex flex-column justify-center align-center pa-4">
    <v-card class="forgot-password pa-1" elevation="12">
      <div class="mt-n16 text-center">
        <v-card class="pa-4 d-inline-block" flat rounded="circle">
          <v-img :src="require('~/assets/images/logo.svg')" />
        </v-card>
      </div>
      <v-card-title class="d-flex text-h4 text-center mb-2 justify-center">
        {{ $t("page.forgotPassword.title") }}
      </v-card-title>
      <v-card-subtitle class="text-caption text-center pb-6">{{ $t("page.forgotPassword.subtitle") }}</v-card-subtitle>
      <v-card-text>
        <FormWrapper :validator="$v.resetData" :server-errors="serverErrors">
          <form :disabled="sent" @submit.prevent="forgotPassword">
            <FormField name="$">
              <template slot-scope="{ errors }">
                <v-fade-transition>
                  <v-alert v-if="errors.length" type="error" border="left" class="mb-6" prominent dense>
                    {{ errors[0] }}
                  </v-alert>
                </v-fade-transition>
              </template>
            </FormField>

            <FormField name="email">
              <template slot-scope="{ attrs, on }">
                <v-text-field
                  v-model.trim="$v.resetData.email.$model"
                  autofocus
                  v-bind="attrs"
                  outlined
                  :label="$t('entity.user.field.email')"
                  prepend-inner-icon="mdi-account"
                  v-on="on"
                />
              </template>
            </FormField>
            <div>
              <v-btn color="primary" type="submit" :disabled="$v.$invalid || loading" :loading="loading" block large>
                {{ $t("page.forgotPassword.resetPassword") }}
              </v-btn>
            </div>
          </form>
        </FormWrapper>
      </v-card-text>
    </v-card>
    <div class="version text-center text-overline pa-4">
      {{ $t("app.name") }}
      <br />
      <span class="white--text">{{ $t("app.version") }} {{ $store.getters["app/version"] }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { email, required } from "vuelidate/lib/validators";
import { page } from "~/mixins";

export default Vue.extend({
  mixins: [page],
  auth: "guest",
  layout: "external",
  data() {
    return {
      loading: false,
      sent: false,
      resetData: {
        email: "",
      },
      serverErrors: {},
    };
  },
  validations: {
    resetData: {
      email: { required, email },
    },
  },
  computed: {
    title() {
      return this.$t("page.forgotPassword.title");
    },
  },
  methods: {
    async forgotPassword() {
      try {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
        this.loading = true;
        await this.$axios.$post("/auth/forgot-password", { email: this.resetData.email });
        this.sent = true;
      } catch {
      } finally {
        this.$notifier.showSuccessMessage(this.$t("page.forgotPassword.emailSent") as string);
        this.loading = false;
        this.$router.push({ path: "/login" });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
}
.forgot-password {
  max-width: 400px;
  width: 100%;
}
.version {
  line-height: 1.3rem;
}
</style>
