import Vue from 'vue';
import draggable from 'vuedraggable'

import {
  bus
} from '@/event-bus.js';
import 'material-design-icons/iconfont/material-icons.css';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.js';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import moment from 'moment';

import VWelcome from './components/VWelcome'
import LayerControl from './components/LayerControl';
import MorphologyCanvas from './components/MorphologyCanvas';
import TimeSlider from './components/TimeSlider';
import {
  DrawControls,
  addBathymetryPlot
} from './components/map-draw.js';

import {
  updateJetski
} from './components/jetski.js'
import {
  AddLidar
} from './components/lidar.js'
import {
  AddADCP,
  ShowADCPData,
  filterADCPBy
} from './components/adcp.js'
import {
  AddAeolian,
  ShowAeolianData,
  filterAeolianBy
} from './components/aeolian.js';
import {
  AddDrifters,
  filterDrifterBy
} from './components/drifters.js';
import {
  AddMeteo,
  ShowMeteoData
} from './components/meteo.js'
import {
  AddMorphology,
  filterMorphologyBy
} from './components/morphology.js'

var draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    line_string: true,
    trash: true
  }
});


export default {
  name: 'app',
  data: function() {
    return {
      map: null,
      drawer: true,
      fixed: false,
      showSettings: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      layers: [],
      jsondata: "None",
      msg: "",
      timeExtent: [moment("20110301", "YYYYMMDD"), moment()],
      plots: [],
      draws: []
    };
  },
  mounted() {
    bus.$on('select-layers', (layers) => {
      Vue.set(this, 'layers', layers);
    });
    bus.$on('add-layer', (layer) => {
      this.layers.push(layer);
    });
    bus.$on('add-card', (card) => {
      this.plots.push(card);
    });

    bus.$on('click-plots', (plots) => {
      Vue.set(this, 'plots', plots);
    });
    bus.$on('map-loaded', (event) => {
      Vue.set(this, 'map', event.target);
    });

    this.$refs.timeslider.$on('time-extent-update', (event) => {
      this.timeExtent = event;
      // check which layers are active
      var activeLayers = []
      for (var i = 0; i < this.layers.length; i++) {
        if (this.layers[i].active) {
          activeLayers.push(this.layers[i].id)
        }
      };
      // filter some map layers with filter options on time
      if (activeLayers.indexOf("Drifters") > -1) {
        filterDrifterBy(this.timeExtent, this.$refs.map.map);
      };
      if (activeLayers.indexOf("Aeolian") > -1) {
        filterAeolianBy(this.timeExtent, this.$refs.map.map);
      }
      if (activeLayers.indexOf("Sediment") > -1) {
        console.log('check')
        filterMorphologyBy(this.timeExtent,this.$refs.map.map);
      }
      if (activeLayers.indexOf("Jetski") > -1) {
        updateJetski(this.$refs.map.map, this.layers, this.timeExtent[0], this.timeExtent[1]);
      }
      DrawControls(this.$refs.map.map, this.draws, this.timeExtent[0], this.timeExtent[1], 'bathymetry_jetski')

      // filter all open Bokeh plots on TimeSlider
      var keys = Object.keys(Bokeh.index)
      var tstart = this.timeExtent[0].unix() * 1000;
      var tend = this.timeExtent[1].unix() * 1000;
      for (var i = 0; i < keys.length; i++) {
        var array1 = Bokeh.index[keys[i]].model.attributes.renderers;
        if (array1.map(x => x.type).indexOf('DatetimeAxis') > 0) { // check if bokeh plot contains DatetimeAxis
          Bokeh.index[keys[i]].model.x_range.start = tstart
          Bokeh.index[keys[i]].model.x_range.end = tend
        }
      }
    })

    this.$refs.map.$on('mb-load', (event) => {
      bus.$emit('map-loaded', event);

      // Add different layers (Meteo, Morphology and Aeolian)
      this.$refs.map.map.addControl(draw);

      AddMeteo(this.$refs.map.map, this.layers);
      AddMorphology(this.$refs.map.map, this.layers);
      AddAeolian(this.$refs.map.map, this.layers);
      AddDrifters(this.$refs.map.map, this.layers);
      // AddJetski(this.$refs.map.map, this.layers)
      AddLidar(this.$refs.map.map, this.layers);
      AddADCP(this.$refs.map.map, this.layers);
      updateJetski(this.$refs.map.map, this.layers);
      // TODO: Click event toevoegen
      this.map.on('mousemove', (e) => {
        this.$refs.map.map.getCanvas().style.cursor = '';
        var features = this.map.queryRenderedFeatures(e.point);
        if (typeof features[0] !== 'undefined') {
          this.$refs.map.map.getCanvas().style.cursor = 'pointer';
        }
      })
      this.$refs.map.map.on('draw.create', () => {
        var regions = draw.getAll()
        var region = regions.features[regions.features.length - 1].geometry
        var div_id = JSON.stringify(region)
        this.draws.push(region)
        this.plots.push(div_id)
        bus.$emit('click-plots', this.plots);
        DrawControls(this.$refs.map.map, this.draws, this.timeExtent[0], this.timeExtent[1], 'bathymetry_jetski')
      })



      this.map.on('click', (e) => {
        var click_lon = e.lngLat.lng
        var click_lat = e.lngLat.lat
        // WHen meteo-layer is visible and clicked on
        if (this.map.getLayer('Meteo').visibility === 'visible') {
          var meteo = this.layers.find(item => item.id === "Meteo")
          var lon_min = meteo.source.coordinates[0][0]
          var lon_max = meteo.source.coordinates[1][0]
          var lat_min = meteo.source.coordinates[2][1]
          var lat_max = meteo.source.coordinates[0][1]
          if (click_lon <= lon_max && click_lat <= lat_max &&
            click_lon >= lon_min && click_lat >= lat_min) {
            var ids = []
            var params = ["WindSpeed_Avg", "RelHumidity_Avg"]
            _.each(params, (p) => {
              this.plots.push(p)
              ids.push("plot_" + p)
              bus.$emit('click-plots', this.plots);
            })
            ShowMeteoData(ids)
          }
        }



        // When clicked on a feature of Morphology or aeolian
        var features = this.map.queryRenderedFeatures(e.point);
        _.each(features, (point) => {
          if (point.layer.id == "Sediment") {
            // var div_id = point.properties.id
            //this.plots.push(div_id)
            //bus.$emit('click-plots', this.plots);
            // ShowMorphologyData(point.properties, "plot_" + div_id)
          } else if (point.layer.id == "Aeolian") {
            var div_id = "Particle_" + point.properties.deploymentName + "_" + point.properties.location_ID
            this.plots.push(div_id)
            bus.$emit('click-plots', this.plots);
            ShowAeolianData(point, "plot_" + div_id)
          } else if (point.layer.id == "ADCP") {
            var ids = []
            var params = [point.properties.ADCPID + '_adcp-f-1', point.properties.ADCPID + '_adcp-f-2']
            _.each(params, (p) => {
              this.plots.push(p)
              ids.push("plot_" + p)
              bus.$emit('click-plots', this.plots);
            })
            ShowADCPData(point, ids)
          }
        })
      });
    })

  },
  methods: {
    removePlot(e) {
      var index = this.plots.indexOf(e);
      this.plots.splice(index, 1);
      bus.$emit('click-plots', this.plots);
    }
  },
  components: {
    'layer-control': LayerControl,
    'time-slider': TimeSlider,
    'v-welcome': VWelcome
  }
};
