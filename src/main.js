import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './filters'

import CheckCircleIcon from 'vue-material-design-icons/CheckCircle.vue'
Vue.component('check-icon', CheckCircleIcon)

Vue.use(router)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
