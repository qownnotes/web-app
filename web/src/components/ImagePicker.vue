<template>
  <v-container>
    <img
        ref="image"
        :alt="image.name"
        src="" />
    <v-file-input
        @change="selectFile"
        accept="image/*"
        label="Take or select photo"
        show-size
    ></v-file-input>
    <v-row v-if="showTools">
      <v-col
          cols="12"
          sm="4"
      >
        <v-text-field
            v-model="maxWidth"
            type="number"
            label="Max. width"
            suffix="px"
            @change="storeMaxWidth"
        ></v-text-field>
      </v-col>
      <v-col
          cols="12"
          sm="4"
      >
        <v-text-field
            v-model="maxHeight"
            type="number"
            label="Max. height"
            suffix="px"
            @change="storeMaxHeight"
        ></v-text-field>
      </v-col>
      <v-col
          cols="12"
          sm="4"
      >
        <v-combobox
            v-model="imageFormat"
            :items="imageFormats"
            label="Output image format"
            @change="storeImageFormat"
        ></v-combobox>
      </v-col>
    </v-row>
    <v-layout v-if="showTools">
      <v-btn
          class="mx-2"
          fab
          small
          color="primary"
          title="Rotate Left"
          @click="clickTool('rotate-left')"
      >
        <v-icon dark>
          mdi-rotate-left
        </v-icon>
      </v-btn>
      <v-btn
          class="mx-2"
          fab
          small
          color="primary"
          title="Rotate Right"
          @click="clickTool('rotate-right')"
      >
        <v-icon dark>
          mdi-rotate-right
        </v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<style>
img {
  display: block;
  max-width: 100%;
  max-height: 30vh;
}
</style>

<script>
import Cropper from 'cropperjs';

export default {
  data: () => ({
    originalFile: null,
    image: {},
    imageFormat: window.localStorage.getItem("imageFormat") || 'jpeg',
    imageFormats: ['jpeg', 'png'],
    // image: {url: "/img/icons/apple-touch-icon.png"},
    showTools: false,
    cropper: null,
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
      const { cropper } = this;
      window._paq.push(['trackEvent', 'Image', 'ToolAction', action]);
      console.log(action);
      switch (action) {
        case 'move':
        case 'crop':
          cropper.setDragMode(action);
          break;
        case 'zoom-in':
          cropper.zoom(0.1);
          break;
        case 'zoom-out':
          cropper.zoom(-0.1);
          break;
        case 'rotate-left':
          cropper.rotate(-90);
          break;
        case 'rotate-right':
          cropper.rotate(90);
          break;
        case 'flip-horizontal':
          cropper.scaleX(-cropper.getData().scaleX || -1);
          break;
        case 'flip-vertical':
          cropper.scaleY(-cropper.getData().scaleY || -1);
          break;
        default:
      }
    },
    selectFile(file) {
      this.originalFile = file;
      this.removeImage();

      if (!file) {
        return;
      }

      this.image = {
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      }

      // this is crucial, "src" must be set this way for cropper to work
      this.$refs.image.src = this.image.url;

      this.cropper = new Cropper(this.$refs.image, {
        autoCrop: false,
        dragMode: 'move',
        background: false,
        // crop(event) {
        //   console.log(event.detail.x);
        //   console.log(event.detail.y);
        //   console.log(event.detail.width);
        //   console.log(event.detail.height);
        //   console.log(event.detail.rotate);
        //   console.log(event.detail.scaleX);
        //   console.log(event.detail.scaleY);
        // },
        ready: () => {
          console.log("ready");
          this.showTools = true;
          window._paq.push(['trackEvent', 'Image', 'Loaded', file.size]);

          const event = new CustomEvent("image-loaded");
          window.dispatchEvent(event);
        },
      });

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
      const imageData = this.cropper.getImageData();
      if (imageData.naturalHeight > this.maxHeight || imageData.naturalWidth > this.maxWidth) {
        return true;
      }

      // check if image needs to be rotated
      const data = this.cropper.getData();

      return (data.rotate || 0) !== 0;
    },
    storeMaxWidth(value) {
      window.localStorage.setItem("maxWidth", value);
    },
    storeMaxHeight(value) {
      window.localStorage.setItem("maxHeight", value);
    },
    storeImageFormat(value) {
      window.localStorage.setItem("imageFormat", value);
    }
  },
  mounted() {
    // send image if image sending was requested
    window.addEventListener("retrieve-image", () => {
      if (this.isImageModified()) {
        // send the image from Cropper is it was modified
        this.cropper.getCroppedCanvas({
          maxWidth: this.maxWidth,
          maxHeight: this.maxHeight,
        }).toBlob((blob) => {
          blob.name = this.image.name;
          this.sendImageFile(blob);
        }, 'image/' + this.imageFormat);
      } else {
        // send the original image
        this.sendImageFile(this.originalFile);
      }
    });
  }
}
</script>
