import $ from 'jquery';
import mapboxgl from 'mapbox-gl';
// import * as Bokeh from 'bokehjs'
// require.import('bokehjs') as Bokeh

// require('bokehjs')
import {
  bus
} from '@/event-bus.js';

function AddMeteo(map, layers) {
  fetch('static/wind_data.json')
    .then((resp) => {
      return resp.json();
    })
    .then((json) => {
      addCanvas(json, layers, map)
      windsock(json)
    });
};

function ShowMeteoData(ids){
  fetch( "https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/meteo/meteo_data.json")
    .then((resp) => {
      return resp.json();
    })
    .then((json) => {
      this.bokehplot(
        "Barometer_Avg",
        document.getElementById(ids[0]),
        json
      );
      this.bokehplot(
        "WindSpeed_Avg",
        document.getElementById(ids[1]),
        json
      );
      this.bokehplot(
        "RelHumidity_Avg",
        document.getElementById(ids[2]),
        json
      );
    })
    .catch((reason) => {
      console.warn(reason)
    })
};

function addCanvas(jsondata, layers, map) {
  var lat = jsondata.lat;
  var lon = jsondata.lon;
  var del = 0.003;
  var layer_json = {
    name: "Meteo",
    active: false,
    visibility: "none",
    id: 'meteo-layer',
    type: 'raster',
    icon: 'filter_drama',
    source: {
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
  };
  map.addLayer(layer_json);
  layers.push(layer_json)
  bus.$emit('select-layers', layers);
};

function windsock(jsondata) {
  var t = 0;

  function draw() {
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

    ctx.moveTo(bw, bh + 10);
    ctx.lineTo(c, c);
    ctx.lineTo(bw + 40, bh + 10);
    ctx.stroke();
    ctx.closePath();

    let bands = [
      [0, 80, bh, 40, 10, 'red'],
      [2, 80, bh - 10, 40, 10, 'white'],
      [4, 80, bh - 20, 40, 10, 'red'],
      [6, 80, bh - 30, 40, 10, 'white'],
      [8, 80, bh - 40, 40, 10, 'red']
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

    ctx.translate(w / 2, h / 2);
    ctx.rotate(-(180 - direc[t - 1]) * (2 * Math.PI / 360));
    ctx.rotate((180 - direc[t]) * (2 * Math.PI / 360));

    ctx.translate(-w / 2, -h / 2);
    t += 1;

    var D = new Date(jsondata.time[t]);
    var msg = "Time step: " + D.toString();
    // document.getElementById("message").innerHTML = msg;
    requestAnimationFrame(draw);
  }

  draw();

};

function bokehplot(data, div, meteodata) {
  var plt = Bokeh.Plotting;
  var tools = "pan,crosshair,wheel_zoom,box_zoom,reset,save";
  var begin = 500000
  var end = 750000
  var y = meteodata[data].data.slice(begin, end)
  y = _.map(y, function(i) {
    if (i >= 9.969209968386869e+36) {
      return NaN
    } else {
      return i
    }
  })
  var x = []
  _.each(meteodata.time.slice(begin, end), function(event) {
    x.push(new Date(event))
  });
  var source = new Bokeh.ColumnDataSource({
    data: {
      x: x,
      y: y
    }
  });
  var plot = new plt.figure({
    title: meteodata[data].title,
    tools: tools,
    width: 400,
    height: 200,
    x_axis_type: 'datetime',
    background_fill_color: "#F2F2F7"
  });
  var line = new Bokeh.Line({
    x: {
      field: "x"
    },
    y: {
      field: "y"
    },
    line_color: "#666699",
    line_width: 2
  });

  plot.add_glyph(line, source);
  var doc = new Bokeh.Document();
  doc.add_root(plot);
  Bokeh.embed.add_document_standalone(doc, div);
}

export {AddMeteo, ShowMeteoData}
