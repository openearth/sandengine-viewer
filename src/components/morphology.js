import {
  bus
} from '@/event-bus.js';
import $ from 'jquery';


function AddMorphology(map, layers) {
  var layer_json = {
    "name": "Sediment distribution",
    "active": false,
    "visibility": "None",
    "icon": "grain",
    "id": "measurements",
    "type": "circle",
    "source": {
      "type": "geojson",
      "data": "static/sediment_data.geojson"
    },
    "range": "0  400",
    "css": "height: 10px; \
      width: 80%; \
      margin-left: 10%; \
      text-align: justify; \
      padding-top: 10px; \
      background: linear-gradient(to right, \
      hsla(0, 100%, 50%, 0.5), \
      rgba(255, 255, 0, 0.5));",
    paint: {
      "circle-color": {
                    "base": 1,
                    "type": "exponential",
                    "property": "D50",
                    "stops": [
                        [
                            0,
                            "hsla(0, 100%, 50%, 0.5)"
                        ],
                        [
                            400,
                            "rgba(255, 255, 0, 0.5)"
                        ]
                    ],
                    "default": "hsl(0, 0%, 0%)"
                },
      "circle-stroke-width": 0.5
    }
  }
  map.addLayer(layer_json);
  layers.push(layer_json)
    bus.$emit('select-layers', layers);
    bus.$emit('add-legend', 'test');
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
