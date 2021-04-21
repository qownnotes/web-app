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
            v-if="currentFile"
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
      insertConfirmationTimeoutTimer: null
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
        this.insertConfirmationTimeoutTimer = setTimeout(() => {
          this.sending = false;
          const event = new CustomEvent("warning", {
            detail: "We did not get a file insert confirmation after 15sec. " +
                "Is the QOwnNotes desktop application running and using the same security token?" });
          window.dispatchEvent(event);
        }, 15000)
      },
      selectFile(file) {
        this.currentFile = file;

        if (!file) {
          return;
        }

        this.sending = false;
        this.sendFile();
      },
    },
    mounted() {
      window.addEventListener("insert-confirmed", () => {
        clearTimeout(this.insertConfirmationTimeoutTimer);
        this.sending = false;
      });
    },
    beforeMount() {
      WebSocketService.init();
    },
    beforeDestroy() {
      WebSocketService.close();
    }
  }
</script>
