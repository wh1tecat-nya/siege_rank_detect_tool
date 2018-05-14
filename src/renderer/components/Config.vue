<template>
	<div class="uk-section uk-section-small">
		<div class="uk-container">
			<router-link class="uk-icon-button" uk-icon="icon: close; ratio: 2" to="/"></router-link>
			<div class="uk-section uk-section-xsmall">
				<div class="uk-card uk-card-default uk-card-hover">
					<div class="uk-card-header">
						<h3 class="uk-card-title">folderPath</h3>
					</div>
					<div class="uk-card-body">
						<span id="folderPath"></span>
					</div>
					<div class="uk-card-footer">
						<button type="button" class="uk-button uk-button-primary uk-button-small uk-width-1-1" v-on:click="setConfig" id="selectFolder">select folder</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	const { remote, ipcRenderer } = require("electron");
	const { dialog, BrowserWindow } = remote;

	export default {
		name: "Config",
		mounted() {
			if (localStorage.getItem("folderPath") !== null) {
				folderPath.textContent = `${localStorage.getItem("folderPath")}\\`;
				ipcRenderer.send("folderPath", localStorage.getItem("folderPath"));
			}
			console.log("change")
			this.$emit("changeWindowSize", 600, 450);
		},
		methods: {
			setConfig : function() {
				const focusedWindow = BrowserWindow.getFocusedWindow();
				dialog.showOpenDialog(focusedWindow, {
					properties: ["openDirectory"]
				}, (directory) => {
					localStorage.setItem("folderPath", directory[0]);
					folderPath.textContent = `${localStorage.getItem("folderPath")}\\`;
					ipcRenderer.send("folderPath", localStorage.getItem("folderPath"));
				});
			}
		}
	}
</script>