<template>
  <div class="morphology">
    <div v-for="obj in meta">
      <video :width="500" :height="1250" :src="baseUrl + '/' + obj.mp4" autoplay loop></video>
      <canvas :width="500" :height="1250"></canvas>
      <canvas :width="500" :height="625"></canvas>
    </div>
  </div>
</template>
<script src="./morphology-canvas.js"></script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
