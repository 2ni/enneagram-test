import Vue from 'vue'
import App from './App.vue'
import router from './router'
import titleMixin from './mixins/titleMixin' // https://medium.com/@Taha_Shashtari/the-easy-way-to-change-page-title-in-vue-6caf05006863

import './filters'

import CheckCircleIcon from 'vue-material-design-icons/CheckCircle.vue'
Vue.component('check-icon', CheckCircleIcon)

Vue.mixin(titleMixin)
Vue.use(router)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
