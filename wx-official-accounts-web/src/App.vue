<template>
  <v-app>
    <AppBar @on-drawer="(drawer)=> showDrawer=drawer" />
    <Drawer :show-drawer="showDrawer" />

    <v-main class="main-warp grey lighten-5">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from "./components/AppBar";
import Drawer from "./components/Drawer";

export default {
  name: "App",

  components: {
    AppBar,
    Drawer,
  },

  data() {
    return {
      showDrawer: true,
    };
  },

  methods: {},
};
</script>
<style scoped>
.main-warp {
  margin-top: 64px;
}
</style>
