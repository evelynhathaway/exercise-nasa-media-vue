<template>
	<div class="preview-root">
		<img
			class="image"
			width="300"
			:src="mediaType === 'audio' ? require('../assets/audio-thumb.png') : previewHref"
			:alt="title"
		/>
	</div>
</template>

<script>
export default {
	name: "Preview",
	props: {
		previewHref: String,
		mediaType: String,
		title: String,
	},
};
</script>

<style scoped>
.image {
	max-width: 300px;
}
</style>
