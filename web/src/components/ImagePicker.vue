<template>
  <v-container>
    <img
        ref="image"
        :src="imageSrc"
        @loadstart="onImageLoaded"
        @load="onImageLoaded"
        alt="" />
    <v-file-input
        @change="selectFile"
        label="Take or select photo"
    ></v-file-input>
    <v-layout v-if="showTools">
      <v-btn
          class="mx-2"
          fab
          small
          color="primary"
          @click="cropper.rotate(-90)"
      >
        <v-icon dark>
          mdi-format-rotate-90
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
    imageSrc: "",
    // imageSrc: "/img/icons/apple-touch-icon.png",
    showTools: false,
    cropper: null
  }),
  methods: {
    onImageLoaded() {
      console.log("onImageLoaded");
      this.showTools = true;

      this.cropper = new Cropper(this.$refs.image, {
        autoCrop: false,
        dragMode: 'move',
        background: false,
        crop(event) {
          console.log(event.detail.x);
          console.log(event.detail.y);
          console.log(event.detail.width);
          console.log(event.detail.height);
          console.log(event.detail.rotate);
          console.log(event.detail.scaleX);
          console.log(event.detail.scaleY);
        },
      });

      const event = new CustomEvent("image-loaded");
      window.dispatchEvent(event);
    },
    onImageRemoved() {
      this.showTools = false;
      const event = new CustomEvent("image-removed");
      window.dispatchEvent(event);
    },
    selectFile(file) {
      this.currentFile = file;

      // console.log(file.url);

      if (!file) {
        return;
      }

      let reader = new FileReader();

      reader.onerror = () => {
        console.error("Reader error", reader.error);
      };

      reader.onload = (e) => {
        this.imageSrc = e.target.result;
      }

      reader.readAsDataURL(file);


      // this.sending = false;
      // this.sendFile();
    }
  },
  mounted() {
    window.addEventListener("retrieve-image", () => {
      const imageData = this.cropper.getImageData();
      console.log(imageData);
    //   this.cropper.getImageData((file) => {
    //     console.log(file);
    //
    //     const event = new CustomEvent("send-retrieved-file");
    //     window.file = file;
    //     window.dispatchEvent(event);
    //   }, "image/jpeg");
    });
  }
}
</script>
