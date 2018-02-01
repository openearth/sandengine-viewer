export default {
  name: 'VAeolian',
  data() {
    return {
      msg: 'Aeolian transport deployment measurements',
      timeseries: null,
      locationID: null,
      deploymentName: null,
      timeStart: null,
      timeEnd: null
    }
  },
  mounted() {
    // this.addCanvas(map) // eslint plugin ; beautify
    this.$refs.map.map.on("load", () => {
      this.addCanvas(this.$refs.map.map);
      this.$refs.map.map.on('click', 'aeolian-measurements', (e) => {
        this.loadData(e)
      });
    this.$refs.map.map.on('mouseenter', 'aeolian-measurements', function(e) {
        // Change the cursor style as a UI indicator.
        this.getCanvas().style.cursor = 'pointer';
      });
    this.$refs.map.map.on('mouseleave', 'aeolian-measurements', function(e) {
          // Change the cursor style as a UI indicator.
          this.getCanvas().style.cursor = '';
      });
    })
  },
  methods: {
    addCanvas(map) {
      map.addLayer({
        id: 'aeolian-measurements',
        type: 'circle',
        cursor : 'pointer',
        source: {
          type: 'geojson',
          data: '/static/aeolian_data.geojson'
        },
        paint: {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 1.75,
                'stops': [[12, 2], [22, 180]]
            },
            'circle-color': [
                'match',
                ['get', 'deploymentName'],
                'dn1', '#fbb03b',
                'dn2', '#223b53',
                'dn3', '#e55e5e',
                'dn4', '#3bb2d0',
                'dn5', '#956a37',
                'dn6', '#8a5f2c',
                'dn7', '#815726',
                'dn8', '#724c20',
                'dn9', '#66451f',
                'dn10', '#2f1b02',
                'dn11', '#201503',
                'dn67', '#453c09',
                /* other */ '#ccc'
            ]
          }
      });
    },
    loadData(e) {
      // todo check if multiple are selected; for now just select first
      var deploymentName = e.features[0].properties.deploymentName;
      var locationID = e.features[0].properties.location_ID;
      var timeEnd = Date(parseFloat(e.features[0].properties.timeEnd));
      var timeStart = Date(parseFloat(e.features[0].properties.timeStart));

      fetch("https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/aeolian/aeolian_data_" + deploymentName + ".json")
        .then((resp) => {
          return resp.json();
        })
        .then((timeseries) => {
          this.locationID = locationID;
          this.deploymentName = deploymentName;
          this.timeseries = timeseries;
          this.timeEnd = timeEnd
          this.timeStart = timeStart
          this.bokehplot();
        })
        .catch((reason) => {
          console.warn(reason)
        })
      },
    bokehplot(){

      // Check if timeseries is set
      if (this.timeseries == null) {
        console.log('No timeseries defined');
        return -1
      }

      var div = document.getElementById('Particle_count_plot');
      div.innerHTML = ""; // clear div

      // General Bokeh settings
      var plt = Bokeh.Plotting;
      var tools = "pan,crosshair,wheel_zoom,box_zoom,reset,save";

      // Get time slice
      var data = this.timeseries[this.deploymentName];
      var keys = Object.keys(data);

      var time = data[keys[0]];
      var begin = 0;
      var end = time.length;

      var x = []
      _.each(time.slice(begin, end), function(event) {
        x.push(new Date(event))
      });

      var plot = new plt.figure({
        title: "Deployment: " + this.deploymentName + " Location: " + this.locationID + "\n Start deployment: " + this.timeStart + " End deployment: " + this.timeEnd,
        tools: tools,
        width: 1000,
        height: 350,
        x_axis_type: 'datetime',
        x_axis_label: 'Time',
        y_axis_label: 'Number of particles [-]',
        background_fill_color: "#F2F2F7"
      });

      // output linesegment per height
      var locationIDdata = data[this.locationID];
      var heights = Object.keys(locationIDdata);
      var colors = ["#666699","#66ff66","#ff6666"];

      for (var i = 0; i < heights.length; i++) {
        var height = locationIDdata[heights[i]]['height'];
        var y = data[this.locationID][heights[i]]['particle_counts'];
        y = y.slice(begin, end);

        // remove 0 values
        function filterFunction(value, index, array) {
          return y[index] > 0;
        }
        var xwithoutzero = x.filter(filterFunction);
        var ywithoutzero = y.filter(filterFunction);

        var source = new Bokeh.ColumnDataSource({
          data: {
            x: xwithoutzero,
            y: ywithoutzero
          }
        });

        var line = new Bokeh.Line({
          x: {
            field: "x"
          },
          y: {
            field: "y"
          },
          line_color: colors[i],
          line_width: 2
        });
        plot.add_glyph(line, source);
      }

      console.log("Compiling Bokeh plot")
      var doc = new Bokeh.Document();
      doc.add_root(plot);
      Bokeh.embed.add_document_standalone(doc, div);
    }
  }
}
