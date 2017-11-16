import Vue from 'vue';
import Router from 'vue-router';
// note that @ refers to src
import HelloWorld from '@/components/HelloWorld';
import HelloMorphology from '@/components/HelloMorphology';
import HelloRadar from '@/components/Helloradar';

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
    }
  ]
});
