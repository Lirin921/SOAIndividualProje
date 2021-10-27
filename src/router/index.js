import Vue from 'vue'
import Router from 'vue-router'

import Search from '@/components/Search'
import InfoPage from '@/components/InfoPage'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'search',
      component: Search,
    },
    {
      path:'/',
      name:'InfoPage',
      component:InfoPage
    },    
  ],
})