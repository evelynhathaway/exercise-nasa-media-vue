<template>
	<div class="search-root">
		<b-form @submit="onSubmit">
			<b-form-group
				id="input-group-query"
				label="Search"
				label-for="input-query"
				description="Search the NASA Media API"
			>
				<b-form-input
					id="input-query"
					v-model="formQuery"
					type="text"
				></b-form-input>
			</b-form-group>

			<b-form-group
				label="Media Types"
				label-for="checkbox-group-media-types"
				id="input-group-media-types"
			>
				<b-form-checkbox-group
					v-model="formMediaTypes"
					id="checkbox-group-media-types"
					:state="mediaTypeSelected"
				>
					<b-form-checkbox value="image">Image</b-form-checkbox>
					<b-form-checkbox value="video">Video</b-form-checkbox>
					<b-form-checkbox value="audio">Audio</b-form-checkbox>
				</b-form-checkbox-group>
				<b-form-invalid-feedback :state="mediaTypeSelected">
					Please select a media type to include.
				</b-form-invalid-feedback>
			</b-form-group>

			<b-button type="submit" variant="primary" :disabled="!mediaTypeSelected">Search</b-button>
		</b-form>
	</div>
</template>

<script>
import searchParamsMixin from "../mixins/search-params";

export default {
	name: "SearchInput",
	mixins: [searchParamsMixin],
	data() {
		return {
			// Data from form, used in setters from v-model
			formData: {
				query: null,
				mediaTypes: null,
			},
		};
	},
	computed: {
		// Ensure at least one type is selected
		mediaTypeSelected() {
			return !!(this.formMediaTypes && this.formMediaTypes.length);
		},
		// Two-way data flow with the form, defaults to the route
		// - Not possible to watch the route props (e.g. `this.query`) for use in the model
		// - I can't wait for Vue.js v3's Proxy support
		formQuery: {
			get () {
				const needsHydrating = this.formData.query === null;
				return needsHydrating ? this.query : this.formData.query;
			},
			set (value) {this.formData.query = value;},
		},
		formMediaTypes: {
			get () {
				const needsHydrating = this.formData.mediaTypes === null;
				return needsHydrating ? this.mediaTypes : this.formData.mediaTypes;
			},
			set (value) {this.formData.mediaTypes = value;},
		},
	},
	methods: {
		onSubmit(event) {
			event.preventDefault();

			// Change route if not already there
			const nextUrl = this.linkGen({
				query: this.formQuery,
				mediaTypes: this.formMediaTypes,
				page: 1,
			});
			if (nextUrl !== window.location.pathname) {
				this.$router.push(nextUrl);
			}
		},
	},
};
</script>

<style scoped>
.search-root {
	margin: 12px;
}
</style>
