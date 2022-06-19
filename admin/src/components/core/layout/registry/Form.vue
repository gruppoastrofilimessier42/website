<template>
  <FormWrapper :validator="v.entity" :server-errors="serverErrors">
    <form :loading="loading" @submit.prevent="submit">
      <v-card>
        <v-card-title v-if="noTabs">
          <v-spacer />
          <div class="d-flex align-center">
            <FormLocaleSelector v-if="showLocales" ref="localeSelector" :locale.sync="locale" :validator="v.locales" />
          </div>
          <slot name="top.extra"></slot>
        </v-card-title>
        <v-card-text>
          <v-tabs v-if="!noTabs" v-model="activeTab" show-arrows>
            <slot :submit="submit" :locale="locale" />
            <v-spacer />
            <div class="d-flex align-center">
              <FormLocaleSelector
                v-if="showLocales"
                ref="localeSelector"
                :locale.sync="locale"
                :validator="v.locales"
              />
            </div>
            <slot name="top.extra"></slot>
          </v-tabs>
          <template v-else>
            <slot :submit="submit" :locale="locale" />
          </template>
        </v-card-text>
        <slot name="actions">
          <v-card-actions v-if="!hideSubmit && submitInActions">
            <slot name="actions.prepend"></slot>
            <FormSave :loading="loading" :disabled="!v.$anyDirty" :in-actions="true" />
          </v-card-actions>
        </slot>
      </v-card>

      <slot v-if="!hideSubmit && !submitInActions" name="submit">
        <FormSave :loading="loading" :disabled="!v.$anyDirty" />
      </slot>
    </form>
  </FormWrapper>
</template>

<script lang="ts">
import Vue from "vue";
import ApiBaseService from "~/services/ApiBaseService";
import { parseApiErrorResponse } from "~/utils/form";

export default Vue.extend({
  props: {
    entity: {
      type: Object,
      required: true,
    },
    id: {
      type: [String, Number],
      required: false,
      default: null,
    },
    v: {
      type: Object,
      required: true,
    },
    service: {
      type: Object as () => ApiBaseService,
      required: true,
    },
    saveOptions: {
      type: Object,
      default: () => undefined,
    },
    showSuccessMessage: {
      type: Boolean,
      default: true,
    },
    backAfterSubmit: {
      type: Boolean,
      default: true,
    },
    beforeSubmit: {
      type: Function,
      default: null,
    },
    hideSubmit: {
      type: Boolean,
      default: false,
    },
    submitInActions: {
      type: Boolean,
      default: false,
    },
    backUrl: {
      type: String,
      default: undefined,
    },
    routeIdName: {
      type: String,
      default: "id",
    },
    noTabs: {
      type: Boolean,
    },
  },
  data() {
    return {
      activeTab: null,
      loading: false,
      serverErrors: {},
      locale: this.$i18n.localeProperties,
    };
  },
  computed: {
    showLocales(): boolean {
      return !!this.v.locales;
    },
  },
  methods: {
    async submit() {
      try {
        const goOn = await this.beforeSubmit?.();
        this.v.$touch();
        (this.$refs.localeSelector as any)?.openIfErrors();
        // Lascia assolutamente goOn === false nella prossima riga
        if (this.v.$invalid || goOn === false) {
          return;
        }
        this.loading = true;
        const item = await this.service.save(
          this.entity,
          this.id ?? this.$route.params?.[this.routeIdName],
          this.saveOptions
        );
        this.$emit("save", item);

        // If you want to add a custom message, do it from the parent component
        if (this.showSuccessMessage) {
          this.$notifier.showSuccessMessage();
        }
        if (this.backAfterSubmit) {
          this.$utils.router.smartBack(this.backUrl);
        }
      } catch (e: any) {
        console.error(e);
        this.serverErrors = parseApiErrorResponse(e.response);
        this.$notifier.showFormErrorMessage();
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
