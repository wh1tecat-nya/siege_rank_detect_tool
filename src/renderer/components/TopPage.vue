<template>
	<div class="uk-section uk-section-small">
		<div class="uk-container">
			<router-link class="uk-icon-button" uk-icon="icon: cog; ratio: 2" to="/config"></router-link>
		</div>
		<UserList :search-user-data="searchUserData" :has-data="hasData" @setUserIndex="setUserIndex" ></UserList>
		<UserInfo :search-user-data="searchUserData" :show-index="showIndex" ></UserInfo>
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
		props: ["searchUserData", "hasData"],
		mounted() {
			this.$emit("changeWindowSize", 600, 850);
		},
		data () {
			return {
				showIndex: null
			}
		},
		methods :{
			setUserIndex: function(index) {
				this.showIndex = index;
			}
		}
	}
</script>
