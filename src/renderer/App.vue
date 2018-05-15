<template>
	<div id="app">
		<router-view :search-user-data="searchUserData" :has-data="hasData" @changeWindowSize="changeWindowSize"></router-view>
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
		data() {
			return {
				searchUserData: [],
				hasData: false
			}
		},
		methods: {
			setEvent : async function() {
				ipcRenderer.on("namedata", async (event, arg) => {
					this.searchUserData = [];
					for (let i=0; i<arg.length; i++) {
						const value = arg[i];
						this.$set(this.searchUserData, i, { index:i, searchParam:value });
						console.log(value);
						await this.searchUserInfo(value)
							.then((json) => {
								this.$set(this.searchUserData[i], "searchData", json[0]);
								this.$set(this.searchUserData[i], "iconUrl", `https://ubisoft-avatars.akamaized.net/${this.searchUserData[i].searchData.id}/default_146_146.png`);
								return this.searchUserData[i].searchData.id;
							})
							.then(this.getUserData)
							.then((json) => {
								this.$set(this.searchUserData[i], "userData", json);
							});
						let check = setInterval(() => {
							let cnt = 0;
							console.log("keep find");
							for(let value of this.searchUserData) {
								if (value.userData === undefined) {
									cnt += 1;
								}
							}
							if (cnt === 0) {
								clearInterval(check);
								this.hasData = true;
							}
						}, 500);
					}
				})
			},
			searchUserInfo: function(userName) {
				return new Promise((resolve, reject) => {
					fetch(`https://r6db.com/api/v2/players?name=${userName}&platform=PC`, { headers: { "X-App-Id": "8719e50f-817c-483d-af53-0d185fd8d3cf" } })
						.then((response) => {
							return response.json();
						})
						.then((json) => {
							resolve(json);
						});
				})
			},
			getUserData: function(userId) {
				return new Promise((resolve, reject) => {
					fetch(`https://r6db.com/api/v2/players/${userId}`, { headers: { "X-App-Id": "8719e50f-817c-483d-af53-0d185fd8d3cf" } })
						.then((response) => {
							return response.json();
						})
						.then((json) => {
							resolve(json);
						});
				})
			},
			changeWindowSize: function(width, height) {
				console.log(width, height);
				remote.getCurrentWindow().setSize(width, height);
			}
		}
	}
</script>
