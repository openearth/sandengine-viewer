import Vue from 'vue';
import Vue2MapboxGL from 'vue2mapbox-gl';
import {
  bus
} from '@/event-bus.js';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.js';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import moment from 'moment';

const DAY_FORMAT = 'Y-MM-DD'

Vue.use(Vue2MapboxGL);
var draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    line_string: true,
    trash: true
  }
});

var colors = ['#ffffff', '#e6e6ff', '#ccccff', '#b3b3ff', '#9999ff', '#8080ff',
  '#6666ff', '#4d4dff', '#3333ff', '#1a1aff', '#0000ff', '#0000e6', '#0000cc', '#0000b3',
  '#000099', '#000080', '#000066', '#00004d', '#000033', '#00001a', '#000000'
]
var draws = []

function DrawControls(map, draws, beginDate, endDate, dataset) {
  _.each(dataset, (set) => {
    if (set === "bathymetry_lidar") {
      beginDate = moment("2001-01-01")
      endDate = moment("2018-01-01")
    }
    var profile = download_raster_profile(draws, set, 20, beginDate, endDate)
  })
}


function download_raster_profile(regions, dataset, scale, begin_date, end_date) {
  _.each(regions, (region) => {
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
    var profile = fetch(SERVER_URL + '/get_raster_profile', {
        method: "POST",
        body: JSON.stringify(data),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      .then((res) => {
        return res.json();
      })
      .then((profile_data) => {
        bokehplot(profile_data, data, JSON.stringify(region) + '_' + dataset)
        return profile_data
      })
    return profile
  })
};

function bokehplot(profile_data, data, div_id) {
  var div = document.getElementById("plot_" + div_id);

  // div.innerHTML = ""; // clear div
  // console.log('profile_data', JSON.stringify(profile_data), profile_data.type)
  var plt = Bokeh.Plotting;
  var tools = "pan,crosshair,wheel_zoom,box_zoom,reset,save";
  var begin = data.begin_date
  var end = data.end_date
  var source = new Bokeh.GeoJSONDataSource({
    geojson: JSON.stringify(profile_data)
  })

  if (Bokeh.index[div_id] != undefined) {
    var plot = Bokeh.index[div_id].model
    var color = colors[Bokeh.index[div_id].model._legend.attributes.items.length]
  } else {
    var plot = new plt.figure({
      name: div_id,
      id: div_id,
      title: data.dataset,
      tools: tools,
      width: 800,
      height: 350,
      background_fill_color: "#F2F2F7",
      x_axis_label: 'Distance w.r.t. first coordinate [m]',
      y_axis_label: 'Elevation [m, NAP]',
    });
    var color = colors[0]
  }

  plot.line({
    field: "distance"
  }, {
    field: "b1_mean"
  }, {
    source: source,
    legend: begin.format(DAY_FORMAT) + ' to ' + end.format(DAY_FORMAT),
    line_width: 2,
    line_color: color
  });
  if (Bokeh.index[div_id] == undefined) {
    var doc = new Bokeh.Document();
    doc.add_root(plot);
    Bokeh.embed.add_document_standalone(doc, div);
  }
}

export {
  DrawControls,
  addBathymetryPlot
}
