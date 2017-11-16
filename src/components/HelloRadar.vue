<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <v-card >
      <v-card-text>
        <canvas class="canvas"></canvas>
        <video src="/static/movies/radar_2016.mp4" autoplay></video>

      </v-card-text>
    </v-card>


  </div>
</template>

<script>
  import * as d3 from 'd3';
  export default {
    name: 'HelloRadar',
    data () {
      return {
        msg: 'Welcome to your radar...'
      }
    },
    mounted() {
      let canvas = d3.select('canvas');
      console.log('canvas', canvas);

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    width: 100%;
  }
</style>
