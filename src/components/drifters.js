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
    id: 'Drifters',
    visibility: "visible",
    type: 'line',
    source: {
      type: 'geojson',
      data: 'https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/drifters/drifters.geojson',
    },
      "info": "Drifter data as measured with GPS-tracked drifters during the megapex 2014 field campaign. Experiments have been done during ebb and flood and in a rip current. <a href='https://data.4tu.nl/repository/uuid:7f190c88-ae2e-43cf-959c-2b7d5c321573'  target='parent'>Data link</a>",
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
    map.setFilter('Drifters', filters);
}

export {AddDrifters, filterDrifterBy}
