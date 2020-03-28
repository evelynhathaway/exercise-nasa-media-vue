import axios from "axios";

const axiosBase = axios.create({
	baseURL: "https://images-api.nasa.gov",
});

export const getLink = function (links, rel) {
	return links.find(link => link.rel === rel)?.href;
};

export const asset = async function (id) {
	const response = await axiosBase(`/asset/${id}`);
	const collectionItems = response.data.collection.items;
	// Convert to a Map of `href` type keys and URI values
	// - Example key-value pair: ["orig": "[...]/filename~orig.jpg"]
	const mediaMap = new Map(
		collectionItems.map(({href}) => [href.replace(/~([^.]+)\./, "$1"), href])
	);
	return mediaMap;
};

export const mediaProps = async function (item) {
	return {
		// Create media object for templating images, video, and audio
		media: {
			previewHref: item.links && getLink(item.links, "preview"),
			// This API could be easily used to open each original media in another view if implemented
			// Image: `<picture>` tag with sources and `<img>` fallback
			// Video: `<video>` tag with sources and captions
			// Audio: `<audio>` tag
			async getHrefs () {
				return await asset(item.data[0].nasa_id);
			},
		},
		// Spread in metadata for table
		...item.data[0],
	};
};

export const search = async function (params) {
	const response = await axiosBase("/search", {params});
	const {data} = response;

	return {
		items: await Promise.all(
			data.collection.items.map(mediaProps)
		),
	};
};
