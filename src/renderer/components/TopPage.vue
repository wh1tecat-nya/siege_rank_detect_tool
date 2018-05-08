<template>
	<div id="main" class="uk-section uk-section-secondary  uk-section-small">
		<div class="uk-container">
			<router-link class="uk-icon-button" uk-icon="icon: cog; ratio: 2" to="/config"></router-link>
		</div>
		<UserInfo></UserInfo>
	</div>
</template>

<script>
	const { remote, ipcRenderer } = require("electron");
	const { dialog, BrowserWindow } = remote;

	import UserInfo from "./modules/UserInfo.vue"
	export default {
		components: {
			UserInfo
		}
	}
</script>
