<template>
	<div class="uk-section uk-padding-remove-vertical uk-section-secondary">
		<div class="uk-container">
			<table class="uk-table uk-table-hover uk-table-middle uk-table-divider">
				<thead>
					<tr>
						<th></th>
						<th>Name</th>
						<th>Rank</th>
						<th>W/L</th>
						<th>K/D</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="!hasData" v-for="n in 5" @click="openUserInfo('dummy')" >
						<td></td>
						<td>{{dummyData.name}}</td>
						<td><img class="uk-preserve-width uk-border-circle" :src="getRankIcon(dummyData.rank)" width="40" ></td>
						<td>{{dummyData.wlRate}}</td>
						<td>{{dummyData.kdRate}}</td>
					</tr>
					<tr v-if="hasData" v-for="(data, key, index) in searchUserData" :key="index" @click="openUserInfo(data)" >
						<td><img class="uk-preserve-width uk-border-circle" :src="`https://ubisoft-avatars.akamaized.net/${data.searchData.id}/default_146_146.png`" width="35" ></td>
						<td>{{data.searchData.name}}</td>
						<td><img class="uk-preserve-width uk-border-circle" :src="getRankIcon(data.searchData.ranks.apac.rank)" width="40" ></td>
						<td>{{(data.userData.stats.ranked.won/data.userData.stats.ranked.lost).toFixed(2)}}</td>
						<td>{{(data.userData.stats.ranked.kills/data.userData.stats.ranked.deaths).toFixed(2)}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

</template>

<script>
export default {
	name:"UserList",
	props: ["searchUserData", "hasData"],
	data() {
		return {
			dummyData: {
				name: "dummy Man",
				rank: 0,
				wlRate: 0,
				kdRate: 0
			}
		}
	},
	methods: {
		getRankIcon: function(rank) {
			return `static/img/ranks/${rank}.svg`;
		},
		openUserInfo: function(e) {
			if (e !== "dummy") {
				this.$emit("setUserIndex", e.index);
			} else {
				this.$emit("setUserIndex", 6);
			}
		}
	}
}
</script>
