import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueMatomo from "vue-matomo";
import './registerServiceWorker'
import 'cropperjs/dist/cropper.css';

Vue.config.productionTip = false

// https://www.npmjs.com/package/vue-matomo
Vue.use(VueMatomo, {
  host: "https://p.bekerle.com",
  siteId: 8,
  enableHeartBeatTimer: true,
});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
