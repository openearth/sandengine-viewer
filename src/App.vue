<template>

  <v-app>
    <v-navigation-drawer
      fixed
      clipped
      app
      v-model="drawer"
      >
      <v-list dense>
        <v-list-tile href="#/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#/morphology">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>morphology</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="blue darken-3"
      dark
      app
      clipped-left
      fixed
      >
      <v-toolbar-title class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>
      <v-text-field
        solo
        prepend-icon="search"
        placeholder="Search"
        ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img
            src="https://vuetifyjs.com/static/doc-images/logo.svg"
            alt="Logo"
            >
        </v-avatar>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <router-view/>
      </v-container>
    </v-content>
    <v-btn
      fab
      bottom
      right
      color="pink"
      dark
      fixed
      >
      <v-icon>add</v-icon>
    </v-btn>

  </v-app>

</div>
</template>

<script>
  export default {
  name: 'app',
  data: function() {
  return {
  drawer: false
  }
  }
  }
</script>

<style>
  #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  }
</style>
