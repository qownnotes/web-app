<template>
  <v-app>
    <!--    <v-navigation-drawer-->
    <!--        app-->
    <!--        v-model="drawer"-->
    <!--        absolute-->
    <!--        bottom-->
    <!--        temporary-->
    <!--    >-->
    <!--      <v-list-item>-->
    <!--        <v-list-item-content>-->
    <!--          <v-list-item-title class="title">-->
    <!--            QOwnNotes-->
    <!--          </v-list-item-title>-->
    <!--          <v-list-item-subtitle>-->
    <!--            subtext-->
    <!--          </v-list-item-subtitle>-->
    <!--        </v-list-item-content>-->
    <!--      </v-list-item>-->

    <!--      <v-divider></v-divider>-->

    <!--      <v-list-->
    <!--          dense-->
    <!--          nav-->
    <!--      >-->
    <!--        <v-list-item-->
    <!--            link-->
    <!--        >-->
    <!--          <v-list-item-icon>-->
    <!--            <v-icon>mdi-image</v-icon>-->
    <!--          </v-list-item-icon>-->

    <!--          <v-list-item-content>-->
    <!--            <v-list-item-title>Config</v-list-item-title>-->
    <!--          </v-list-item-content>-->
    <!--        </v-list-item>-->
    <!--      </v-list>-->
    <!--    </v-navigation-drawer>-->

    <v-app-bar>
      <!--      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>-->
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          src="/img/icon.svg"
          width="40"
        />

        QOwnNotes Web App v{{ version }}
      </div>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <Intro />
        <ConfigToken />
        <ImagePicker />
        <SendImage />
      </v-container>
    </v-main>

    <v-footer app>
      <v-alert
        density="compact"
        type="warning"
        v-model="showWarning"
        border="start"
        closable
      >
        {{ warningText }}
      </v-alert>
    </v-footer>
  </v-app>
</template>

<script>
import SendImage from "@/components/SendImage.vue";
import ConfigToken from "@/components/ConfigToken.vue";
import Intro from "@/components/Intro.vue";
import ImagePicker from "@/components/ImagePicker.vue";
import { version } from "../package.json";

export default {
  name: "App",

  components: {
    ImagePicker,
    ConfigToken,
    SendImage,
    Intro,
  },

  data: () => ({
    showWarning: false,
    warningText: "",
    drawer: false,
    version: version,
  }),
  methods: {
    handleWarningEvent(e) {
      console.log("Received warning", e.detail);
      this.warningText = e.detail;
      this.showWarning = true;
      e.stopPropagation();
    },
  },
  mounted() {
    window.addEventListener("warning", this.handleWarningEvent);
    window._paq.push(["trackPageView"]);
    window._paq.push(["setCustomDimension", 1, version]);
    window._paq.push(["setCustomDimension", 2, import.meta.env.MODE]);
  },
  beforeUnmount() {
    window.removeEventListener("warning", this.handleWarningEvent);
  },
};
</script>
