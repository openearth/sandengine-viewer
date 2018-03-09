import * as d3 from 'd3';
import $ from 'jquery';
import _ from 'lodash';
import 'moment';
import 'luxon';

export default {
  name: 'ImageTimeseries',
  props: {
    images: {
      type: Array,
      default: []
    }
  },
  data () {
    let startDate = new Date(2012, 4, 3, 15, 5, 34);
    let endDate = new Date(2014, 11, 19, 12, 36, 4);
    let dates = [startDate, endDate];
    let timeScale = d3.scaleTime()
        .domain(dates);
    return {
      timeScale: timeScale,
      time: 0
    };
  },
  mounted() {
    this.draw();
  },
  computed: {
    canvas() {
      return this.$el.querySelector('canvas.series');
    },
    imgElements() {
     return this.$el.querySelectorAll('img.timeseries');
    }
  },
  methods: {
    draw() {
      let timeScale = this.timeScale.range([0, this.imgElements[0].width]);
      let time = timeScale.invert(this.time);
      let ctx = this.canvas.getContext('2d');
      const margin = 20;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let start = margin;
      _.each(
        this.imgElements,
        (img) => {
          ctx.drawImage(img, -this.time, start);
          start += img.height;
        }
      );
      this.time+= 0.5;

      requestAnimationFrame(this.draw);
    }

  }
}
