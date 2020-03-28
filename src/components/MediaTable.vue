<template>
  <div id="mediatable-root">
    <b-table
      striped
      :items="items"
      :fields="fields"
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

    <b-pagination-nav
        aria-controls="table"
        first-number
        use-router
        :link-gen="linkGenPage"
        :number-of-pages="lastCachedPage || 1"
        prev-text="Prev"
        next-text="Next"
        last-class="hidden"
      ></b-pagination-nav>
  </div>
</template>

<script>
import Vue from "vue";
import {search} from "../util/nasa-api";
import {truncate} from "../util/truncate";
import Preview from "./Preview.vue";
import searchParamsMixin from "../mixins/search-params";

export default {
	name: "MediaTable",
	mixins: [searchParamsMixin],
	components: {
		Preview,
	},
	data() {
		return {
			// Cached items from the server, since there isn't an option to paginate by a certain amount on the API
			cachedItems: [],
			// Table columns
			fields: [
				{
					key: "media",
					label: "Preview",
				},
				"title",
				"description",
				"keywords",
				{
					key: "media_type",
					label: "Type",
				},
			],
			pagesPerServerPage: 10,
			itemsPerPage: 10,
		};
	},
	computed: {
		// Items for table element, taken from cached items
		items() {
			const firstIndex = ((this.page - 1) % this.pagesPerServerPage) * this.itemsPerPage;
			const lastIndex = firstIndex + this.itemsPerPage;
			const serverPageCache = this.cachedItems[this.serverPage];
			return serverPageCache ? serverPageCache.slice(firstIndex, lastIndex) : [];
		},
		// The last page cached page
		lastCachedPage() {return this.cachedItems.length * this.pagesPerServerPage;},
		// How many pages through the API the current page is
		serverPage() {return Math.ceil(this.page / this.pagesPerServerPage);},
	},
	methods: {
		async search(serverPageOffset = 0) {
			const page = this.serverPage + serverPageOffset;

			// Early return if cached
			if (this.cachedItems[page]) {
				return;
			}

			const {items} = await search({
				q: this.query,
				media_type: this.mediaTypes.join(","),
				page,
			});

			// Reactive update a deep property of the array
			// - We cannot use reactive property setters for properties determined purely at runtime
			Vue.set(this.cachedItems, page, items);
		},
		updateItems() {

		},
		async changePage() {
			await this.search();
			this.updateItems();
			// Grab items for upcoming pages from the server
			// - This isn't exactly preloading, it's partially to populate the pagination max pages
			if ((this.page - 1) % this.pagesPerServerPage >= 7) {
				this.search(1);
			}
		},
		linkGenPage(newPage) {
			return this.linkGen({page: newPage});
		},
		truncate,
	},
	created() {
		this.changePage();
	},
	watch: {
		page() {
			this.changePage();
		},
	},
};
</script>

<style scoped>
</style>
