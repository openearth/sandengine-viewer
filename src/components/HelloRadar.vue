<template>
  <div class="radar">
    <h1>Radar data</h1>
    <v-card >
      <v-card-text>
        <svg>

        </svg>
        <canvas class="on" :width="width" :height="height"></canvas>
        <!-- create off canvas to render to -->
        <canvas class="off" :width="width" :height="height"></canvas>
        <video src="static/movies/radar_2016.mp4" autoplay loop></video>
        <div class="placeholder">
        </div>

        <div>
          {{ waves.length }}
        </div>


      </v-card-text>
    </v-card>
  </div>
</template>

<script src="./hello-radar.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /* create placeholder, so the card takes on the proper size */
  .radar .placeholder {
    width: 500px;
    height: 500px;

  }
  /* use absolute positioning so we can overlay items */
  .radar svg {
    position: absolute;
    top: 16px;
    left: 16px;
    width: 500px;
    height: 500px;
    z-index: 100;
  }
  .radar video {
    display: none;
  }
  .radar canvas {
    position: absolute;
    top: 16px;
    left: 16px;
    width: 500px;
    height: 500px;
    border: 1px solid green;
  }
  canvas.off {
    display: none;
  }
  canvas.on {
    background-color: rgb(20, 20, 20);
  }
  /* use deep selector for generated content */
  svg >>> .bleeps {
    opacity: 0.5;
  }
  svg >>> .bleep {
    mix-blend-mode: color-dodge;
  }
  svg >>> .bar {
    fill: none;
    stroke: #33eeff;
    stroke-width: 3;
    filter: blur(1px);
  }
  /* rotate all bleeps separate */
  svg >>> .bleep {
    fill: #33eeff;
  }
  /* rotate the whole image */
  svg {
    animation: rotating 12s linear infinite;
  }



  @keyframes rotating {
    to {transform: rotate(360deg);}
  }
</style>
