// The Vue build version to load with the `import` command

// For IE compatability
import 'babel-polyfill';

// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';

import App from './App.vue';
import Vue2MapboxGL from 'vue2mapbox-gl';


Vue.use(Vue2MapboxGL);
Vue.use(Vuetify);

import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
