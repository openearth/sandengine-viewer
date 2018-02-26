import {
  bus
} from '@/event-bus.js';

function AddLidar(map, layers) {
  var json_data = {
    "dataset": "bathymetry_lidar",
    "begin_date": "2010-08-01",
    "end_date": "2012-09-01",
    "step": 30,
    "interval": 30,
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
  var grouplayer = {
    "name": "LiDAR elevation [m, NAP]",
    "active": false,
    "icon":"fa-plane",
    "data": [],
    "type": "group",
    "info": "Elevation measurements of the dutch coast done with LIDAR. <a href='https://data.4tu.nl/repository/uuid:8a8a91bc-e520-4d19-a127-5fd2232cc58e'>Data link</a>"
  }

  _.each(urls, (url) => {
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
      paint: {

      }
    };
    map.addLayer(layer)
    grouplayer.data.push(layer)
  });
  layers.push(grouplayer);
  bus.$emit('select-layers', layers);
}

function getTileUrl(mapId, token) {
  let baseUrl = "https://earthengine.googleapis.com/map";
  let url = [baseUrl, mapId, "{z}", "{x}", "{y}"].join("/");
  url += "?token=" + token;
  return url;
}

export {
  AddLidar
}
