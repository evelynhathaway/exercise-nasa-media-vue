import {render, waitFor} from "@testing-library/vue";
import "../../plugins/bootstrap-vue";
import {setRoute} from "../../util/test-utils";
import {nasaApiMock} from "../../../__mocks__/axios";
import MediaTable from "../MediaTable.vue";

const setupHelper = function (...searchParams) {
	// Clear runs on spy
	nasaApiMock.search.mockClear();
	// Generate route
	const $route = setRoute(...searchParams);
	// Render element
	const renderResult = render(MediaTable, {
		mocks: {
			$route,
		},
	});
	return renderResult;
};

const titleHelper = async function (renderResult, query = "", validTypes = ["video", "audio", "image"], page = 1) {
	const {findAllByText} = renderResult;

	// Wait for data to load
	const titleRegex = new RegExp(`^(\\d+)-(${query})-(${validTypes.join("|")})$`);
	const titles = await findAllByText(titleRegex);

	// Found all ten of this type on the page?
	expect(titles.length).toEqual(10);

	// eslint-disable-next-line unicorn/no-for-loop
	for (let index = 0; index < titles.length; index++) {
		const paginatedIndex = index + ((page - 1) * 10);
		const title = titles[index];
		const [, indexFromTitle, queryFromTitle] = titleRegex.exec(title.textContent);
		// Titles must be in order starting from the correct number for the page
		// - Confirms pagination and `items()` is working correctly
		expect(parseInt(indexFromTitle)).toEqual(paginatedIndex);

		// Titles must have the query from the API
		// - Confirms the correct content was queried
		expect(queryFromTitle).toEqual(query);
	}
};


describe("MediaTable", () => {
	describe("Default route", () => {
		let renderResult = null;
		// Clean DOM each time per testing-library's default
		beforeEach(() => {
			renderResult = setupHelper();
		});

		test("has basic metadata", async () => {
			const {findAllByText, getAllByText} = renderResult;

			// Wait for data to load (find), then get data
			const keywords = await findAllByText("Keyword 1, Keyword 2, Keyword 3");
			const descriptions = getAllByText("Omnis debitis in excepturi…", {exact: false});
			const mediaTypes = getAllByText(/^(audio|video|image)$/);

			// Search must've ran after this being rendered
			expect(nasaApiMock.search).toHaveBeenCalledTimes(1);

			// Everything should have keywords, types, and truncated descriptions
			expect(keywords.length).toEqual(10);
			expect(descriptions.length).toEqual(10);
			expect(mediaTypes.length).toEqual(10);
		});

		test("has titles, are in order, matches query, of the correct type", async () => {
			await titleHelper(renderResult);
		});
	});

	describe("Image route with search query", () => {
		let renderResult = null;
		const searchParams = ["test", ["image"]];
		beforeEach(() => {
			renderResult = setupHelper(...searchParams);
		});

		test("has titles, are in order, matches query, of the correct type", async () => {
			await titleHelper(renderResult, ...searchParams);
		});
	});

	describe("Image route with search query and pagination", () => {
		let renderResult = null;
		const searchParams = ["test search", ["image"], 10];
		beforeEach(() => {
			renderResult = setupHelper(...searchParams);

			// Mock window location for pagination
			global.window = Object.create(window);
			Object.defineProperty(window, "location", {
				value: {
					pathname: "/search/test-search/image/10",
					hash: "",
				},
			});
		});

		test("has titles, are in order, matches query, of the correct type", async () => {
			await titleHelper(renderResult, ...searchParams);
		});

		test("can change to next page when more pages need to be queried from the API", async () => {
			const {findByLabelText, findByText} = renderResult;
			await findByText("11");
			await titleHelper(renderResult, ...searchParams);
			const nextLink = await findByLabelText("Go to next page");
			// Wait for data to load (find)
			await waitFor(() => expect(nextLink.pathname).toEqual("/search/test-search/image/11"));
		});
	});
});
