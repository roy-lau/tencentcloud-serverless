<template>
  <v-app>
    <AppBar />
    <Drawer />

    <v-main>
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

  data: () => ({
    //
  }),
};
</script>
