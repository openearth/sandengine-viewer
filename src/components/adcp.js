import {
  bus
} from '@/event-bus.js';
import moment from 'moment';
import $ from 'jquery';

function AddADCP(map, layers) {
  var layer_json = {
    id: 'adcp-layer',
    active: true,
    visibility: "visible",
    name: 'ADCP',
    type: 'circle',
    icon: 'grain',
    'icon-image': '/static/adcp.png',
    source: {
      type: 'geojson',
      data: {
        "geometry": {
          "coordinates": [4.217663764953613, 52.080467224121094],
          "type": "Point"
        },
        "id": "adcp-f",
        "properties": {},
        "type": "Feature"
      }
    },
    paint: {
      // make circles larger as the user zooms from z12 to z22
      'circle-radius': 30,
      'circle-color': 'pink'
    }
  }
  map.addLayer(layer_json);
  layers.push(layer_json)
  bus.$emit('select-layers', layers);
}

function ShowADCPData(point, div_id) {
  // todo check if multiple are selected; for now just select first
  var locationID = point.properties.location_ID;
  var timeEnd = moment.unix(parseFloat(point.properties.timeEnd));
  var timeStart = moment.unix(parseFloat(point.properties.timeStart));

  fetch("/static/adcp_data_1000.json")
    .then((resp) => {
      return resp.json();
    })
    .then((timeseries) => {
      locationID = locationID;
      timeseries = timeseries;
      timeEnd = timeEnd.format('L')
      timeStart = timeStart.format('L')
      bokehplot(locationID, timeseries, timeEnd, timeStart, point, div_id);
    })
    .catch((reason) => {
      console.warn(reason)
    })
}

function bokehplot(locationID, timeseries, timeEnd, timeStart, point, div_id) {
  console.log('adcp', timeseries)
  // Check if timeseries is set
  if (timeseries == null) {
    console.log('No timeseries defined');
    return -1
  }

  var div = document.getElementById(div_id);
  div.innerHTML = ""; // clear div

  // General Bokeh settings
  var plt = Bokeh.Plotting;
  var tools = "pan,crosshair,wheel_zoom,box_zoom,reset,save";

  // Get time slice
  // var data = timeseries[deploymentName];
  // var keys = Object.keys(data);
  //
  // var time = data[keys[0]];
  // var begin = 0;
  // var end = time.length;
  //
  // var x = []
  // _.each(time.slice(begin, end), function(event) {
  //   x.push(new Date(event))
  // });
  //
  // var plot = new plt.figure({
  //   title: "Deployment: " + deploymentName + " Location: " + locationID + "\n Start deployment: " + timeStart + " End deployment: " + timeEnd,
  //   tools: tools,
  //   width: 1000,
  //   height: 350,
  //   x_axis_type: 'datetime',
  //   x_axis_label: 'Time',
  //   y_axis_label: 'Number of particles [-]',
  //   background_fill_color: "#F2F2F7"
  // });
  //
  // // output linesegment per height
  // var locationIDdata = data[locationID];
  // var heights = Object.keys(locationIDdata);
  // var colors = ["#666699", "#66ff66", "#ff6666"];
  //
  // for (var i = 0; i < heights.length; i++) {
  //   var height = 'height ' + locationIDdata[heights[i]]['height'].toString() + ' m';
  //   var y = data[locationID][heights[i]]['particle_counts'];
  //   y = y.slice(begin, end);
  //
  //   // remove 0 values
  //   function filterFunction(value, index, array) {
  //     return y[index] > 0;
  //   }
  //   var xwithoutzero = x.filter(filterFunction);
  //   var ywithoutzero = y.filter(filterFunction);
  //
  //   var source = new Bokeh.ColumnDataSource({
  //     data: {
  //       x: xwithoutzero,
  //       y: ywithoutzero
  //     }
  //   });
  //
  //   var line = plot.line({
  //     field: 'x'
  //   }, {
  //     field: 'y'
  //   }, {
  //     source: source,
  //     legend: height,
  //     line_color: colors[i],
  //     line_width: 2
  //   })
  // }

  plot._legend.location = 'top_left';
  var doc = new Bokeh.Document();
  doc.add_root(plot);
  Bokeh.embed.add_document_standalone(doc, div);
}

export {
  AddADCP, ShowADCPData
};
