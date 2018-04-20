import $ from 'jquery';
import _ from 'lodash';
import Vue from 'vue';
import moment from 'moment';
import ionRangeslider from 'ion-rangeslider/js/ion.rangeSlider.js';
import 'font-awesome/css/font-awesome.css';

const DAY_FORMAT = 'Y-MM-DD'

export default {
  name: "time-slider",
  props: {
    showPlay: {
      type: Boolean,
      default: true
    },
    // the maximum extent for this slider
    extent: {
      type: Array,
      default () {
        let now = moment()
        let then = moment().subtract(7, 'years')
        return [then, now]
      }
    }
  },
  data() {
    return {
      configDialog: false,
      startDateMenu: false,
      endDateMenu: false,
      // by default use the full extent
      startDate: this.extent[0].format(DAY_FORMAT),
      endDate: this.extent[1].format(DAY_FORMAT),
      // duration of a loop
      loopDuration: 20,
      maxFps: 10,
      // last timestep (for syncing rate)
      last: null,
      loop: true,
      state: 'paused',
      slider: null
    };
  },
  mounted() {
    Vue.nextTick(() => {
      let input = this.$el.querySelector("input.slider");
      console.log('max', this.initialMax)
      $(input).ionRangeSlider({
        type: "double",
        drag_interval: true,
        min: 0,
        max: 1,
        to: this.initialTo,
        // not sure how to avoid steps, now use 1000 steps
        step: 0.001,
        grid: false,
        hide_min_max: true,
        onFinish: (val) => {
          this.$emit('time-extent-update', this.currentExtent)
        },
        onUpdate: (val) => {
          this.$emit('time-extent-update', this.currentExtent)
        },
        prettify: val => this.dateFormat(val)
      });
      this.slider = $(input).data("ionRangeSlider");
      this.step()
    })
  },
  watch: {
    extent(val) {
      if (this.slider.dragging) {
        return;
      }
      // always slide from 0 to 1
      this.slider.update({
        from: 0,
        to: 1
      });
    },
    startDate(val) {
      this.slider.update()
    },
    endDate(val) {
      this.slider.update()
    }

  },
  methods: {
    pause() {
      this.state = 'paused';
    },
    play() {
      this.last = performance.now();
      this.state = 'playing';
    },
    step(now) {
      // request the next step (yes you can call this function now, does not matter)
      requestAnimationFrame(this.step)
      // first update, when this.last is still null, set value and return
      if (!this.last) {
        this.last = now;
        return
      }
      // now we can just return if we are not playing (will result in a regular poll for playing)
      if (this.state !== 'playing') {
        return;
      }
      // elapsed time in seconds
      const elapsed = (now - this.last)/1000;
      // seconds per frame did not elapse, we're done
      if (elapsed < (1/this.maxFps)) {
        // this keeps the number of events low (otherwise you get 60 events per second)
        return;
      }
      // elapsed fraction
      const frac = elapsed / this.loopDuration;
      // update with fraction
      const val = {
        from: _.clamp(this.slider.result.from + frac, 0, 1),
        to: _.clamp(this.slider.result.to + frac, 0, 1)
      }
      // TODO: google earth uses a smarter loop,
      // it keeps track of the diff somehow
      // we reached the end, loop
      if (val.to == 1) {
        if (this.loop) {
          val.to = val.to - val.from
          val.from = 0
        } else {
          // stop updating
          return;
        }
      }
      // apply it to the slider (fires update event)
      this.slider.update(val)
      // remember current time
      this.last = now;
    },
    fractionToDate (fraction) {
      // miliseconds diff
      // http://momentjs.com/guides/#/warnings/js-date/
      const start = moment(this.startDate, DAY_FORMAT)
      const end = moment(this.endDate, DAY_FORMAT)
      // positive number of miliseconds
      const diff = end.diff(start)
      const time = start.clone().add(diff * fraction, 'ms')
      return time
    },
    dateFormat (fraction) {
      return this.fractionToDate(fraction).format(DAY_FORMAT)
    },
    deferredMountedTo(map) {
      // Used when nested in a Leaflet or Mapbox
    },
    dateToFraction (date) {
      const start = moment(this.startDate, DAY_FORMAT)
      const end = moment(this.endDate, DAY_FORMAT)
      // positive number of miliseconds
      const totalDiff = end.diff(start)
      const dateDiff = date.diff(start)
      return dateDiff / totalDiff
    }

  },
  computed: {
    currentTime() {
      return this.fractionToDate(this.slider.result.to);
    },
    currentExtent() {
      return [
        this.fractionToDate(this.slider.result.from),
        this.fractionToDate(this.slider.result.to)
      ];
    },
    allowedDates() {
      // return allowed dates, based on extent
      return {
        min: this.extent[0].format(DAY_FORMAT),
        max: this.extent[1].format(DAY_FORMAT)
      }
    },
    initialTo () {
      const startPlusOneYear = moment(this.startDate).add(1, 'years')
      return this.dateToFraction(moment.min(moment(this.endDate), startPlusOneYear))
    }
  }
}
