import {
  bus
} from '@/event-bus.js';
import $ from 'jquery';


function AddMorphology(map, layers) {
  var layer_json = {
    "name": "Morphology",
    "active": false,
    "visibility": "None",
    "icon": "terrain",
    "id": "measurements",
    "type": "circle",
    "source": {
      "type": "geojson",
      "data": "static/sediment_data.geojson"
    },
    paint: {
      "circle-color": '#52A8B4',
      "circle-opacity": 0.5
    }
  }
  map.addLayer(layer_json);
  layers.push(layer_json)
  bus.$emit('select-layers', layers);
}

function ShowMorphologyData(data){
  bokehplot(data, ddocument.getElementById("properties.id"))
}

function bokehplot(data, div, meteodata) {
  var plt = Bokeh.Plotting;
  // var tools = "pan,crosshair,wheel_zoom,box_zoom,reset,save";
  // var begin = 500000
  // var end = 750000
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
    // title: meteodata[data].title,
    tools: tools,
    width: 400,
    height: 200,
    x_axis_type: 'datetime',
    background_fill_color: "#F2F2F7"
  });
  // var line = new Bokeh.Line({
  //   x: {
  //     field: "x"
  //   },
  //   y: {
  //     field: "y"
  //   },
  //   line_color: "#666699",
  //   line_width: 2
  // });
  //
  // plot.add_glyph(line, source);
  var doc = new Bokeh.Document();
  doc.add_root(plot);
  Bokeh.embed.add_document_standalone(doc, div);
}

export {
  AddMorphology, ShowMorphologyData
}
