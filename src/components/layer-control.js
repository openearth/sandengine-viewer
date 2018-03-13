import _ from 'lodash';
import moment from 'moment';
import {
  bus
} from '@/event-bus.js';
import Remarkable from 'remarkable';

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

      var md = new Remarkable();
      // launch a vcard with wiki info
      fetch(bus.$emit('add-card', layerID))
        .then((resp) => {
          var div = document.getElementById("plot_" + layerID)
          div.style.width = "500px"
          div.style.heigth = "300px"
          console.log(div)
          fetch('http://raw.githubusercontent.com/wiki/openearth/sandmotor-viewer/' + layerName + '.md', {
              mode: 'cors'
            })
            .then(data => data.text())
            .then(data => {
              div.innerHTML = md.render(data)
            })
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
