import {render} from "@testing-library/vue";
import "../../plugins/bootstrap-vue";
import {setRoute} from "../../util/test-utils";
import {nasaApiMock} from "../../../__mocks__/axios";
import MediaTable from "../MediaTable.vue";


describe("MediaTable", () => {
	describe("Default route", () => {
		let renderResult = null;
		beforeAll(()=> {
			renderResult = render(MediaTable, {
				mocks: {
					$route: setRoute(),
				},
			});
		});
		test("has basic metadata", async () => {
			const {findAllByText, getAllByText} = renderResult;

			// Wait for data to load (find), then get data
			const keywords = await findAllByText("Keyword 1, Keyword 2, Keyword 3");
			const descriptions = getAllByText("Omnis debitis in excepturi…", {exact: false});
			const mediaTypes = getAllByText(/^(audio|video|image)$/);

			// Search must've ran after this being rendered
			expect(nasaApiMock.search).toHaveBeenCalledTimes(1);

			// Everything should have keywords and truncated descriptions (all the same)
			expect(keywords.length).toEqual(10);
			expect(descriptions.length).toEqual(10);
			expect(mediaTypes.length).toEqual(10);
		});
	});
});
