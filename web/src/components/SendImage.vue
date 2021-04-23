<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-btn
            :loading="sending"
            :disabled="sending"
            v-if="allowSendButton"
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
      sending: false,
      allowSendButton: false,
      insertConfirmationTimeoutTimer: null
    }),
    methods: {
      sendFile () {
        this.sending = true;
        const event = new CustomEvent("retrieve-image");
        window.dispatchEvent(event);
      }
    },
    mounted() {
      window.addEventListener("insert-confirmed", () => {
        clearTimeout(this.insertConfirmationTimeoutTimer);
        this.sending = false;
      });

      window.addEventListener("image-loaded", () => {
        this.allowSendButton = true;
      });

      window.addEventListener("image-removed", () => {
        this.allowSendButton = false;
      });

      window.addEventListener("send-retrieved-file", () => {
        SendService.send(window.file);

        this.insertConfirmationTimeoutTimer = setTimeout(() => {
          this.sending = false;
          const event = new CustomEvent("warning", {
            detail: "We did not get a file insert confirmation after 15sec. " +
                "Is the QOwnNotes desktop application running and using the same security token?" });
          window.dispatchEvent(event);
        }, 15000)
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
