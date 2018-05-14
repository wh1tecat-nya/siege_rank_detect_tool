<template>
	<div class="uk-section uk-section-small uk-section-secondary">
		<div class="uk-container">
			<router-link class="uk-icon-button" uk-icon="icon: cog; ratio: 2" to="/config"></router-link>
		</div>
		<UserList :user-data="userData" ></UserList>
		<UserInfo></UserInfo>
	</div>
</template>

<script>
	const { remote, ipcRenderer } = require("electron");
	const { dialog, BrowserWindow } = remote;

	import UserList from "./modules/UserList.vue"
	import UserInfo from "./modules/UserInfo.vue"
	export default {
		name: "TopPage",
		components: {
			UserList,
			UserInfo
		},
		props: ["userData"],
		mounted() {
			this.$emit("changeWindowSize", 600, 800);
		},
	}
</script>
