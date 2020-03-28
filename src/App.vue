<template>
  <div id="app">
    <SearchInput :query="query" :media-types="mediaTypes" :page="page"></SearchInput>
    <router-view :query="query" :media-types="mediaTypes" :page="page"></router-view>
  </div>
</template>

<script>
  import SearchInput from "./components/SearchInput.vue";

  export default {
    name: 'App',
    components: {
      SearchInput,
    },
    data() {
      const {query, mediaTypes, page} = this.$route.params;
      return {
        query: query && query.replace(/-(?!-)/g, " ") || "",
        mediaTypes: mediaTypes && mediaTypes.toLowerCase().split("-") || ["image", "video"],
        page: parseInt(page) || 1,
      };
    },
  };
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
