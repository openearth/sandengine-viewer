<template>
  <v-layout fluid>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-media src="static/images/argus.jpg" title="src: zandmotor @flickr" height="200px">
        </v-card-media>
        <v-card-text>
          This site shows examples of the available datasets from the zandmotor project.
        </v-card-text>

      </v-card>
    </v-flex>



  </v-layout>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
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
