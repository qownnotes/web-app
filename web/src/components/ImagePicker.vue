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
}
</style>

<script>
import Cropper from 'cropperjs';

export default {
  data: () => ({
    image: {},
    // image: {url: "/img/icons/apple-touch-icon.png"},
    showTools: false,
    cropper: null,
    data: {}
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
      this.currentFile = file;
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

          const event = new CustomEvent("image-loaded");
          window.dispatchEvent(event);
        },
      });

      // this.sending = false;
      // this.sendFile();
    }
  },
  mounted() {
    window.addEventListener("retrieve-image", () => {
      // const dataUrl = this.cropper.getCroppedCanvas().toDataURL(this.image.type);
      // console.log(dataUrl);

      this.cropper.getCroppedCanvas().toBlob((blob) => {
        blob.name = this.image.name;

        const event = new CustomEvent("send-retrieved-file");
        window.file = blob;
        window.dispatchEvent(event);
      });
    });
  }
}
</script>
