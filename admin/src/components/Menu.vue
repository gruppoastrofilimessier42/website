<template>
  <div>
    <template v-for="(group, groupIndex) in menu.items">
      <div v-if="$utils.user.hasGrants(group.grants)" :key="groupIndex">
        <v-list-group v-if="group.children" :prepend-icon="group.icon" no-action>
          <template #activator>
            <v-list-item-title>{{ $t(group.title) }}</v-list-item-title>
          </template>
          <template v-for="(item, itemIndex) in group.children">
            <v-list-item
              v-if="$utils.user.hasGrants(item.grants)"
              :key="itemIndex"
              nuxt
              link
              :to="item.to"
              dense
              @click="itemSelected"
            >
              <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list-group>
        <v-list-item v-else nuxt link :to="group.to" @click="itemSelected">
          <v-list-item-icon>
            <v-icon v-text="group.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t(group.title) }}</v-list-item-title>
        </v-list-item>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Menu from "~/models/Menu";
import IMenuItem from "~/models/IMenuItem";

export default Vue.extend({
  props: {
    items: {
      type: Array as () => IMenuItem[],
      required: true,
    },
  },
  data() {
    return {
      menu: new Menu(this.items),
    };
  },
  methods: {
    itemSelected() {
      this.$emit("link-clicked");
    },
  },
});
</script>

<style scoped lang="scss">
.v-list-item--active {
  color: $theme-light-primary-color;
}
</style>
