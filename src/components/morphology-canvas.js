import {
  bus
} from '@/event-bus.js';
import _ from 'lodash';
import Vue from 'vue';

export default {
  name: 'morphology-canvas',
  data () {
    return {
      baseUrl: 'https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/morphology/jetski',
      meta: null,
      map: null
    };
  },
  mounted() {
    fetch(this.baseUrl + '/meta.json')
      .then((resp) => {
        return resp.json();
      })
      .then(json => {
        this.meta = json;
        Vue.nextTick(() => {
          // after we render everything lookup all elements
          _.each(
            this.meta,
            (item, i) => {

              const selector = '#morphology-' + i;
              const el = this.$el.querySelector(selector)
              const children = el.children;
              const [video, source, dest] = children;
              item.width = 500;
              item.height = 625;
              item.video = video;
              item.source = source;
              item.dest = dest;
              item.ctxSrc = source.getContext('2d');
              item.ctxDest = dest.getContext('2d');


              item.id = 'morphology-canvas-' + i;

              let layer = {
                name: "Jetski-" + i,
                active: false,
                visibility: "none",
                id: item.id,
                type: 'raster',
                icon: 'filter_drama',
                source: {
                  type: 'canvas',
                  animate: true,
                  canvas: item.id,
                  coordinates: [
                    [item.extent[0], item.extent[1]],
                    [item.extent[2], item.extent[1]],
                    [item.extent[2], item.extent[3]],
                    [item.extent[0], item.extent[3]]
                  ]
                },
                paint: {}
              };
              item.layer = layer;
              console.log('layer', layer);
              this.publishLayers();


            }
          )
          this.animate();

        });
      })

  },
  methods: {
    deferredMountedTo(map) {
      this.map = map;
      this.publishLayers();
    },
    animate() {
      requestAnimationFrame(this.animate);
      _.each(this.meta, (item) => {
        // render to canvas
        item.ctxSrc.drawImage(item.video, 0, 0, item.width, item.height * 2);
        // get frame into memory
        const nPixels = (item.width * item.height);
        let frame = item.ctxSrc.getImageData(0, 0, item.width, item.height * 2)
        for (let i = 0; i < nPixels; i++) {
          let r = frame.data[i * 4 + 0];
          let g = frame.data[i * 4 + 1];
          let b = frame.data[i * 4 + 2];
          let a = frame.data[(i * 4) + nPixels * 4] > 100 ? 0 : 255;
          frame.data[i * 4 + 3] = a;
        };
        item.ctxDest.putImageData(frame, 0, 0);
      });
    },
    publishLayers() {
      if (this.map == null) {
        // map is not set yet
        return;
      }
      _.each(this.meta, (item) => {
        this.map.addLayer(item.layer);
        bus.$emit('add-layer', item.layer);
      })
    }
  }

}
