<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-menu
    v-if="!!contextMenu.item"
    :value="!!contextMenu.item"
    :position-x="contextMenu.coord.x"
    :position-y="contextMenu.coord.y"
    absolute
    offset-y
    origin="center center"
    v-on="$listeners"
    @input="contextMenu.item = null"
  >
    <v-card>
      <v-list>
        <template v-for="(action, i) in contextMenu.item.actions()">
          <template v-if="action.subitems && action.subitems.length">
            <v-menu :key="i" absolute offset-y @click.stop>
              <template #activator="{ on, attrs }">
                <v-list-item :key="i" v-bind="attrs" v-on="on">
                  <v-list-item-icon v-if="action.icon" class="mr-2">
                    <v-icon :color="action.iconColor">{{ action.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ $t(action.label) }}</v-list-item-title>
                  <v-list-item-action><v-icon>mdi-menu-right</v-icon></v-list-item-action>
                </v-list-item>
              </template>
              <v-list>
                <v-list-item
                  v-for="(subaction, idx) in action.subitems"
                  :key="idx"
                  @click="invokeAction(subaction.action, _self)"
                >
                  <v-list-item-icon v-if="subaction.icon" class="mr-2">
                    <v-icon :color="subaction.iconColor">{{ subaction.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ $t(subaction.label) }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template v-else>
            <v-list-item :key="i" @click="action.action && action.action(_self)">
              <v-list-item-icon v-if="action.icon" class="mr-2">
                <v-icon :color="action.iconColor">{{ action.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ $t(action.label) }}</v-list-item-title>
            </v-list-item>
          </template>
        </template>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    contextMenu: {
      type: Object,
      required: true,
    },
  },
  methods: {
    invokeAction(action: Function, node: any) {
      const i = this.contextMenu.item;

      // eslint-disable-next-line vue/no-mutating-props
      this.contextMenu.item = null;

      if (action) {
        action.call(i, node);
      }
    },
  },
});
</script>
