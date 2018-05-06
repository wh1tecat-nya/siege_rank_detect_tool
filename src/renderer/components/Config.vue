<template>
	<div class="uk-section uk-section-secondary  uk-section-small">
		<div class="uk-container">
			<router-link class="uk-icon-button" uk-icon="icon: close; ratio: 2" to="/"></router-link>
			<div class="uk-section">
				<input type="button" v-on:click="setConfig" id="selectFolder" value="select folder"><span id="folderPath"></span>
			</div>
		</div>
	</div>
</template>

<script>
	const { remote, ipcRenderer } = require("electron");
	const { dialog, BrowserWindow } = remote;

	export default {
		name: "config",
		mounted() {
			if (localStorage.getItem("folderPath") !== null) {
				folderPath.textContent = localStorage.getItem("folderPath");
				ipcRenderer.send("folderPath", localStorage.getItem("folderPath"));
			}
		},
		methods: {
			setConfig : () => {
				const focusedWindow = BrowserWindow.getFocusedWindow();
				dialog.showOpenDialog(focusedWindow, {
					properties: ["openDirectory"]
				}, (directory) => {
					localStorage.setItem("folderPath", directory[0] + "\\");
					folderPath.textContent = localStorage.getItem("folderPath");
					ipcRenderer.send("folderPath", localStorage.getItem("folderPath"));
				});
			}
		}
	}
</script>