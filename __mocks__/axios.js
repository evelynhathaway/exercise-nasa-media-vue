export const nasaApiMock = {
	item(number, query, mediaType) {
		const id = `${number}-${query}-${mediaType}`;
		const item = {
			"href": `/${mediaType}/${id}/collection.json`,
			"data": [
				{
					"title": id,
					"date_created": "2011-03-23T00:00:00Z",
					"center": "Center",
					"keywords": [
						"Keyword 1",
						"Keyword 2",
						"Keyword 3",
					],
					"description": "Nostrum illum sit eligendi aspernatur nobis. Laboriosam maiores dolorem. Dolorum voluptatem rerum nemo dolor dolorem est sint ab et. Omnis debitis in excepturi ut vel explicabo. Omnis cupiditate ut ipsam dolor aut sit in accusamus officia. Quaerat et non ducimus in dolore ut deserunt.",
					"nasa_id": id,
					"media_type": mediaType,
				},
			],
		};
		item.links = mediaType === "audio" ? undefined : [
			{
				"href": `/${mediaType}/${id}/${id}~thumb.jpg`,
				"render": "image",
				"rel": "preview",
			},
		];
		return item;
	},

	search: jest.fn().mockImplementation(async function ({q: query = "", media_type: mediaType = ["video", "audio", "image"], page = 1}) {
		// Response Object structure
		const response = {data: {collection: {}}};
		response.data.collection.items = [];

		// Mock items in the collection
		for (let index = 0; index < 100; index++) {
			const paginatedIndex = index + ((page - 1) * 100);
			const alternatedMediaType = mediaType[index % mediaType.length];
			response.data.collection.items.push(
				this.item(paginatedIndex, query, alternatedMediaType)
			);
		}

		return response;
	}),

	asset: jest.fn().mockImplementation(async function () {
		throw new Error("Asset isn't mocked because it's not a used API and the time of writing.");
	}),
};

export const axiosNasaApiMock = function (url, params) {
	if (url.match(/^\/asset/)) {
		return nasaApiMock.asset();
	} else if (url.match(/^\/search/)) {
		return nasaApiMock.search(params);
	} else {
		throw new Error(`Mock the API call you are calling.\n${url}`);
	}
};

const axios = function () {};
// Mock instance of axios
axios.create = function (options) {
	if (options.baseURL === "https://images-api.nasa.gov") {
		return axiosNasaApiMock;
	}
};

export default axios;
