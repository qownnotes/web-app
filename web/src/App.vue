<template>
  <v-app>
    <v-navigation-drawer
        app
        v-model="drawer"
        absolute
        bottom
        temporary
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            QOwnNotes
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
          dense
          nav
      >
        <v-list-item
            link
        >
          <v-list-item-icon>
            <v-icon>mdi-image</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Config</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="/img/icon.svg"
            transition="scale-transition"
            width="40"
        />

        QOwnNotes

<!--        <v-img-->
<!--            alt="Vuetify Name"-->
<!--            class="shrink mt-1 hidden-sm-and-down"-->
<!--            contain-->
<!--            min-width="100"-->
<!--            src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"-->
<!--            width="100"-->
<!--        />-->
      </div>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <ConfigToken/>
        <SendImage/>
      </v-container>
    </v-main>

    <v-footer app>
      <v-alert
          dense
          type="warning"
          v-model="showWarning"
          border="left"
          dismissible
      >
        {{this.warningText}}
      </v-alert>
    </v-footer>
  </v-app>
</template>

<script>
import SendImage from "@/components/SendImage";
import ConfigToken from "@/components/ConfigToken";

export default {
  name: 'App',

  components: {
    ConfigToken,
    SendImage,
  },

  data: () => ({
    showWarning: false,
    warningText: "",
    drawer: false,
  }),
  methods: {
    handleWarningEvent(e) {
      console.log("Received warning", e.detail);
      this.warningText = e.detail;
      this.showWarning = true;
      e.stopPropagation();
    }
  },
  mounted() {
    window.addEventListener("warning", this.handleWarningEvent);
  },
  beforeDestroy() {
    window.removeEventListener("warning", this.handleWarningEvent);
  }
};
</script>
