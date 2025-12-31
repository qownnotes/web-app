<template>
  <v-container>
    <v-row>
      <v-text-field
        class="pt-5"
        :rules="rules"
        v-model="token"
        @change="change"
        hide-details="auto"
        :type="visibility ? 'password' : 'text'"
        :append-icon="visibility ? 'mdi-eye' : 'mdi-eye-off'"
        append-outer-icon="mdi-qrcode"
        @click:append="() => (visibility = !visibility)"
        @click:append-outer="showQRCode"
      >
        <template v-slot:label>
          <div>
            Security token <small>(use the same in your desktop app)</small>
          </div>
        </template>
      </v-text-field>
    </v-row>
    <v-row>
      <qrcode-stream
        @decode="onDecode"
        :track="this.paintOutline"
        v-if="qrCodeEnabled"
      ></qrcode-stream>
    </v-row>
  </v-container>
</template>

<script>
import WebSocketService from "@/services/WebSocketService";

export default {
  data: () => ({
    token: WebSocketService.readToken(),
    visibility: String,
    qrCodeEnabled: false,
    rules: [
      (value) =>
        !!value ||
        "You need to enter a token to communicate with your local instance of QOwnNotes!",
      (value) =>
        (value && value.length >= 10) ||
        "A minimum of 10 characters are required!",
      (value) => {
        const pattern = /^[0-9a-zA-Z]+$/;
        return pattern.test(value) || "Please only use numbers and characters!";
      },
    ],
  }),
  methods: {
    change(value) {
      console.debug(value);
      WebSocketService.updateToken(value);
    },
    showQRCode() {
      this.qrCodeEnabled = !this.qrCodeEnabled;
    },
    paintOutline(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

        ctx.strokeStyle = "red";

        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (const { x, y } of otherPoints) {
          ctx.lineTo(x, y);
        }
        ctx.lineTo(firstPoint.x, firstPoint.y);
        ctx.closePath();
        ctx.stroke();
      }
    },
    onDecode(decodedString) {
      console.debug("decodedString", decodedString);

      if (decodedString.startsWith("qontoken://")) {
        this.token = decodedString.slice(11, 100);
        this.change(this.token);
        this.qrCodeEnabled = false;
      }
    },
  },
};
</script>
