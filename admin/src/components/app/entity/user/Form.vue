<template>
  <LayoutRegistryForm :entity="entity" :v="$v" :service="UserService" no-tabs>
    <!-- Data -->
    <v-container fluid class="pa-5">
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="3">
          <FormField name="email">
            <template #default="{ attrs, on }">
              <v-text-field
                v-model.trim="$v.entity.email.$model"
                autocomplete="email"
                dense
                outlined
                autofocus
                class="required"
                :disabled="edit"
                :label="$t('entity.user.field.email')"
                prepend-icon="mdi-email"
                v-bind="attrs"
                v-on="on"
              />
            </template>
          </FormField>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3">
          <FormField name="firstName">
            <template #default="{ attrs, on }">
              <v-text-field
                v-model.trim="$v.entity.firstName.$model"
                autocomplete="given-name"
                dense
                outlined
                class="required"
                :label="$t('entity.user.field.firstName')"
                prepend-icon="mdi-account-details"
                v-bind="attrs"
                v-on="on"
              />
            </template>
          </FormField>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3">
          <FormField name="lastName">
            <template #default="{ attrs, on }">
              <v-text-field
                v-model.trim="$v.entity.lastName.$model"
                autocomplete="family-name"
                dense
                outlined
                class="required"
                :label="$t('entity.user.field.lastName')"
                prepend-icon="mdi-account-details"
                v-bind="attrs"
                v-on="on"
              />
            </template>
          </FormField>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <FormField name="roles">
            <template #default="{ attrs, on }">
              <v-select
                v-model.trim="$v.entity.roles.$model"
                :items="roles"
                :disabled="edit && $auth.user.id === entity.id"
                multiple
                dense
                outlined
                chips
                small-chips
                deletable-chips
                clearable
                :item-text="roleName"
                :label="$t('entity.user.field.roles')"
                prepend-icon="mdi-crown"
                v-bind="attrs"
                v-on="on"
              />
            </template>
          </FormField>
        </v-col>
      </v-row>
    </v-container>
  </LayoutRegistryForm>
</template>

<script lang="ts">
import Vue from "vue";
import { email, required } from "vuelidate/lib/validators";
import User from "~/models/entities/User";
import UserService from "~/services/UserService";
import ConfigurationService from "~/services/ConfigurationService";

export default Vue.extend({
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      entity: new User(),
      roles: [],
    };
  },
  validations(): any {
    return {
      entity: {
        email: { required, email },
        firstName: { required },
        lastName: { required },
        roles: {},
      },
      entityDataTab: ["entity.email", "entity.firstName", "entity.lastName"],
    };
  },
  async fetch() {
    const { roles } = await ConfigurationService.getUser();
    this.roles = roles.map((s: any) => ({ value: s }));
  },
  computed: {
    UserService: () => UserService,
    edit(): boolean {
      return !!this.user;
    },
  },

  created() {
    if (this.edit) {
      this.entity = { ...this.entity, ...this.user };
    }
  },

  methods: {
    roleName(item: any): string {
      return this.$t(`entity.user.role.${item.value}`) as string;
    },
  },
});
</script>
