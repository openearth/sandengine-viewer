import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import HelloMorphology from '@/components/HelloMorphology'

Vue.use(Router)

export default new Router({
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
    }
  ]
})
