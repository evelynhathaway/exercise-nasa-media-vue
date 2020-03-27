<template>
  <div class="preview-root">
    <img :src="src"/>
  </div>
</template>

<script>
  export default {
    name: 'Preview',
    props: {
      src: String,
      type: String
    }
  }
</script>

<style scoped>
</style>
