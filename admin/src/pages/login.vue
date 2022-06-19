<template>
  <div class="wrapper d-flex flex-column justify-center align-center pa-4">
    <!-- <v-card class="mt-16 circle-back-elevation pa-4 d-inline-block" rounded="circle" elevation="12">
      <v-img :src="require('~/assets/images/logo.svg')" />
    </v-card> -->
    <v-card class="login pa-1" elevation="12">
      <div class="mt-n16 text-center">
        <v-card class="pa-4 d-inline-block" flat rounded="circle">
          <v-img :src="require('~/assets/images/logo.svg')" />
        </v-card>
      </div>
      <v-card-title class="d-flex text-h4 text-center mb-2 justify-center">{{ $t("page.login.welcome") }}</v-card-title>
      <v-card-subtitle class="text-caption text-center pb-6">{{ $t("page.login.subtitle") }}</v-card-subtitle>
      <v-card-text>
        <FormWrapper :validator="$v.loginData" :server-errors="serverErrors">
          <form @submit.prevent="userLogin">
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
                  v-model.trim="$v.loginData.email.$model"
                  autofocus
                  v-bind="attrs"
                  outlined
                  :label="$t('entity.user.field.email')"
                  prepend-inner-icon="mdi-account"
                  v-on="on"
                />
              </template>
            </FormField>
            <FormField name="password">
              <template slot-scope="{ attrs, on }">
                <v-text-field
                  v-model.trim="$v.loginData.password.$model"
                  v-bind="attrs"
                  outlined
                  :label="$t('entity.user.field.password')"
                  :type="passwordShown ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="passwordShown ? 'mdi-eye' : 'mdi-eye-off'"
                  v-on="on"
                  @click:append="toggleShowPassword"
                />
              </template>
            </FormField>
            <div>
              <v-btn color="primary" type="submit" :disabled="$v.$invalid || loading" :loading="loading" block large>
                {{ $t("page.login.login") }}
              </v-btn>
            </div>
            <div class="text-center pt-6 pb-2">
              <NuxtLink to="/forgot-password" nuxt>{{ $t("page.login.forgotPassword") }}</NuxtLink>
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

<script>
import { required, email } from "vuelidate/lib/validators";
import { parseApiErrorResponse } from "~/utils/form";
import { page } from "~/mixins";

export default {
  mixins: [page],
  auth: "guest",
  layout: "external",
  data() {
    return {
      loading: false,
      passwordShown: false,
      loginData: {
        email: "",
        password: "",
      },
      serverErrors: {},
    };
  },
  validations: {
    loginData: {
      email: { required, email },
      password: { required },
    },
  },
  computed: {
    title() {
      return this.$t("page.login.title");
    },
  },
  methods: {
    toggleShowPassword() {
      this.passwordShown = !this.passwordShown;
    },
    async userLogin() {
      try {
        this.$v.loginData.$touch();

        this.loading = true;
        await this.$auth.login({
          data: this.loginData,
        });
      } catch (err) {
        this.serverErrors = parseApiErrorResponse(err.response);
        if (this.serverErrors.$) {
          // Manual trick to highlight email and password field without displaying error messages
          this.serverErrors.email = [""];
          this.serverErrors.password = [""];
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
}
.login {
  max-width: 400px;
  width: 100%;
}
.version {
  line-height: 1.3rem;
}
</style>
