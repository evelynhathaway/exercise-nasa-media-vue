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
      <template v-slot:cell(description)="row">
        <span :title="row.value">{{truncate(row.value, 150)}}</span>
      </template>
      <template v-slot:cell(keywords)="row">
        {{row.value ? row.value.join(", ") : "None"}}
      </template>
      <template v-slot:cell(media)="row">
        <Preview :preview-href="row.value.previewHref" :media-type="row.item.media_type"/>
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
  import {truncate} from "../util/truncate.js"
  import Preview from "./Preview.vue"

  export default {
    name: 'MediaTable',
    components: {
      Preview
    },
    props: {
      query: String,
      mediaTypes: Array,
      page: Number,
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
          "title",
          "description",
          "keywords",
          {
            key: "media_type",
            label: "Type",
          },
        ],
      }
    },
    computed: {
      rows() {
        return this.items.length
      }
    },
    methods: {
      async search() {
        // TODO: add next, previous, first to comp
        const {items} = await search({
          q: this.query,
          media_type: this.mediaTypes.join(","),
          page: this.page,
        });

        this.items = items;
        return items;
      },
      previousPage() {

      },
      nextPage() {

      },
      truncate,
    },
    created() {
      this.search()
    }
  }
</script>

<style scoped>
</style>
