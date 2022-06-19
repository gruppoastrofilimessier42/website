<template>
  <v-card class="login pa-1" elevation="12">
    <div class="mt-n16 text-center">
      <v-card class="pa-4 d-inline-block" flat rounded="circle">
        <v-img :src="require('~/assets/images/logo.svg')" />
      </v-card>
    </div>
    <v-card-title class="d-flex text-h4 text-center mb-2 justify-center">{{
      $t("page.changePassword.title")
    }}</v-card-title>

    <v-card-text class="pa-8">
      <!-- Reset password Form -->
      <FormWrapper :validator="$v.resetPasswordData" :server-errors="serverErrors">
        <v-form @submit.prevent="resetPassword">
          <v-row no-gutters>
            <v-col cols="12" class="pb-0">
              <FormField name="password">
                <template #default="{ attrs, on }">
                  <v-text-field
                    v-model.trim="$v.resetPasswordData.password.$model"
                    maxlength="50"
                    :label="$t('page.changePassword.newPassword')"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    @click:append="showPassword = !showPassword"
                  />
                </template>
              </FormField>
              <FormField name="repeatPassword">
                <template #default="{ attrs, on }">
                  <v-text-field
                    v-model.trim="$v.resetPasswordData.repeatPassword.$model"
                    maxlength="50"
                    :label="$t('page.changePassword.repeatPassword')"
                    :append-icon="showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showRepeatPassword ? 'text' : 'password'"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    @click:append="showRepeatPassword = !showRepeatPassword"
                  />
                </template>
              </FormField>
            </v-col>
            <v-col cols="12">
              <v-btn block color="primary" type="submit" :disabled="$v.$invalid || loading" x-large :elevation="0">{{
                $t("page.changePassword.title")
              }}</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </FormWrapper>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { required, sameAs, minLength } from "vuelidate/lib/validators";
import Vue from "vue";

export default Vue.extend({
  props: {
    token: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      showPassword: false,
      showRepeatPassword: false,
      resetPasswordData: {
        password: "",
        repeatPassword: "",
      },
      serverErrors: {},
    };
  },
  validations: {
    resetPasswordData: {
      password: {
        required,
        minLength: minLength(8),
        passwordRule(value) {
          return /^(?=.*\d)(?=.*[a-z])/i.test(value);
        },
      },
      repeatPassword: {
        required,
        sameAsPassword: sameAs("password"),
      },
    },
  },
  methods: {
    async resetPassword() {
      try {
        this.loading = true;
        const body = { password: this.resetPasswordData.password };
        const params = { token: this.token };
        await this.$axios.$post("/auth/reset-password", body, { params });
        this.$notifier.showSuccessMessage(this.$t("page.changePassword.passwordChanged") as string);
        this.$router.push({ path: "/login" });
      } catch (e: any) {
        this.$notifier.showErrorMessage(e);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.login {
  max-width: 400px;
  width: 100%;
}
</style>
