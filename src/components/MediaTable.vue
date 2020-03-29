<template>
	<div class="mediatable-root">
		<b-table
			striped
			responsive
			:items="items"
			:fields="fields"
			class="table"
		>
			<template v-slot:cell(description)="row">
				<span :title="row.value">{{truncate(row.value, 150)}}</span>
			</template>
			<template v-slot:cell(keywords)="row">
				{{row.value ? row.value.join(", ") : "None"}}
			</template>
			<template v-slot:cell(media)="row">
				<Preview
					:preview-href="row.value.previewHref"
					:media-type="row.item.media_type"
					:title="row.item.title"
				/>
			</template>
		</b-table>

		<b-pagination-nav
			aria-controls="table"
			first-number
			use-router
			align="center"
			limit="7"
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
		lastCachedPage() {
			let totalPages = 0;
			// `cachedItems` may be `undefined` as an initial call result, safegaurd as zero, the for loop won't run
			const numberOfPages = this.cachedItems.length || 0;
			// Because our first index is always empty, ignore it by starting index at `1`
			// - This is because API pages start at `1` and I am trying to be consistent
			for (let pageIndex = 1; pageIndex < numberOfPages; pageIndex++) {
				const thisPage = this.cachedItems[pageIndex];
				// if `thisPage` is `undefined`, it means we haven't cached it yet. As a result, we assume it's the amount of pages on a server page
				totalPages += (thisPage ? thisPage.length / this.itemsPerPage : this.pagesPerServerPage);
			}
			return totalPages;
		},
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
			if (items.length) {
				Vue.set(this.cachedItems, page, items);
			}
		},
		async changePage() {
			await this.search();
			// Grab items for upcoming pages from the server
			// - This isn't exactly preloading, it's partially to populate the pagination max pages
			if ((this.page - 1) % this.pagesPerServerPage >= 7) {
				this.search(1);
			}
		},
		changeSearch() {
			this.cachedItems = [];
			this.changePage();
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
		query() {
			this.changeSearch();
		},
		mediaTypes() {
			this.changeSearch();
		},
		page() {
			this.changePage();
		},
	},
};
</script>

<style scoped>
.table >>> th:not(:first-child) {
	min-width: 12em;
}
</style>
