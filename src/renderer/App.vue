<template>
	<div id="app">
		<router-view :userdata="userdata" @changeWindowSize="changeWindowSize"></router-view>
	</div>
</template>


<script>
	const { remote, ipcRenderer } = require("electron");
	const { dialog, BrowserWindow } = remote;

	export default {
		name: "siege_rank_detect_tool",
		mounted() {
			this.setEvent();
			let self = this;
			if (localStorage.getItem("folderPath") !== null) {
				ipcRenderer.send("folderPath", localStorage.getItem("folderPath"));
			}
		},
		data() {
			return {
				userdata: []
			}
		},
		methods: {
			setEvent : () =>  {
				ipcRenderer.on("namedata", (event, arg) => {
					self.userdata = [];
					arg.forEach((value) => {
						fetch(`https://r6db.com/api/v2/players?name=${value}&platform=PC`, { headers: { "X-App-Id": "8719e50f-817c-483d-af53-0d185fd8d3cf" } })
							.then((response) => {
								return response.json();
							})
							.then((json) => {
								self.userdata.push(json[0]);
								console.log(self.userdata);
							});
					});
				})
			},
			changeWindowSize: (width, height) => {
				console.log(width, height);
				remote.getCurrentWindow().setSize(width, height);
			}
		}
	}
</script>
