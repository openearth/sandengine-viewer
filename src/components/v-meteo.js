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
      msg: "None"
    }
  },
  mounted() {
    this.jsondata = $.getJSON({
      'url':'/static/wind_data.json',
      'async': false}).responseJSON

    this.$refs.map.map.on("load", () => {
      this.addCanvas(this.$refs.map.map)
      this.windsock()

    })

    var popup = new mapboxgl.Popup({})

    this.$refs.map.map.on(
      "click",
      (e) => {
        console.log('click')
        var del = 0.002
        if ((e.lngLat.lng > this.jsondata.lon - del) ||
          (e.lngLat.lng < this.jsondata.lon + del) ||
          (e.lngLat.lat > this.jsondata.lat - del) ||
          (e.lngLat.lng < this.jsondata.lat + del)){
            popup.remove()
            // this.bokehplot(e, popup)
        }

    })
  },
  methods: {
    // bokehplot(e, popup){
    //   var plt = Bokeh.Plotting;
    //   var tools = "pan,crosshair,wheel_zoom,box_zoom,reset,save";
    //
    //   var jsondata = this.jsondata
    //   var y = jsondata.aspeed
    //   var x = []
    //   _.each(jsondata.time, function(event){
    //     x.push(new Date(event))
    //   });
    //
    //   var source = new Bokeh.ColumnDataSource({ data: { x: x, y: y } });
    //   var plot = new plt.figure({
    //       title: "Timeseries of the wind average speed",
    //       tools: tools,
    //       width: 400,
    //       height: 200,
    //       x_axis_type: 'datetime',
    //       background_fill_color: "#F2F2F7"
    //   });
    //
    //   var line = new Bokeh.Line({
    //       x: { field: "x" },
    //       y: { field: "y" },
    //       line_color: "#666699",
    //       line_width: 2
    //   });
    //
    //   plot.add_glyph(line, source);
    //   var doc = new Bokeh.Document();
    //   doc.add_root(plot);
    //
    //   popup.setLngLat(e.lngLat)
    //       .setHTML("<div id='popup'></div>")
    //       .addTo(this.$refs.map.map);
    //   var pop = document.getElementById("popup");
    //   Bokeh.embed.add_document_standalone(doc, pop);
    // },


    addCanvas(map){
      var jsondata = this.jsondata
      var lat = jsondata.lat
      var lon = jsondata.lon
      var del = 0.003
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
      var jsondata = this.jsondata
      var t = 0
      function draw(){
        var direc = jsondata.direc
        var aspeed = jsondata.aspeed[t]
        var ctx = document.getElementById('windsock-canvas').getContext('2d');
        var w = 200
        var h = 200
        var bh = 70
        var bw = 80
        var c = 100

        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.arc(c, c, 10, 0, Math.PI * 2)
        ctx.fillStyle = "black";
        ctx.fill();

        ctx.closePath();
        ctx.beginPath();

        ctx.moveTo(bw, bh+10);
        ctx.lineTo(c, c);
        ctx.lineTo(bw+40, bh+10);
        ctx.stroke()
        ctx.closePath();
        ctx.beginPath();

        if (aspeed >0) { ctx.rect(80, bh, 40, 10)}
        if (aspeed >4) { ctx.rect(80, bh-20, 40, 10)}
        if (aspeed >8) { ctx.rect(80, bh-40, 40, 10)}

        ctx.fillStyle = "red"
        ctx.fill()

        ctx.closePath();
        ctx.beginPath();
        if (aspeed >2) { ctx.rect(80, bh-10, 40, 10)}
        if (aspeed >6) { ctx.rect(80, bh-30, 40, 10)}
        ctx.fillStyle = "white"
        ctx.fill()

        ctx.translate(w/2, h/2)
        ctx.rotate(-(180 - direc[t-1])*(2 * Math.PI / 360))
        ctx.rotate((180 - direc[t])*(2 * Math.PI / 360))

        ctx.translate(-w/2, -h/2)
        t += 1

        setTimeout(function () {

        }, 1000);
        var D = new Date(jsondata.time[t])
        var msg = "Time step: " + D.toString()
        document.getElementById("message").innerHTML = msg
        requestAnimationFrame(draw);
      }

      draw()

    }
  }
}
