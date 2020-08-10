<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :expand-on-hover="showDrawer"
    src="https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg"
    mobile-breakpoint="960"
    app
    width="260"
  >
    <template v-slot:img="props">
      <v-img color="transparent" v-bind="props" />
    </template>

    <v-divider class="mb-1" />

    <v-list dense nav>
      <v-list-item>
        <v-list-item-avatar class="align-self-center" color="white" contain>
          <v-img src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item class="display-1" v-text="'Roy Lau'" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list expand nav>
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />

      <template v-for="(item, i) in items">
        <base-item :key="`item-${i}`" :item="item" />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import BaseItem from "./Base/Item";

export default {
  name: "Drawer",

  components: { BaseItem },

  props: {
    showDrawer: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    items: [
      {
        title: "概览",
        icon: "mdi-view-dashboard",
        to: "/",
      },
      {
        title: "用户",
        icon: "mdi-account",
        to: "/user",
      },
      {
        title: "素材",
        icon: "mdi-format-font",
        to: "/typography",
      },
      {
        title: "icons",
        icon: "mdi-chart-bubble",
        to: "/components/icons",
      },
      {
        title: "通知中心",
        icon: "mdi-bell",
        to: "/notifications",
      },
    ],
  }),

  methods: {},
};
</script>
