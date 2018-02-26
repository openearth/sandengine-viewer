import {
  bus
} from '@/event-bus.js';
import moment from 'moment';
import $ from 'jquery';

function AddAeolian(map, layers) {
  var layer_json = {
    id: 'aeolian-layer',
    active: true,
    visibility: "visible",
    name: 'Aeolian',
    type: 'circle',
    cursor: 'pointer',
    icon: 'grain',
    source: {
      type: 'geojson',
      data: '/static/aeolian_data.geojson'
    },
      "info": "Processed data on aeolian sediment transport from the 6-week MegaPeX field campaign at the Sand Motor mega nourishment. <a href='https://data.4tu.nl/repository/uuid:3bc3591b-9d9e-4600-8705-5b7eba6aa3ed'>Data link</a>",
    paint: {
      // make circles larger as the user zooms from z12 to z22
      'circle-radius': {
        'base': 1.75,
        'stops': [
          [12, 2],
          [22, 180]
        ]
      },
      'circle-color': [
        'match', ['get', 'deploymentName'],
        'dn1', '#fbb03b',
        'dn2', '#223b53',
        'dn3', '#e55e5e',
        'dn4', '#3bb2d0',
        'dn5', '#956a37',
        'dn6', '#8a5f2c',
        'dn7', '#815726',
        'dn8', '#724c20',
        'dn9', '#66451f',
        'dn10', '#2f1b02',
        'dn11', '#201503',
        'dn67', '#453c09',
        /* other */
        '#ccc'
      ]
    }
  }
  map.addLayer(layer_json);
  layers.push(layer_json)
  bus.$emit('select-layers', layers);
}

function filterAeolianBy(timeExtent, map) {
  //timeExtent provides 2 moments
  var tstart = timeExtent[0].unix();
  var tend = timeExtent[1].unix();
  var filters = [
    "all",
    ['>=', 'tStart', tstart],
    ['<=', 'tEnd', tend],
  ];
  map.setFilter('aeolian-layer', filters);
}

function ShowAeolianData(point, div_id) {
  // todo check if multiple are selected; for now just select first
  var deploymentName = point.properties.deploymentName;
  var locationID = point.properties.location_ID;
  var timeEnd = moment.unix(parseFloat(point.properties.timeEnd));
  var timeStart = moment.unix(parseFloat(point.properties.timeStart));

  fetch("https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/aeolian/aeolian_data_" + deploymentName + ".json")
    .then((resp) => {
      return resp.json();
    })
    .then((timeseries) => {
      locationID = locationID;
      deploymentName = deploymentName;
      timeseries = timeseries;
      timeEnd = timeEnd.format('L')
      timeStart = timeStart.format('L')
      bokehplot(locationID, deploymentName, timeseries, timeEnd, timeStart, point, div_id);
    })
    .catch((reason) => {
      console.warn(reason)
    })
}

function bokehplot(locationID, deploymentName, timeseries, timeEnd, timeStart, point, div_id){

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
  var data = timeseries[deploymentName];
  var keys = Object.keys(data);

  var time = data[keys[0]];
  var begin = 0;
  var end = time.length;

  var x = []
  _.each(time.slice(begin, end), function(event) {
    x.push(new Date(event))
  });

  var plot = new plt.figure({
    title: "Deployment: " + deploymentName + " Location: " + locationID + "\n Start deployment: " + timeStart + " End deployment: " + timeEnd,
    tools: tools,
    width: 1000,
    height: 350,
    x_axis_type: 'datetime',
    x_axis_label: 'Time',
    y_axis_label: 'Number of particles [-]',
    background_fill_color: "#F2F2F7"
  });

  // output linesegment per height
  var locationIDdata = data[locationID];
  var heights = Object.keys(locationIDdata);
  var colors = ["#666699", "#66ff66", "#ff6666"];

  for (var i = 0; i < heights.length; i++) {
    var height = 'height ' + locationIDdata[heights[i]]['height'].toString() + ' m';
    var y = data[locationID][heights[i]]['particle_counts'];
    y = y.slice(begin, end);

    // remove 0 values
    function filterFunction(value, index, array) {
      return y[index] > 0;
    }
    var xwithoutzero = x.filter(filterFunction);
    var ywithoutzero = y.filter(filterFunction);

    var source = new Bokeh.ColumnDataSource({
      data: {
        x: xwithoutzero,
        y: ywithoutzero
      }
    });

    var line = plot.line({field: 'x'}, {field: 'y'}, {source: source, legend: height , line_color:colors[i], line_width:2})
  }

  plot._legend.location = 'top_left';
  var doc = new Bokeh.Document();
  doc.add_root(plot);
  Bokeh.embed.add_document_standalone(doc, div);
}

export {AddAeolian, ShowAeolianData, filterAeolianBy};
