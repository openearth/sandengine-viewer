import {
  bus
} from '@/event-bus.js';

import moment from 'moment';

function updateJetski(map, layers, begin_date="2010-01-01", end_date="2018-01-01") {
  var begin = moment(begin_date)
  var end = moment(end_date)
  var diff = end.diff(begin, 'day')
  var json_data = {
    "dataset": "bathymetry_jetski",
    "begin_date": begin,
    "end_date": end,
    "step": diff,
    "interval": diff,
    "unit": "day"
  }
  get_images_urls(json_data, map, layers)
}

function get_images_urls(json_data, map, layers) {
  var SERVER_URL = 'http://hydro-engine.appspot.com'
  // var SERVER_URL = 'http://localhost:8080'
  var image_urls = fetch(SERVER_URL + '/get_image_urls', {
      method: "POST",
      body: JSON.stringify(json_data),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    .then((res) => {
      return res.json();
    })
    .then((image_data) =>  {
        updateLayers(image_data, map, layers)
      return image_data
    })
  return image_urls
}

function updateLayers(urls, map, layers) {
  console.log(urls)
  var jetski = layers.find(item => item.name === "Jetski")
  if (jetski === undefined) {
    var jetski = {
      "name": "Jetski [m, NAP]",
      "active": false,
      "icon": "landscape",
      "data": [],
      "type": "group",
      "id": "Jetski",
      "range": "-12 7",
      "z-order": 0,
      "css": "background: linear-gradient(to right, #000033,#000037,#00003a,#00003e, \
          #000042,#000045,#000049,#00004d,#000050,#000054,#000057,#00005b,#00005f,\
          #000062,#000066,#010268,#03036a,#04056c,#05076e,#070971,#080a73,#0a0c75,\
          #0b0e77,#0c1079,#0e117b,#0f137d,#10157f,#121781,#131884,#141a86,#161c88,\
          #171e8a,#191f8c,#1a218e,#1b2390,#1d2492,#1e2695,#1f2897,#212a99,#222b9b,\
          #242d9d,#252f9f,#2a35a2,#2e3ca6,#3342a9,#3848ac,#3c4faf,#4155b3,#465cb6,\
          #4a62b9,#4f68bc,#546fc0,#5875c3,#5d7bc6,#6282ca,#6688cd,#6b8fd0,#7095d3,\
          #749bd7,#79a2da,#7ea8dd,#82aee0,#87b5e4,#8cbbe7,#90c2ea,#95c8ed,#9acef1,\
          #9ed5f4,#a3dbf7,#a8e1fa,#9edef7,#94daf4,#8ad6f0,#80d2ed,#84cacb,#87c2a9,\
          #8bba87,#8eb166,#92a944,#95a122,#999900,#a4a50b,#afb116,#babd21,#c5c92c,\
          #d0d537,#dce142,#e7ec4d,#f2f857,#f3f658,#f3f359,#f4f15a,#f5ee5b,#f6eb5c,\
          #f6e95d,#f7e65d,#f8e35e,#f9e15f,#fade60,#fadc61,#fbd962,#fcd663,#fdd463,\
          #fdd164,#fecf65,#ffcc66,#fdc861,#fcc55d,#fbc158,#f9be53,#f7ba4f,#f6b64a,\
          #f5b346,#f3af41,#f1ac3c,#f0a838,#efa433,#eda12e,#eb9d2a,#ea9a25,#e99620,\
          #e7931c,#e58f17,#e48b13,#e3880e,#e18409,#df8105,#de7d00);",
          "info": "Zandmotor bathymetric and topographic survey, gridded on 20m grid. <a href='https://data.4tu.nl/repository/uuid:c40da555-3eff-4c3c-89d6-136994a07120'  target='parent'>Data link</a>"

    }
    layers.push(jetski);
  }
  else {
    _.each(jetski.data, (old) =>{
      map.removeLayer(old.id)
    })
    jetski.data = []
  }
  _.each(urls, (url) => {
    var mapid = url.mapid
    var token = url.token
    let mapUrl = getTileUrl(mapid, token);
    let layer = {
      id: mapid,
      name: "jetski",
      type: "raster",
      layout: {
        visibility: "none"
      },
      source: {
        type: "raster",
        tiles: [mapUrl],
        tileSize: 256
      }
    };
    map.addLayer(layer)
    jetski.data.push(layer)
  });
  bus.$emit('select-layers', layers);
}

function getTileUrl(mapId, token) {
  let baseUrl = "https://earthengine.googleapis.com/map";
  let url = [baseUrl, mapId, "{z}", "{x}", "{y}"].join("/");
  url += "?token=" + token;
  return url;
}

export {
  updateJetski
}
