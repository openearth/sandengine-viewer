<template>
  <div class="hidden">
    <div v-for="(item, index) in meta" :id="'morphology-' + index">
      <video :width="500" :height="1250" :src="baseUrl + '/' + item.mp4" autoplay loop class="hidden" crossorigin="anonymous"></video>
      <canvas :width="500" :height="1250" class="source hidden"></canvas>
      <canvas :width="500" :height="625" class="dest" :id="'morphology-canvas-' + index"></canvas>
    </div>
  </div>
</template>
<script src="./morphology-canvas.js"></script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hidden {
    display: none;
  }
  .source {
    border: 1px solid green;
  }
  .dest {
   border: 1px solid red;
  }
</style>
