<template>
  <div id="mediatable-root">
    <b-table
      striped
      :items="items"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      id="table"
    >
      <template v-slot:cell(media)="row">
        <Preview :src="row.value.previewHref" :type="row.value.media_type"/>
      </template>
    </b-table>

    <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="table"
        first-number
        prev-text="Prev"
        next-text="Next"
        last-class="hidden"
      ></b-pagination>
  </div>
</template>

<script>
  import {search} from "../util/nasa-api.js"
  import Preview from "./Preview.vue"

  export default {
    name: 'MediaTable',
    components: {
      Preview
    },
    props: {
      search: String
    },
    data() {
      return {
        perPage: 10,
        currentPage: 1,
        items: [],
        fields: [
          {
            key: "media",
            label: "Preview"
          },
          "title"
        ]
      }
    },
    computed: {
      rows() {
        return this.items.length
      }
    },
    methods: {
      async loadInitialLiveItems() {
        // TODO: add next, previous, first to comp
        const {items} = await search()
        this.items = items;
        return items;
      },
    },
    created() {
      this.loadInitialLiveItems()
    }
  }
</script>

<style scoped>
</style>
