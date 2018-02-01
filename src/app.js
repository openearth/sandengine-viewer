import Vue from 'vue';
import {
  bus
} from '@/event-bus.js';
import 'material-design-icons/iconfont/material-icons.css';
import LayerControl from './components/LayerControl';
import {
  AddAeolian,
  ShowAeolianData
} from './components/aeolian.js';
import {
  AddMeteo,
  ShowMeteoData
} from './components/meteo.js'
import {
  AddMorphology
} from './components/morphology.js'
export default {
  name: 'app',
  data: function() {
    return {
      map: null,
      drawer: false,
      fixed: false,
      showSettings: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      layers: [],
      jsondata: "None",
      msg: "",
      timeStart: null,
      timeEnd: null,
      plots: []
    };
  },
  mounted() {
    bus.$on('select-layers', (layers) => {
      Vue.set(this, 'layers', layers);
    });

    bus.$on('click-plots', (plots) => {
      Vue.set(this, 'plots', plots);
    });

    bus.$on('map-loaded', (event) => {
      Vue.set(this, 'map', event.target);
    });
    this.$refs.map.$on('mb-load', (event) => {
      bus.$emit('map-loaded', event);
      AddMeteo(this.$refs.map.map, this.layers)
      AddMorphology(this.$refs.map.map, this.layers)
      AddAeolian(this.$refs.map.map, this.layers)

      // TODO: Click event toevoegen
      this.map.on('mousemove', (e) => {
        this.$refs.map.map.getCanvas().style.cursor = '';
        var features = this.map.queryRenderedFeatures(e.point);
        if (typeof features[0] !== 'undefined') {
          this.$refs.map.map.getCanvas().style.cursor = 'pointer';
        }
      })

      this.map.on('click', (e) => {
        var click_lon = e.lngLat.lng
        var click_lat = e.lngLat.lat

        var meteo = this.layers.find(item => item.id === "meteo-layer")
        var lon_min = meteo.source.coordinates[0][0]
        var lon_max = meteo.source.coordinates[1][0]
        var lat_min = meteo.source.coordinates[2][1]
        var lat_max = meteo.source.coordinates[0][1]
        if (click_lon <= lon_max && click_lat <= lat_max &&
          click_lon >= lon_min && click_lat >= lat_min) {
          var ids = []
          var params = ["Barometer_Avg", "WindSpeed_Avg", "RelHumidity_Avg"]
          _.each(params, (p) => {
            this.plots.push(p)
            ids.push("plot_" + p)
            bus.$emit('click-plots', this.plots);
          })
          ShowMeteoData(ids)

        }
        var features = this.map.queryRenderedFeatures(e.point);
        _.each(features, (point) => {
          if (point.layer.id == "Morphology") {
            var div_id = point.properties.id
            this.plots.push(div_id)
            bus.$emit('click-plots', this.plots);
            // ShowMorphologyData(point.properties, "plot_" + div_id)
          } else if (point.layer.id == "aeolian-layer") {
            var div_id = "Particle_" + point.properties.location_ID
            this.plots.push(div_id)
            bus.$emit('click-plots', this.plots);
            console.log("plot_" + div_id)
            ShowAeolianData(point, "plot_" + div_id)
          }
        })
      });
    })

  },
  methods: {
    removePlot (e){
      var index = this.plots.indexOf(e);
      this.plots.splice(index, 1);
      bus.$emit('click-plots', this.plots);
    }
  },
  components: {
    'layer-control': LayerControl
  }
};