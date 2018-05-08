<template>
	<div id="app" class="uk-background-secondary">
		<router-view></router-view>
	</div>
</template>


<script>
	const { remote, ipcRenderer } = require("electron");
	const { dialog, BrowserWindow } = remote;

	export default {
		name: "siege_rank_detect_tool",
		mounted() {
			this.setEvent();
			if (localStorage.getItem("folderPath") !== null) {
				ipcRenderer.send("folderPath", localStorage.getItem("folderPath"));
			}
		},
		methods: {
			setEvent : () =>  {
				ipcRenderer.on("namedata", (event, arg) => {
					arg.forEach((value) => {
						fetch(`https://r6db.com/api/v2/players?name=${value}&platform=PC`, { headers: { "X-App-Id": "8719e50f-817c-483d-af53-0d185fd8d3cf" } })
							.then((response) => {
								return response.json();
							})
							.then((json) => {
								console.log(json[0]);
							});
					});
				})
			}
		}
	}
</script>
