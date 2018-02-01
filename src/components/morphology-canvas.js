export default {
  name: 'morphology-canvas',
  data () {
    return {
      meta: null
    };
  },
  mounted() {
    fetch('https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/morphology/jetski/meta.json')
      .then((resp) => {
        return resp.json()
      })
      .then(json => {
        this.meta = meta
      })
  }

}
