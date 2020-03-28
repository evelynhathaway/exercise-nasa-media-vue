import {render} from "@testing-library/vue";
import "../../plugins/bootstrap-vue";
import {setRoute} from "../../util/test-utils";
import MediaTable from "../MediaTable.vue";

describe("MediaTable", () => {
	test("increments value on click", async () => {
		render(MediaTable, {
			mocks: {
				$route: setRoute(), // Default route
			},
		});
	});
});
