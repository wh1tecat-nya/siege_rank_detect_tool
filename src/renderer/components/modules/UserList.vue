<template>
	<div class="uk-container">
		<table class="uk-table uk-table-hover uk-table-middle uk-table-divider">
			<thead>
				<tr>
					<th>Name</th>
					<th>Rank</th>
					<th>W/L</th>
					<th>K/D</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(user, key, index) in userData" :key="index">
					<td>{{user.name}}</td>
					<td>{{add1(user.ranks.apac.rank)}}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	name:"UserList",
	props: ["userData"],
	data() {
		return {
			userdata: this.userData
		}
	},
	methods: {
		add1: function(val) {
			return val+1;
		}
	}
}
</script>
