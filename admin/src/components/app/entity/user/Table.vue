<template>
  <LayoutRegistryList>
    <template #filters>
      <TableFilters :filters="filters" @update:filters="$emit('update:filters', $event)">
        <template #default="{ tableFilters }">
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-text-field
                v-model="tableFilters.like.firstName"
                autofocus
                maxlength="50"
                dense
                outlined
                hide-details
                prepend-icon="mdi-account"
                :label="$t(`entity.user.field.firstName`)"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-text-field
                v-model="tableFilters.like.lastName"
                maxlength="50"
                dense
                outlined
                hide-details
                prepend-icon="mdi-account"
                :label="$t(`entity.user.field.lastName`)"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-text-field
                v-model="tableFilters.like.email"
                maxlength="50"
                dense
                outlined
                hide-details
                prepend-icon="mdi-email"
                :label="$t(`entity.user.field.email`)"
              />
            </v-col>
          </v-row>
        </template>
      </TableFilters>
    </template>
    <TableRemote
      :service="UserService"
      :headers="headers"
      :options="options"
      :filters="filters"
      @update:options="$emit('update:options', $event)"
    >
      <template #actions="{ item }">
        <TableActionEdit :label="item.prompt" :item-id="item.id" />
      </template>
    </TableRemote>
  </LayoutRegistryList>
</template>

<script lang="ts">
import Vue from "vue";
import UserService from "~/services/UserService";

export default Vue.extend({
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    filters: {
      type: Object,
      default: null,
    },
  },
  computed: {
    UserService: () => UserService,
    headers() {
      return [
        {
          text: this.$t("entity.user.field.firstName"),
          align: "start",
          value: "firstName",
        },
        {
          text: this.$t("entity.user.field.lastName"),
          align: "start",
          value: "lastName",
        },
        {
          text: this.$t("entity.user.field.email"),
          align: "start",
          value: "email",
        },
      ];
    },
  },
});
</script>
