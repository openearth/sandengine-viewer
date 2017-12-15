import $ from 'jquery';
import mapboxgl from 'mapbox-gl';
// import * as Bokeh from 'bokehjs'
// require.import('bokehjs') as Bokeh

// require('bokehjs')

export default {
  name: 'VMeteo',
  jsondata: "None",
  data () {
    return {
      msg: ""
    };
  },
  mounted() {
    this.jsondata = $.getJSON({
      'url':'/static/wind_data.json',
      'async': false
    }).responseJSON;

    this.$refs.map.map.on("load", () => {
      this.addCanvas(this.$refs.map.map)
      this.windsock()

    });

    var popup = new mapboxgl.Popup({})

    this.$refs.map.map.on(
      "click",
      (e) => {
        var del = 0.002;
        if (
          (e.lngLat.lng > this.jsondata.lon - del) ||
            (e.lngLat.lng < this.jsondata.lon + del) ||
            (e.lngLat.lat > this.jsondata.lat - del) ||
            (e.lngLat.lng < this.jsondata.lat + del)
        ) {
          popup.remove();
        }
      });
  },
  methods: {
    addCanvas(map){
      var jsondata = this.jsondata;
      var lat = jsondata.lat;
      var lon = jsondata.lon;
      var del = 0.003;
      map.addLayer({
        id: 'canvas-layer',
        type: 'raster',
        source:  {
          type: 'canvas',
          animate: true,
          canvas: 'windsock-canvas',
          coordinates: [
            [lon - del, lat + del],
            [lon + del, lat + del],
            [lon + del, lat - del],
            [lon - del, lat - del]
          ]
        },
        paint: {}
      });
    },

    windsock(){
      var jsondata = this.jsondata;
      var t = 0;
      function draw(){
        var direc = jsondata.direc;
        var aspeed = jsondata.aspeed[t];
        var ctx = document.getElementById('windsock-canvas').getContext('2d');
        var w = 200;
        var h = 200;
        var bh = 70;
        var bw = 80;
        var c = 100;

        ctx.clearRect(0, 0, w, h);

        // shadow blur
        ctx.shadowColor = '#333';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.beginPath();
        ctx.arc(c, c, 10, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();

        ctx.closePath();
        ctx.beginPath();

        ctx.moveTo(bw, bh+10);
        ctx.lineTo(c, c);
        ctx.lineTo(bw+40, bh+10);
        ctx.stroke();
        ctx.closePath();

        let bands = [
          [0, 80, bh, 40, 10, 'red'],
          [2, 80, bh-10, 40, 10, 'white'],
          [4, 80, bh-20, 40, 10, 'red'],
          [6, 80, bh-30, 40, 10, 'white'],
          [8, 80, bh-40, 40, 10, 'red']
        ];
        let selectedBands = _.filter(bands, (band) => {
          let speed = band[0];
          return aspeed > speed;
        });
        _.each(selectedBands, (band) => {
          ctx.beginPath();
          ctx.fillStyle = band[5];
          ctx.rect(band[1], band[2], band[3], band[4]);
          ctx.fill();
          ctx.closePath();
        });

        ctx.translate(w/2, h/2);
        ctx.rotate(-(180 - direc[t-1])*(2 * Math.PI / 360));
        ctx.rotate((180 - direc[t])*(2 * Math.PI / 360));

        ctx.translate(-w/2, -h/2);
        t += 1;

        var D = new Date(jsondata.time[t]);
        var msg = "Time step: " + D.toString();
        document.getElementById("message").innerHTML = msg;
        requestAnimationFrame(draw);
      }

      draw();

    }
  }
}
