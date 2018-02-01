<template>
<v-app>
  <!-- TODO: temporary off and fix that the drawer collapses again -->
  <v-navigation-drawer fixed temporary clipped app v-model="drawer">
    <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">
            Layers
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <layer-control :layers="layers" :map="map"></layer-control>

    <!-- <v-list dense>
        todo, generate based on router.js
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
      </v-list> -->
  </v-navigation-drawer>
  <v-toolbar light app clipped-left fixed>
    <v-toolbar-title class="ml-0 pl-3">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      Zandmotor data
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon large>
      <v-avatar size="32px" tile>
        <!-- todo replace by company logo -->
        <img src="http://www.dezandmotor.nl/assets/images/logo-de-zandmotor.png" alt="Logo">
      </v-avatar>
    </v-btn>
  </v-toolbar>
  <v-content>
    <v-container fluid fill-height>
      <v-layout fluid row wrap justify-space-between>
        <v-flex sm12 mb-2>
          <h1 id="message">{{ msg }}</h1>
          <v-card id="map">
            <v-card-text>
              <v-mapbox access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA" map-style="mapbox://styles/mapbox/satellite-streets-v10" :center="[4.186, 52.050]" :zoom="13.16" :pitch="5.00" :bearing="-0" :min-zoom="5" id="map" ref="map">
                <canvas id="windsock-canvas" width="200" height="200"></canvas>
              </v-mapbox>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-card :id="'card_'+ plot" v-for="plot in plots" :key="plot" >
          <v-card-actions>
            <v-btn flat icon v-on:click.native="removePlot(plot, $event)">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text >
            <div class="plot-container bk-root" :id="'plot_'+ plot"></div>
          </v-card-text>
        </v-card>

      </v-layout>
      <!-- hidden containers -->
      <div class="hidden">
        <morphology-canvas></morphology-canvas>
      </div>
    </v-container>
  </v-content>
</v-app>
</template>
<script src="./app.js"></script>
<style>
  @import '~mapbox-gl/dist/mapbox-gl.css';


#map {
  text-align: left;
  height: 60vh;
  width: 100%;
}

  .hidden {
    display: none;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
}

#windsock-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  display: none;
}
</style>
