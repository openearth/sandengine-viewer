<template>
  <div class="radar">
    <h1>{{ msg }}</h1>
    <v-card >
      <v-card-text>
        <svg></svg>
        <canvas class="on"></canvas>
        <!-- create off canvas to render to -->
        <canvas class="off"></canvas>
        <video src="/static/movies/radar_2016.mp4" autoplay loop></video>
        <div class="placeholder">
        </div>
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
        msg: 'Welcome to your radar...',
        video: null,
        ctxOff: null,
        ctxOn: null,
        playbackRate: 0.05,
        width: 500,
        height: 500
      }
    },
    methods: {
      addBleep() {
        const τ = 2 * Math.PI;
        let svg = d3.select('.radar svg');
        svg.attr('width', this.width);
        svg.attr('height', this.height);

        // Make sure the center is in the middle so we can use css animation
        let g = svg
          .append('g')
          .classed('bleeps', true)
          .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

        // An arc function with all values bound except the endAngle. So, to compute an
        // SVG path string for a given angle, we pass an object with an endAngle
        // property to the `arc` function, and it will return the corresponding string.
        var arc = d3
          .arc()
          .innerRadius(0)
          .outerRadius(this.width/2 - 10);


        let angles = _.map(
          _.range(0, 1 * τ, 0.1),
          (x) => {
            return {
              endAngle: x + 0.1,
              startAngle: x,
              opacity: d3.easeCubicIn(x / τ)
            };
          }
        );

        // list of all arcs, with varying opacity
        var arcs = g
          .selectAll('path')
          .data(angles)
          .enter()
          .append("path")
          .style('opacity', (x) => { return x.opacity; })
          .classed('bleep', true)
          .attr("d", arc);

      },
      subscribeVideo() {
        // Keep track of elements
        this.video = this.$el.querySelector('video');
        this.video.playbackRate = this.playbackRate;
        this.ctxOff = this.$el.querySelector('canvas.off').getContext('2d');
        this.ctxOn = this.$el.querySelector('canvas.on').getContext('2d');

        this.video.addEventListener(
          'play',
          () => { this.videoCallback(); },
          false
        );
      },
      computeFrame() {
        // draw video frame
        const τ = Math.PI * 2;
        // this.ctxOff.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight, 0, 0, this.width, this.height);
        this.ctxOff.drawImage(this.video, 0, 0, 280, 145);
        // Get pixels
        let frame = this.ctxOff.getImageData(0, 0, this.width, this.height);
        let l = frame.data.length / 4;
        for (let i=0; i<l; i++) {
          let r = frame.data[i * 4 + 0];
          let g = frame.data[i * 4 + 1];
          let b = frame.data[i * 4 + 2];
          let u = (r - 127)/127 * 2.0;
          let v = (g - 127)/127 * 2.0;
          let mag = Math.sqrt(u * u + v * v);
          let angle = Math.atan2(v, u);
          // filter on b channel
          if (b > 127) {
            frame.data[i * 4 + 3] = 0;
          }
          // v as function of magnitude
          let val = Math.floor(mag * 255);
          frame.data[i * 4 + 0] = val;
          frame.data[i * 4 + 1] = val;
          frame.data[i * 4 + 2] = val;
        }
        this.ctxOn.putImageData(frame, 0, 0);
      },
      videoCallback() {
        if (this.video.paused || this.video.ended) {
          return;
        }
        this.computeFrame();
        setTimeout(() => {
          this.videoCallback();
        }, 0);
      }
    },
    mounted() {
      this.addBleep();
      this.subscribeVideo();
    }
  }


</script>

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
    mix-blend-mode: color-dodge;
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

  /* rotate all bleeps separate */
  svg >>> .bleep {
    fill: green;
  }
  /* rotate the whole image */
  svg {
    animation: rotating 12s linear infinite;
  }



  @keyframes rotating {
    to {transform: rotate(360deg);}
  }
</style>
