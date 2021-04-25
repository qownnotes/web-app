<template>
  <v-container>
    <croppa
        v-model="croppa"
        placeholder="Take or select photo"
        :placeholder-font-size="16"
        :prevent-white-space="true"
        auto-sizing
        initial-size="cover"
        :show-remove-button="false"
        @new-image="onImageLoaded"
        @image-remove="onImageRemoved"
    ></croppa>
    <v-layout v-if="showTools">
      <v-btn
          class="mx-2"
          fab
          small
          color="primary"
          @click="croppa.rotate(-1)"
      >
        <v-icon dark>
          mdi-format-rotate-90
        </v-icon>
      </v-btn>
      <v-btn
          class="mx-2"
          fab
          small
          color="primary"
          @click="croppa.chooseFile()"
      >
        <v-icon dark>
          mdi-folder-image
        </v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<style>
.croppa-container {
  height: 500px;
  margin: 50px auto;
  display: block;
}
</style>

<script>
export default {
  data: () => ({
    croppa: null,
    showTools: false
  }),
  methods: {
    onImageLoaded() {
      this.showTools = true;
      const event = new CustomEvent("image-loaded");
      window.dispatchEvent(event);
    },
    onImageRemoved() {
      this.showTools = false;
      const event = new CustomEvent("image-removed");
      window.dispatchEvent(event);
    }
  },
  mounted() {
    window.addEventListener("retrieve-image", () => {
      this.croppa.generateBlob((file) => {
        console.log(file);

        const event = new CustomEvent("send-retrieved-file");
        window.file = file;
        window.dispatchEvent(event);
      }, "image/jpeg");

    });
  }
}
</script>
