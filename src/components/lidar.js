import {
  bus
} from '@/event-bus.js';
import moment from 'moment';
var lidar = undefined

function AddLidar(map, layers) {
  var begin_date="2001-01-01"
  var end_date="2018-01-01"
  var begin = moment(begin_date)
  var end = moment(end_date)
  var diff = end.diff(begin, 'day')
  var json_data = {
    "dataset": "bathymetry_lidar",
    "begin_date": begin_date,
    "end_date": end_date,
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
    .then((image_data) => {
      AddLayers(image_data, map, layers)
      return image_data
    })
  return image_urls
}

function AddLayers(urls, map, layers){
  lidar = layers.find(item => item.id === "Lidar")
  if (lidar === undefined) {
    var grouplayer = {
      "name": "LiDAR [m, NAP]",
      "active": false,
      "icon":"fa-plane",
      "data": [],
      "type": "group",
      "range": "-12 7",
      "id": "Lidar",
      "clickable": false,
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
          "info": "Elevation measurements of the dutch coast done with LIDAR. <a href='https://data.4tu.nl/repository/uuid:8a8a91bc-e520-4d19-a127-5fd2232cc58e'  target='parent'>Data link</a>"

      }
      layers.push(grouplayer);
      bus.$emit('select-layers', layers);
    }
    else {
      _.each(lidar.data, (old) =>{
        map.removeLayer(old.id)
      })
      lidar.data = []
    }
    var url = urls[0]
      var mapid = url.mapid
      var token = url.token
      let mapUrl = getTileUrl(mapid, token);
      let layer = {
        id: mapid,
        name: "lidar",
        type: "raster",
        active: true,
        layout: {
          visibility: "visible"
        },
        source: {
          type: "raster",
          tiles: [mapUrl],
          tileSize: 256
        },
        paint: {}
      };
      map.addLayer(layer)
      grouplayer.data.push(layer)
    // });
}

function getTileUrl(mapId, token) {
  let baseUrl = "https://earthengine.googleapis.com/map";
  let url = [baseUrl, mapId, "{z}", "{x}", "{y}"].join("/");
  url += "?token=" + token;
  console.log('url', url)
  return url;
}

export {
  AddLidar
}
