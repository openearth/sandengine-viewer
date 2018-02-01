export default {
  name: 'morphology-canvas',
  data () {
    return {
      baseUrl: 'https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/morphology/jetski',
      meta: null
    };
  },
  mounted() {
    fetch(this.baseUrl + '/meta.json')
      .then((resp) => {
        return resp.json()
      })
      .then(json => {
        this.meta = json
      })
  }

}
