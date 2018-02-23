import {
  bus
} from '@/event-bus.js';
import moment from 'moment';
import $ from 'jquery';

function AddDrifters(map, layers) {
  var layer_json = {
    active: false,
    name: 'Drifters',
    icon: 'explore',
    id: 'drifter-layer',
    visibility: "visible",
    type: 'line',
    source: {
      type: 'geojson',
      data: 'https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/drifters/drifters.geojson'
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': {
        'base': 4.0,
        'stops': [
          [12, 2],
          [22, 180]
        ]
      },
    }
  };
  map.addLayer(layer_json);
  layers.push(layer_json);
  bus.$emit('select-layers', layers);
}

function filterDrifterBy(timeExtent, map) {
    //timeExtent provides 2 moments
    var tstart = timeExtent[0].unix();
    var tend = timeExtent[1].unix();
    var filters = [
      "all",
      ['>=', 'tStart', tstart],
      ['<=', 'tEnd', tend],
    ];
    map.setFilter('drifter-layer', filters);
}

export {AddDrifters, filterDrifterBy}
