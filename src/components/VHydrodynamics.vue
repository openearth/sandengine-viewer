<template>
  <div class="meteo">
    <h1>{{ msg }}</h1>
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
  width:  80vw;
  }
</style>
