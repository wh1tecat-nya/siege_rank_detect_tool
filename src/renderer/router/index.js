import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: "/",
			name: "Top",
			component: require("@/components/TopPage").default
		},
		{
			path:"/Config",
			name: "Config",
			component: require("@/components/Config").default
		}
	]
})
