<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <div id="log"></div>
        <form id="form">
          <input type="submit" value="Send" />
          <input type="text" id="msg" size="64" autofocus />
        </form>

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

  // window.onload = function () {
  //   var conn;
  //   var msg = document.getElementById("msg");
  //   var log = document.getElementById("log");
  //
  //   function appendLog(item) {
  //     var doScroll = log.scrollTop > log.scrollHeight - log.clientHeight - 1;
  //     log.appendChild(item);
  //     if (doScroll) {
  //       log.scrollTop = log.scrollHeight - log.clientHeight;
  //     }
  //   }
  //
  //   document.getElementById("form").onsubmit = function () {
  //     if (!conn) {
  //       return false;
  //     }
  //     if (!msg.value) {
  //       return false;
  //     }
  //     conn.send(msg.value);
  //     msg.value = "";
  //     return false;
  //   };
  //
  //   if (window["WebSocket"]) {
  //     console.log(document.location);
  //     conn = new WebSocket("ws://" + document.location.host + "/ws");
  //     conn.onclose = function () {
  //       var item = document.createElement("div");
  //       item.innerHTML = "<b>Connection closed.</b>";
  //       appendLog(item);
  //     };
  //     conn.onmessage = function (evt) {
  //       var messages = evt.data.split('\n');
  //       for (var i = 0; i < messages.length; i++) {
  //         var item = document.createElement("div");
  //         item.innerText = messages[i];
  //         appendLog(item);
  //       }
  //     };
  //   } else {
  //     var item = document.createElement("div");
  //     item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
  //     appendLog(item);
  //   }
  // };

  export default {
    name: 'SendImage',

    data: () => ({
      loader: null,
      sending: false,
      currentFile: false,
      ws: null,
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
        SendService.send(this.ws, this.currentFile)
        setTimeout(() => (this.sending = false), 3000)
      },
      selectFile(file) {
        this.sending = false;
        this.currentFile = file;

        this.sendFile();
      },
    },
    beforeMount() {
      // const url = "\"ws://\" + document.location.host + \"/ws\"";
      const url = "ws://localhost:8080/ws";
      this.ws = new WebSocket(url);
      this.ws.onopen = () => {
        console.log("Connected to socket " + url);
      };

      this.ws.onclose = () => {
        console.log("Connection is closed...");
      };

      this.ws.onerror = (e) => {
        console.error(e.msg);
      }

      this.ws.onmessage = (e) => {
        console.log(e.data);
      }
    },
    beforeDestroy() {
      if (this.ws) {
        this.ws.close();
      }
    }
  }
</script>
