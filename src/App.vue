<template>
<v-app>
  <!-- TODO: temporary off and fix that the drawer collapses again -->
  <v-navigation-drawer fixed app v-model="drawer">
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

  </v-navigation-drawer>
  <v-toolbar light app clipped fixed>
    <v-toolbar-title class="ml-0 pl-3">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      Zandmotor data
    </v-toolbar-title>
    <time-slider ref="timeslider" :show-play="false"></time-slider>

    <v-spacer></v-spacer>
      <v-avatar width="64px">
        <a class="btn btn--flat btn--router" icon large href='http://www.dezandmotor.nl/en/' target="parent">
          <img src="static/images/NatureCoastLogo.png" alt="Logo">
        </a>
      </v-avatar>
    <v-avatar size="64px">
        <a class="btn btn--flat btn--router" icon large href='http://www.stw.nl/en' target="parent">
          <img src="static/images/STWlogo.png" alt="Logo">
        </a>
    </v-avatar>
    <v-avatar size="64px">
        <a class="btn btn--flat btn--router" icon large href='https://github.com/openearth/sandmotor-viewer' target="parent">
          <img src="static/images/GitHub-Mark.png" alt="Logo">
        </a>
    </v-avatar>
    <a href="mailto:Arjen.Luijendijk@deltares.nlSubject=Contact%20Zandmotor%20data" target="_top">contact</a>

  </v-toolbar>
  <v-content>
    <v-container fluid fill-height>
      <v-layout fluid row wrap justify-space-between>
        <v-flex sm12 mb-2>
          <v-card id="map">
            <v-card-text>
              <v-mapbox access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA" map-style="mapbox://styles/mapbox/satellite-streets-v10" :center="[4.186, 52.060]" :zoom="12.5" :pitch="5.00" :bearing="-0" :min-zoom="5" id="map" ref="map">
                <canvas id="windsock-canvas" width="200" height="200"></canvas>

              </v-mapbox>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-card :id="'card_'+ plot" v-for="plot in plots" :key="plot" class="mb-1 mr-1">
          <v-card-actions>
            <v-btn flat icon v-on:click="removePlot(plot, $event)">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <div class="plot-container bk-root" :id="'plot_'+ plot"></div>
          </v-card-text>
        </v-card>

      </v-layout>
    </v-container>
  </v-content>
</v-app>
</template>
<script src="./app.js"></script>
<style>
@import '~mapbox-gl/dist/mapbox-gl.css';
@import '~material-design-icons/iconfont/material-icons.css';

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
  display: none;
  left: 0;
  position: fixed;
  top: 0;
  z-index: 5;
}

.bk-root {
    z-index: 0;
}

</style>
