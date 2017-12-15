<template>
  <v-container fluid >
    <v-layout class="fluid">
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-media>
            <canvas class="series" height="350"></canvas>
          </v-card-media>
        </v-card>
      </v-flex>
    </v-layout>
    <div class="hidden">
      <img :src="img" v-for="img in images" class="timeseries">
    </div>
  </v-container>
</template>
<script src="./image-timeseries.js"></script>
<style>
  .hidden {
  display: none;
  }
  canvas.series {
  width: 100%;
  }
</style>
