import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";
import VueMatomo from "vue-matomo";
import "./registerServiceWorker";
import "cropperjs/dist/cropper.css";

const app = createApp(App);

// https://www.npmjs.com/package/vue-matomo
app.use(VueMatomo, {
  host: "https://p.bekerle.com",
  siteId: 8,
  enableHeartBeatTimer: true,
});

// Register vue-qrcode-reader components globally
app.component("QrcodeStream", QrcodeStream);
app.component("QrcodeDropZone", QrcodeDropZone);
app.component("QrcodeCapture", QrcodeCapture);

app.use(vuetify);

app.mount("#app");
