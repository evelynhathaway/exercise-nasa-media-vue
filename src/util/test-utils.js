export const setRoute = function (query = "", mediaTypes = ["video", "audio", "image"], page = 1) {
	let path = "";
	if (query) path += `/search/${query}`;
	if (mediaTypes.length > 0 && mediaTypes.length < 3) {
		mediaTypes = mediaTypes.join("-");
		path += `/${mediaTypes}`;
	} else {
		mediaTypes = undefined;
	}
	if (page > 1) {
		page = page.toString();
		path += `/${page}`;
	} else {
		page = undefined;
	}

	return {
		path,
		fullPath: path,
		query: {},
		params: {
			mediaTypes,
			page,
			query,
		},
	};
};
