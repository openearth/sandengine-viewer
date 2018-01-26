<template>

  <v-app>
    <v-navigation-drawer
      fixed
      clipped
      app
      v-model="drawer"
    >
      <v-list dense>
        <!-- todo, generate based on router.js -->
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
            <v-icon>terrain</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>morphology</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#/radar">
          <v-list-tile-action>
            <v-icon>gps_fixed</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>radar</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#/adcp">
          <v-list-tile-action>
            <v-icon>fa-long-arrow-right</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>adcp</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#/meteo">
          <v-list-tile-action>
            <v-icon>filter_drama</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>meteo</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#/aeolian">
          <v-list-tile-action>
            <v-icon>grain</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>aeolian</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      light
      app
      clipped-left
      fixed
    >
      <v-toolbar-title class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        Zandmotor data
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <!-- todo replace by company logo -->
          <img
            src="http://www.dezandmotor.nl/assets/images/logo-de-zandmotor.png"
            alt="Logo"
          >
        </v-avatar>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout fluid wrap>
          <v-flex sm12 mb-2>
            <v-card id="map">
              <v-card-text>
                <v-mapbox
                  access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
                  map-style="mapbox://styles/mapbox/satellite-streets-v10"
                  :center="[4, 52]"
                  :zoom="10"
                  :pitch="60"
                  :bearing="-0"
                  :min-zoom="5"
                  id="map"
                  ref="map"
                >
                </v-mapbox>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex>
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <!-- todo add legend functionality or remove here.. -->
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

</template>

<!-- TODO: cleanup indentation, make sure you use a .vue compatible editor (multi-mode) or split into separate file -->
<script>
  import 'font-awesome/css/font-awesome.css';
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
  #map {
    text-align: left;
    height: 60vh;
    width:  100%;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;
  }
</style>
