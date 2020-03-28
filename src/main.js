import Vue from 'vue'
import './plugins/bootstrap-vue'
import {router} from "./plugins/vue-router"
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
