import * as d3 from 'd3';
export default {
  name: 'HelloRadar',
  data () {
    return {
      msg: 'Welcome to your radar...',
      video: null,
      ctxOff: null,
      ctxOn: null,
      playbackRate: 1.0,
      width: 500,
      height: 500,
      waves: []
    };
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

      var line = d3.line()
          .x((d) => {return d.x;})
          .y((d) => {return d.y;});

      var path = g
          .append('path')
          .classed('bar', true)
          .datum([
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: -this.height/2
            }
          ])
          .attr('d', line);

      var circles = g
          .selectAll("circle")
          .data([
            {r: 1/3 * 250},
            {r: 2/3 * 250},
            {r: 0.95 * 3/3 * 250}
          ])
          .enter()
          .append('circle')
          .classed('bar', true)
          .attr('r', (d) => {return d.r; });

    },
    subscribeVideo() {
      // Keep track of elements
      this.video = this.$el.querySelector('video');
      this.video.playbackRate = this.playbackRate;
      this.ctxOff = this.$el.querySelector('canvas.off').getContext('2d');
      this.ctxOn = this.$el.querySelector('canvas.on').getContext('2d');

      this.video.addEventListener(
        'play',
        () => {
          requestAnimationFrame(this.videoCallback.bind(this));
        },
        false
      );
    },
    computeFrame() {
      // draw video frame
      const τ = Math.PI * 2;
      this.ctxOff.drawImage(this.video, 0, 0, this.width, this.height);

      // Get pixels
      let frame = this.ctxOff.getImageData(0, 0, this.width, this.height);

      this.seedWaves(frame);
      this.computeWaves(frame);

      /* TODO: split this off into a worker */
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
        let val = Math.floor(mag * 200);
        frame.data[i * 4 + 0] = val;
        frame.data[i * 4 + 1] = val;
        frame.data[i * 4 + 2] = val;
      }
      /* once an image is computed put it on the visual context */
      this.ctxOn.putImageData(frame, 0, 0);
      this.displayWaves();
    },
    seedWaves(frame) {
      const τ = 2 * Math.PI;
      const angle = 0.125 * τ;
      /* wave width in px */
      const waveWidth = 20;
      const maxWaves = 50;



      if (this.waves.length < maxWaves) {
        /* pick a random point in the canvas */
        let x0 = Math.random() * this.width;
        let y0 = Math.random() * this.height;

        this.waves.push([x0, y0, angle]);
      }
      // remove waves that are out of domain
      _.remove(this.waves, (wave) => {
        let col = Math.floor(wave[0]);
        let row = Math.floor(wave[1]);
        let idx = row * this.width + col;
        let b = frame.data[idx * 4 + 2];
        if (b > 127) {
          return true;
        } else {
          return false;
        }
      });

    },
    computeWaves(frame) {
      const τ = Math.PI * 2.0;
      const scale = 0.5;
      _.each(this.waves, (wave) => {
        let col = Math.floor(wave[0]);
        let row = Math.floor(wave[1]);
        let angle = wave[2];
        let idx = row * this.width + col;
        let r = frame.data[idx * 4 + 0];
        let g = frame.data[idx * 4 + 1];
        let b = frame.data[idx * 4 + 2];
        if (b > 127) {
          return;
        }
        let u = (r - 127)/127 * 2.0;
        let v = (g - 127)/127 * 2.0;
        let newAngle = Math.atan2(v, u);
        // rotate angle
        u = Math.cos(newAngle);
        v = Math.sin(newAngle);
        wave[0] = wave[0] + u * scale;
        wave[1] = wave[1] + v * scale;
        // compute new angle as function of old angle and new angle
        wave[2] = Math.atan2(
          Math.sin(angle) + v * 0.1,
          Math.cos(angle) + u * 0.1
        );

      });
    },
    displayWaves() {
      const τ = 2 * Math.PI;
      _.each(this.waves, (wave) => {
        // rotate by a quarter degree
        let angle = 0.25 * τ + wave[2];
        let dx = Math.cos(angle) * 10;
        let dy = Math.sin(angle) * 10;

        this.ctxOn.beginPath();
        this.ctxOn.strokeStyle = '#EEEEEE88';
        this.ctxOn.lineWidth = 2.0;
        this.ctxOn.moveTo(wave[0] - dx, wave[1] - dy);
        this.ctxOn.lineTo(wave[0] + dx, wave[1] + dy);
        this.ctxOn.stroke();
      });

    },
    videoCallback(t) {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrame();
      requestAnimationFrame(this.videoCallback.bind(this));
    }
  },
  mounted() {
    this.addBleep();
    this.subscribeVideo();
  }
}
