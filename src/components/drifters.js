import {
  bus
} from '@/event-bus.js';
import moment from 'moment';
import $ from 'jquery';

function AddDrifters(map, layers) {
  var layer_json = {
    id: 'drifter-layer',
    active: false,
    visibility: "none",
    name: 'Drifters',
    type: 'line',
    cursor: 'pointer',
    icon: 'explore',
    source: {
      type: 'geojson',
      data: '/static/Drifters.geojson'
    },
    paint: {
      'line-color': ['get', 'color'],
    }
  };
  map.addLayer(layer_json);
  layers.push(layer_json);
  bus.$emit('select-layers', layers);
  //map.onLoad(filterDrifterBy())
}

function filterDrifterBy() {
    var tstart = 1413200130;
    var tend = 1413200232;
    var filters = [
      "all",
      ['>=', 'timestamp', tstart],
      ['<=', 'timestamp', tend],
    ];
    map.setFilter('Drifters', filters);
}

export {AddDrifters, filterDrifterBy}
