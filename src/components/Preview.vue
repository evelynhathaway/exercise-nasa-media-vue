<template>
  <div class="preview-root">
    <img :src="mediaType === 'audio' ? require('../assets/audio-thumb.png') : previewHref"/>
  </div>
</template>

<script>
  export default {
    name: 'Preview',
    props: {
      previewHref: String,
      mediaType: String
    }
  }
</script>

<style scoped>
</style>
