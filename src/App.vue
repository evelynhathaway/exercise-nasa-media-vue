<template>
  <div id="app">
    <MediaTable/>
  </div>
</template>

<script>
import MediaTable from './components/MediaTable.vue'
export default {
  name: 'App',
  components: {
    MediaTable
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.hidden {
  display: none;
}
</style>
