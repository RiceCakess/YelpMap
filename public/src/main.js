import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

Vue.use(VueGoogleMaps, {
  load:{
    key: 'AIzaSyCM1skTfXwKQ5NK-JBknm2PVM2hcTvAeW8',
    libraries: 'places'
  },
  installComponents: true
});