<template>
  <v-container>
    <v-text-field
        label="Security token"
        :rules="rules"
        @change="change"
        hide-details="auto"
    ></v-text-field>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    rules: [
      value => !!value || 'You need to enter a token to communicate with your local instance of QOwnNotes!',
      value => (value && value.length >= 10) || 'A minimum of 10 characters are required!',
      value => {
        const pattern = /^[0-9a-zA-Z]+$/
        return pattern.test(value) || 'Please only use numbers and characters!'
      }
    ],
  }),
  methods: {
    change (value) {
      console.log(value);
    }
  }
}
</script>
