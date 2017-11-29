import $ from 'jquery'

export default {
  name: 'VMeteo',
    data () {
      return {
      msg: 'Aeolian transport is fun...'
    }
  },
  mounted() {

    // this.addCanvas(map)

    this.$refs.map.map.on("load", () => {
      this.addCanvas(this.$refs.map.map)
      this.windsock()

    })

  },
  methods: {
    addCanvas(map){
      map.addLayer({
        id: 'canvas-layer',
        type: 'raster',
        source:  {
           type: 'canvas',
           canvas: 'windsock-canvas',
           coordinates: [
               [4, 53],
               [5, 53],
               [5, 52],
               [4, 52]
           ]
        },
        paint: {}
      });
    },

    windsock(){
      var jsondata = $.getJSON({
        'url':'/static/wind_data.json',
        'async': false}).responseJSON
      var t = 0
      function draw(){
        var direc = jsondata.direc
        var aspeed = jsondata.aspeed[t]
        console.log(aspeed)
        var ctx = document.getElementById('windsock-canvas').getContext('2d');
        var w = 200
        var h = 200
        var bh = 70
        var bw = 80
        var c = 100

        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.arc(c, c, 10, 0, Math.PI * 2)
        ctx.fillStyle = "black";
        ctx.fill();

        ctx.closePath();
        ctx.beginPath();

        ctx.moveTo(bw, bh+10);
        ctx.lineTo(c, c);
        ctx.lineTo(bw+40, bh+10);
        ctx.stroke()
        ctx.closePath();
        ctx.beginPath();

        if (aspeed >0) { ctx.rect(80, bh, 40, 10)}
        if (aspeed >4) { ctx.rect(80, bh-20, 40, 10)}
        if (aspeed >8) { ctx.rect(80, bh-40, 40, 10)}

        ctx.fillStyle = "red"
        ctx.fill()

        ctx.closePath();
        ctx.beginPath();
        if (aspeed >2) { ctx.rect(80, bh-10, 40, 10)}
        if (aspeed >6) { ctx.rect(80, bh-30, 40, 10)}
        ctx.fillStyle = "white"
        ctx.fill()

        ctx.translate(w/2, h/2)
        ctx.rotate(-(180 - direc[t-1])*(2 * Math.PI / 360))
        ctx.rotate((180 - direc[t])*(2 * Math.PI / 360))

        ctx.translate(-w/2, -h/2)
        t += 1

        console.log('test', direc[t], (direc[t]*(2 * Math.PI / 360)))
        setTimeout(function () {

        }, 1000);
        requestAnimationFrame(draw);
      }

      draw()

    }
  }
}
