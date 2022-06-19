<script>
import { templates } from "vuelidate-error-extractor";

export default {
  extends: templates.FormWrapper,
  // This is needed to pass serverErrors (reactively) down to FormField components
  reactiveProvide: {
    name: "formWrapper",
    include: ["serverErrors"],
  },
  props: {
    serverErrors: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
