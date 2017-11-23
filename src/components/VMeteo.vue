<template>
  <div class="meteo">
    <h1 id="message">{{ msg }}</h1>
    <v-card>
      <v-card-text>
        <v-mapbox
          access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
          map-style="mapbox://styles/mapbox/satellite-streets-v10"
          :center="[4.186, 52.050]"
          :zoom="13.16"
          :pitch="5.00"
          :bearing="-0"
          :min-zoom="5"
          id="map"
          ref="map"
          >
          <canvas id="windsock-canvas" width="200" height="200"></canvas>
        </v-mapbox>
      </v-card-text>
    </v-card>


  </div>
</template>

<script src="./v-meteo.js"></script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
   width: 100%;
  }
  h1, h2 {
  font-weight: normal;
  }
  ul {
  list-style-type: none;
  padding: 0;
  }
  li {
  display: inline-block;
  margin: 0 10px;
  }
  a {
  color: #42b983;
  }
  #map {
  text-align: left;
  height: 80vh;
  width:  100vw;
  }
  #windsock-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index:5;
  }
</style>
