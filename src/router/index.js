import Vue from 'vue';
import Router from 'vue-router';
// note that @ refers to src
import HelloWorld from '@/components/HelloWorld';
import HelloMorphology from '@/components/HelloMorphology';
import HelloRadar from '@/components/Helloradar';
import VMeteo from '@/components/VMeteo';
import VAeolian from '@/components/VAeolian';
import ImageTimeseries from '@/components/ImageTimeseries';

Vue.use(Router);

export default new Router({
  // TODO: can we use this to generate a menu
  // TODO: get rid of the Hello, but stick to a common pattern, for example VMain, VMorpholgy
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/morphology',
      name: 'HelloMorphology',
      component: HelloMorphology
    },
    {
      path: '/radar',
      name: 'HelloRadar',
      component: HelloRadar
    },
    {
      path: '/adcp',
      name: 'ImageTimseries',
      component: ImageTimeseries,
      props: {
        images: [
          'https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/adcp/mag.png',
          'https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/adcp/mag_anomaly.png',
          'https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/adcp/uv.png'
        ]
      }
    },
    {
      path: '/meteo',
      name: 'VMeteo',
      component: VMeteo
    },
    {
      path: '/aeolian',
      name: 'VAeolian',
      component: VAeolian
    }
  ]
});
