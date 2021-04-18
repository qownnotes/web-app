<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-file-input
            @change="selectFile"
            label="Take or select photo"
        ></v-file-input>
        <v-btn
            :loading="sending"
            :disabled="sending"
            color="blue-grey"
            class="ma-2 white--text"
            fab
            v-on:click="sendFile"
        >
          <v-icon dark>
            mdi-cloud-upload
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import SendService from "../services/SendFilesService";
  import WebSocketService from "@/services/WebSocketService";

  export default {
    name: 'SendImage',

    data: () => ({
      loader: null,
      sending: false,
      currentFile: false,
    }),
    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 3000)

        this.loader = null
      },
    },
    methods: {
      sendFile () {
        this.sending = true;
        SendService.send(this.currentFile)
        setTimeout(() => (this.sending = false), 1000)
      },
      selectFile(file) {
        this.sending = false;
        this.currentFile = file;

        this.sendFile();
      },
    },
    beforeMount() {
      WebSocketService.init();
    },
    beforeDestroy() {
      WebSocketService.close();
    }
  }
</script>
