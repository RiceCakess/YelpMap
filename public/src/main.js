import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import Vuetify from 'vuetify/lib'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

const globalConfig = require("./config");
Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(VueGoogleMaps, {
  load:{
    key: globalConfig.GOOGLE_MAPS_API_KEY,
    libraries: 'places'
  },
  installComponents: true
});
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')