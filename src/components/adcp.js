import {
  bus
} from '@/event-bus.js';
import moment from 'moment';
import $ from 'jquery';

function AddADCP(map, layers) {
  var layer_json = {
    id: 'ADCP',
    active: true,
    visibility: "visible",
    name: 'ADCP',
    type: 'circle',
    icon: 'grain',
    clickable: true,
    'icon-image': 'static/adcp.png',
    source: {
      type: 'geojson',
      data: 'static/adcp_locations.geojson'
    },
    "info": "Measurment from an Acoustic Doppler Current Profilers (ADCP) located at the Sand Motor. <a href='https://data.4tu.nl/repository/uuid:3bc3591b-9d9e-4600-8705-5b7eba6aa3ed' target='parent'>Data link</a>",
    paint: {
      'circle-radius': {
        'base': 1.2,
        'stops': [
          [12, 2],
          [22, 180]
        ]
      },
      'circle-color': 'FireBrick'
    }
  }
  map.addLayer(layer_json);
  layers.push(layer_json)
  bus.$emit('select-layers', layers);
}

function filterADCPBy(timeExtent, map) {

  //timeExtent provides 2 moments
  var tstart = timeExtent[0].unix();
  var tend = timeExtent[1].unix();

  var filters = [
    "all",
    ['>=', 'tStart', tstart],
    ['<=', 'tEnd', tend],
  ];
  //map.setFilter('ADCP', filters);
}

function ShowADCPData(point, div_id, timeExtent) {
  // find out which adcp was clicked
  var adcpID = point.properties.ADCPID;
  var url = "https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/adcp/"
  fetch(url + adcpID + "_data.json")
    .then((resp) => {
      return resp.json();
    })
    .then((timeseries) => {
      bokehplot('velocity', adcpID, timeseries, point, div_id[0], timeExtent);
      bokehplot('waterdepth', adcpID, timeseries, point, div_id[1], timeExtent);
    })
    .catch((reason) => {
      console.warn(reason)
    })
}

function bokehplot(mode,adcpID,timeseries, point, div_id, timeExtent) {

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

  if (mode == 'velocity'){
    var properties = ['Umean','Vmean']
    var title = adcpID + " depth averaged velocity"
    var ylabel = 'Current velocity [m/s]'
  }
  else {
    var properties = ['waterdepth']
    var title = adcpID + " water depth (Scheveningen)"
    var ylabel = 'Water level [m, NAP]'
  }

  var plot = new plt.figure({
    title:title,
    tools: tools,
    width: 1000,
    height: 350,
    x_axis_type: 'datetime',
    x_axis_label: 'Time',
    y_axis_label: ylabel,
    background_fill_color: "#F2F2F7"
  });

  // make line lineplots
  var x = timeseries['time'];

  var colors = ['MidnightBlue', 'ForestGreen']

  for (var i = 0; i < properties.length; i++) {
    var y = timeseries[properties[i]];
    var source = new Bokeh.ColumnDataSource({
      data: { x: x,
              y: y }
      });

    var line = plot.line(
      { field: 'x' },
      { field: 'y' },
      {
        source: source,
        legend: properties[i],
        line_color: colors[i],
        line_width: 2
      })
  }

  plot._legend.location = 'top_left';

  var doc = new Bokeh.Document();
  doc.add_root(plot);
  Bokeh.embed.add_document_standalone(doc, div);

  // filter time
  var plotID = plot.attributes.id
  var tstart = timeExtent[0].unix() * 1000;
  var tend = timeExtent[1].unix() * 1000;
  Bokeh.index[plotID].model.x_range.start = tstart
  Bokeh.index[plotID].model.x_range.end = tend
}

export {
  AddADCP, ShowADCPData, filterADCPBy
};
