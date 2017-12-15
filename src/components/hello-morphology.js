export default {
  name: 'HelloMorphology',
  data () {
    return {
    };
  },
  mounted() {
    let map = this.$refs.map.map;
    map.on('load', () => {
      console.log('loaded map', map);
      map.addLayer({
        "id": "measurements",
        "type": "circle",
        "source": {
          "type": "geojson",
          "data": "static/sediment_data.geojson"
        },
        paint: {
          "circle-color": '#52A8B4',
          "circle-opacity": 0.5
        }
      });
    });
  }

}
