<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <v-card>
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

<script>
  export default {
  name: 'HelloMorphology',
  data () {
  return {
  msg: 'Welcome to your morphologist...'
  }
  }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
