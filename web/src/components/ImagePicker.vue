<template>
  <v-container>
    <img ref="image" :alt="image.name" src="" />
    <v-file-input
      @update:model-value="selectFile"
      :loading="isFileLoading"
      accept="image/*"
      label="Take or select photo"
      show-size
    ></v-file-input>
    <v-row v-if="showTools">
      <v-col cols="6" sm="4">
        <v-text-field
          v-model="maxWidth"
          type="number"
          label="Max. width"
          suffix="px"
          @update:model-value="storeMaxWidth"
        ></v-text-field>
      </v-col>
      <v-col cols="6" sm="4">
        <v-text-field
          v-model="maxHeight"
          type="number"
          label="Max. height"
          suffix="px"
          @update:model-value="storeMaxHeight"
        ></v-text-field>
      </v-col>
      <v-col cols="6" sm="4">
        <v-combobox
          v-model="imageFormat"
          :items="imageFormats"
          label="Output image format"
          @update:model-value="storeImageFormat"
        ></v-combobox>
      </v-col>
    </v-row>
    <v-row v-if="showTools">
      <v-btn
        class="mx-2"
        icon="mdi-rotate-left"
        size="small"
        color="primary"
        title="Rotate Left"
        @click="clickTool('rotate-left')"
      >
      </v-btn>
      <v-btn
        class="mx-2"
        icon="mdi-rotate-right"
        size="small"
        color="primary"
        title="Rotate Right"
        @click="clickTool('rotate-right')"
      >
      </v-btn>
    </v-row>
  </v-container>
</template>

<style>
img {
  display: block;
  max-width: 100%;
  max-height: 30vh;
}

cropper-canvas {
  height: 30vh;
  width: 100%;
}
</style>

<script>
import Cropper from "cropperjs";
import heic2any from "heic2any";

export default {
  data: () => ({
    originalFile: null,
    isFileLoading: false,
    image: {},
    imageFormat: window.localStorage.getItem("imageFormat") || "jpeg",
    imageFormats: ["jpeg", "png"],
    // image: {url: "/img/icons/apple-touch-icon.png"},
    showTools: false,
    cropper: null,
    naturalWidth: 0,
    naturalHeight: 0,
    rotation: 0,
    maxWidth: window.localStorage.getItem("maxWidth") || 5120,
    maxHeight: window.localStorage.getItem("maxHeight") || 5120,
  }),
  methods: {
    removeImage() {
      this.showTools = false;

      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }

      this.$refs.image.alt = "";
      this.$refs.image.src = "";

      const event = new CustomEvent("image-removed");
      window.dispatchEvent(event);
    },
    clickTool(action) {
      const cropperImage = this.cropper.getCropperImage();
      window._paq?.push(["trackEvent", "Image", "ToolAction", action]);
      console.debug(action);
      switch (action) {
        case "zoom-in":
          cropperImage.$zoom(0.1);
          break;
        case "zoom-out":
          cropperImage.$zoom(-0.1);
          break;
        case "rotate-left":
          cropperImage.$rotate("-90deg");
          this.rotation -= 90;
          break;
        case "rotate-right":
          cropperImage.$rotate("90deg");
          this.rotation += 90;
          break;
        case "flip-horizontal":
          cropperImage.$scale(-1, 1);
          break;
        case "flip-vertical":
          cropperImage.$scale(1, -1);
          break;
        default:
      }
    },
    async selectFile(file) {
      if (!file) {
        return;
      }

      this.isFileLoading = true;

      // convert heic/heif to jpg
      if (file.type === "image/heic" || file.type === "image/heif") {
        const fileName = file.name;
        file = await heic2any({
          blob: file,
          toType: "image/jpeg",
        });
        file.name = fileName + ".jpg";
      }

      this.originalFile = file;
      this.removeImage();

      this.image = {
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      };

      // this is crucial, "src" must be set this way for cropper to work
      this.$refs.image.src = this.image.url;

      this.cropper = new Cropper(this.$refs.image, {
        template: `
          <cropper-canvas background>
            <cropper-image rotatable scalable translatable></cropper-image>
            <cropper-handle action="move" plain></cropper-handle>
          </cropper-canvas>
        `,
      });

      const cropperImage = this.cropper.getCropperImage();
      const loadedImage = await cropperImage.$ready();
      this.naturalWidth = loadedImage.naturalWidth;
      this.naturalHeight = loadedImage.naturalHeight;
      this.rotation = 0;
      this.showTools = true;
      window._paq?.push(["trackEvent", "Image", "Loaded", file.size]);
      window.dispatchEvent(new CustomEvent("image-loaded"));

      this.isFileLoading = false;

      // this.sending = false;
      // this.sendFile();
    },
    /**
     * Send the image file as event
     */
    sendImageFile(file) {
      window.file = file;
      const event = new CustomEvent("send-retrieved-file");
      window.dispatchEvent(event);
    },
    /**
     * Checks if the image was modified
     *
     * @returns {boolean}
     */
    isImageModified() {
      // check if image formats match
      if (!this.originalFile.type.includes(this.imageFormat)) {
        return true;
      }

      // check if image size needs to be adapted
      const rotated = Math.abs(this.rotation % 180) === 90;
      const width = rotated ? this.naturalHeight : this.naturalWidth;
      const height = rotated ? this.naturalWidth : this.naturalHeight;
      if (height > Number(this.maxHeight) || width > Number(this.maxWidth)) {
        return true;
      }

      // check if image needs to be rotated
      return this.rotation % 360 !== 0;
    },
    async getImageCanvas() {
      const source = await this.cropper.getCropperImage().$ready();
      const rotated = Math.abs(this.rotation % 180) === 90;
      const sourceWidth = rotated ? source.naturalHeight : source.naturalWidth;
      const sourceHeight = rotated ? source.naturalWidth : source.naturalHeight;
      const scale = Math.min(
        Number(this.maxWidth) / sourceWidth,
        Number(this.maxHeight) / sourceHeight,
        1,
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(sourceWidth * scale);
      canvas.height = Math.round(sourceHeight * scale);

      const context = canvas.getContext("2d");
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate((this.rotation * Math.PI) / 180);
      context.drawImage(
        source,
        (-source.naturalWidth * scale) / 2,
        (-source.naturalHeight * scale) / 2,
        source.naturalWidth * scale,
        source.naturalHeight * scale,
      );

      return canvas;
    },
    storeMaxWidth(value) {
      window.localStorage.setItem("maxWidth", value);
    },
    storeMaxHeight(value) {
      window.localStorage.setItem("maxHeight", value);
    },
    storeImageFormat(value) {
      window.localStorage.setItem("imageFormat", value);
    },
  },
  mounted() {
    // send image if image sending was requested
    window.addEventListener("retrieve-image", async () => {
      if (this.isImageModified()) {
        const canvas = await this.getImageCanvas();
        canvas.toBlob((blob) => {
          blob.name = this.image.name;
          this.sendImageFile(blob);
        }, "image/" + this.imageFormat);
      } else {
        // send the original image
        this.sendImageFile(this.originalFile);
      }
    });
  },
};
</script>
