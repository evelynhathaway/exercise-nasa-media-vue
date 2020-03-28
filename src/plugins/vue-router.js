import Vue from "vue";
import VueRouter from "vue-router";
import MediaTable from '../components/MediaTable.vue'

const paramsRoute = `/:mediaTypes([a-zA-Z-]+)?/:page(\\d+)?`
export const router = new VueRouter({
	mode: "history", // HTML5 History Mode, TODO: remember to adjust server config
	routes: [
		{
			path: paramsRoute,
			component: MediaTable,
		},
		{
			path: `/search/:query${paramsRoute}`,
			component: MediaTable,
		},
	],
});

Vue.use(VueRouter);
