import {
  bus
} from '@/event-bus.js';

import { getTileUrl } from '../lib/gee.js'

import moment from 'moment';

export default {
  props: {
    timeExtent: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data () {
    return {
      map: null,
      imageUrls: []
    }
  },
  mounted () {
  },
  watch: {
    timeExtent () {
      console.log('filter by', this.timeExtent)
    }
  },
  methods: {
    fetchImageUrls() {
      const SERVER_URL = 'http://hydro-engine.appspot.com'
      // const SERVER_URL = 'http://136.231.9.161:8080'
      const beginDate = moment("2010-01-01")
      const endDate = moment("2018-01-01")
      const diff = endDate.diff(beginDate, 'day')
      const n = 15
      const requestBody = {
        dataset: "bathymetry_jetski",
        begin_date: beginDate,
        end_date: endDate,
        step: diff/n,
        interval: diff/n,
        unit: "day"
      }
      const request = {
        method: "POST",
        body: JSON.stringify(requestBody),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      let promise = fetch(SERVER_URL + '/get_image_urls', request)
        .then((resp) => {
          return resp.json();
        })
      return promise
    },
    addLayer(urls) {
      const css = `background: linear-gradient(to right, #000033,#000037,#00003a,#00003e,
          #000042,#000045,#000049,#00004d,#000050,#000054,#000057,#00005b,#00005f,
          #000062,#000066,#010268,#03036a,#04056c,#05076e,#070971,#080a73,#0a0c75,
          #0b0e77,#0c1079,#0e117b,#0f137d,#10157f,#121781,#131884,#141a86,#161c88,
          #171e8a,#191f8c,#1a218e,#1b2390,#1d2492,#1e2695,#1f2897,#212a99,#222b9b,
          #242d9d,#252f9f,#2a35a2,#2e3ca6,#3342a9,#3848ac,#3c4faf,#4155b3,#465cb6,
          #4a62b9,#4f68bc,#546fc0,#5875c3,#5d7bc6,#6282ca,#6688cd,#6b8fd0,#7095d3,
          #749bd7,#79a2da,#7ea8dd,#82aee0,#87b5e4,#8cbbe7,#90c2ea,#95c8ed,#9acef1,
          #9ed5f4,#a3dbf7,#a8e1fa,#9edef7,#94daf4,#8ad6f0,#80d2ed,#84cacb,#87c2a9,
          #8bba87,#8eb166,#92a944,#95a122,#999900,#a4a50b,#afb116,#babd21,#c5c92c,
          #d0d537,#dce142,#e7ec4d,#f2f857,#f3f658,#f3f359,#f4f15a,#f5ee5b,#f6eb5c,
          #f6e95d,#f7e65d,#f8e35e,#f9e15f,#fade60,#fadc61,#fbd962,#fcd663,#fdd463,
          #fdd164,#fecf65,#ffcc66,#fdc861,#fcc55d,#fbc158,#f9be53,#f7ba4f,#f6b64a,
          #f5b346,#f3af41,#f1ac3c,#f0a838,#efa433,#eda12e,#eb9d2a,#ea9a25,#e99620,
          #e7931c,#e58f17,#e48b13,#e3880e,#e18409,#df8105,#de7d00);`
      const info = `Zandmotor bathymetric and topographic survey, gridded on 20m grid.
                    <a href='https://data.4tu.nl/repository/uuid:c40da555-3eff-4c3c-89d6-136994a07120'>Data link</a>`

      const layer = {
          name: "Jetski",
          active: false,
          icon: "landscape",
          data: [],
          type: "group",
          id: "Jetski",
          range: "-12 7",
          'z-order': 0,
          css: css,
          info: info
      }
      _.each(urls, (source) => {
        let subLayer = {
          id: source.mapid,
          name: "jetski",
          type: "raster",
          properties: {
            beginDate: moment(source.begin.value),
            endDate: moment(source.end.value)
          },
          layout: {
            visibility: "none"
          },
          source: {
            type: "raster",
            tiles: [source.url],
            tileSize: 256
          }
        };
        this.map.addLayer(subLayer)
        layer.data.push(subLayer)
      });
      bus.$emit('add-layer', layer);
    },
    deferredMountedTo (map) {
      this.map = map
      this.fetchImageUrls()
        .then((urls) => {
          this.imageUrls = urls
          this.addLayer(urls)
        })
    }
  }
}
