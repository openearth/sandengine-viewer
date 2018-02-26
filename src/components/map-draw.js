import Vue from 'vue';
import Vue2MapboxGL from 'vue2mapbox-gl';
import {
  bus
} from '@/event-bus.js';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.js';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

Vue.use(Vue2MapboxGL);

function DrawControls(map, plots, dataset, layers) {
  var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      line_string: true,
      trash: true
    }
  });
  map.addControl(draw);
  map.on('draw.create', () => {
    // if (layers..active) {
      var region = draw.getAll()
      var begin_date = "2011-08-02"
      var end_date = "2011-09-02"
      var dataset = "bathymetry_jetski"
      var div_id = JSON.stringify(region)
      plots.push(div_id)
      bus.$emit('click-plots', plots);
      var profile = download_raster_profile(region.features[region.features.length-1].geometry, dataset, 20, begin_date, end_date, div_id)
    // }
  })

}


function download_raster_profile(region, dataset, scale, begin_date, end_date, div_id) {
  var SERVER_URL = 'http://hydro-engine.appspot.com'
  // var SERVER_URL = 'http://localhost:8080'
  var data = {
    'polyline': region,
    "dataset": dataset,
    "begin_date": begin_date,
    "end_date": end_date,
    'scale': scale
  }

  var myHeaders = new Headers();
  console.log(dataset, JSON.stringify(data))
  var profile = fetch(SERVER_URL + '/get_raster_profile', {
      method: "POST",
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
        // 'Access-Control-Allow-Origin': '*'
      }
    })

    .then((res) => {
      return res.json();
    })
    .then((profile_data) => {
      bokehplot(profile_data, data, div_id)
      return profile_data
    })
  return profile
};

function bokehplot(profile_data, data, div_id) {
  var div = document.getElementById("plot_" + div_id);

  div.innerHTML = ""; // clear div

  // console.log('profile_data', JSON.stringify(profile_data), profile_data.type)
  var plt = Bokeh.Plotting;
  var tools = "pan,crosshair,wheel_zoom,box_zoom,reset,save";
  var begin = data.begin_date
  var end = data.end_date
  var source = new Bokeh.GeoJSONDataSource({
    geojson: JSON.stringify(profile_data)
  })

  // var y = meteodata[data].data.slice(begin, end)
  // y = _.map(y, function(i) {
  //   if (i >= 9.969209968386869e+36) {
  //     return NaN
  //   } else {
  //     return i
  //   }
  // })
  // var x = []
  // _.each(meteodata.time.slice(begin, end), function(event) {
  //   x.push(new Date(event))
  // });
  // var source = new Bokeh.ColumnDataSource({
  //   data: {
  //     x: x,
  //     y: y
  //   }
  // });
  var plot = new plt.figure({
    title: data.dataset,
    tools: tools,
    width: 800,
    height: 350,
    background_fill_color: "#F2F2F7",
    x_axis_label: 'Distance w.r.t. first coordinate [m]',
    y_axis_label: 'Elevation [m, NAP]',
  });
  var line = new Bokeh.Line({
    x: {
      field: "distance"
    },
    y: {
      field: "b1_mean"
    },
    line_color: "#666699",
    line_width: 2
  });
  plot.add_glyph(line, source);
  var doc = new Bokeh.Document();
  doc.add_root(plot);
  Bokeh.embed.add_document_standalone(doc, div);
}

export {
  DrawControls
}
