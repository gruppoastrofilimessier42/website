<template>
  <div>
    <div class="label primary--text text--darken-1 text-overline font-weight-bold">{{ label }}</div>
    <div class="value font-weight-bold">
      <slot v-if="!isEmpty" />
      <span v-else class="text-caption">{{ $t("common.empty") }}</span>
    </div>
  </div>
</template>

<script>
function getInnerText(node) {
  if (node.text?.trim()) return node.text.trim();
  if (node.children?.length)
    return Array.prototype.reduce.call(
      node.children,
      (acc, subnode) => {
        return acc + getInnerText(subnode);
      },
      ""
    );
  return "";
}

export default {
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  computed: {
    isEmpty() {
      if (!this.$slots.default) {
        return true;
      }
      const content = getInnerText({ text: undefined, children: this.$slots.default });
      return !content;
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  line-height: 1.5;
}
</style>
