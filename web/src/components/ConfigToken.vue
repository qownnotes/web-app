<template>
  <v-container>
    <v-text-field
        label="Security token"
        :rules="rules"
        hide-details="auto"
    ></v-text-field>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    rules: [
      value => !!value || 'Required.',
      value => (value && value.length >= 10) || 'Min 10 characters',
    ],
  }),
}
</script>
