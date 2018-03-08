import _ from 'lodash';
import moment from 'moment';
import {
  bus
} from '@/event-bus.js';

export default {
  name: 'layer-control',
  props: {
    layers: {
      type: Array,
      required: true
    },
    map: {
      type: Object
    }
  },
  data() {
    return {
      btnInfo: null
    };
  },
  mounted() {},
  watch: {
    // Watch "layers". This is a switch, which can toggle a layer on or off
    // When toggled, this watcher will activate the toggleLayers function.
    layers: {
      handler: function(layers) {
        this.toggleLayers();
      },
      deep: true
    },
  },
  methods: {
    addInfoCard(layerName) {
      // make unique ID
      var now = moment(new Date()).unix()
      var layerID = layerName + "_" + now

      // launch a vcard with wiki info
      fetch(bus.$emit('add-card', layerID))
        .then((resp) => {
          //document.getElementById("plot_" + layerID).innerHTML = '<object type="text/plain" data="http://raw.githubusercontent.com/wiki/openearth/sandmotor-viewer/Aeolian.md" style="width:100%; height:100%;"></object>';
          //div.innerHTML = "<iframe src='https://github.com/openearth/sandmotor-viewer/wiki/Aeolian' width='600' height='300' style='border:none;'></iframe>"; // add iFrame
            div.innerHTML = "some text here about " + layerName  
        })
    },

    toggleLayers() {
      if (_.isNil(this.map)) {
        return;
      }
      // Function to toggle the visibility of the layers.
      _.each(this.layers, (layer) => {
        var vis = "none"
        if (layer.active) {
          vis = "visible"
        }

        if (layer.type === 'group') {
          _.each(layer.data, (sublayer) => {
            this.map.setLayoutProperty(sublayer.id, "visibility", vis);
          })
        } else {
          this.map.setLayoutProperty(layer.id, "visibility", vis);
        }
      });
    }
  }
};
