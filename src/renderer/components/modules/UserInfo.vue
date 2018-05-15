<template>
	<div class="uk-container">
		<div v-if="showIndex === 6" class="uk-card uk-card-default uk-card-hover">
			<div class="uk-card-header">
				<h3 class="uk-card-title">Dammy Man</h3>
			</div>
			<div class="uk-card-body">
				Not have Rank.
			</div>
			<div class="uk-card-footer">
				
			</div>
		</div>
		<div v-if="showIndex !== 6 && showIndex !== null" class="uk-card uk-card-default uk-card-hover">
			<div class="uk-card-header">
				<div class="uk-grid-small uk-flex-middle" uk-grid>
					<div class="uk-width-auto">
						<img class="uk-preserve-width uk-border-circle" :src="`https://ubisoft-avatars.akamaized.net/${searchUserData[showIndex].searchData.id}/default_146_146.png`" width="35" >
					</div>
					<div class="uk-width-expand">
						<h3 class="uk-card-title uk-margin-remove-bottom">
							{{searchUserData[showIndex].searchData.name}}
						</h3>
						<p class="uk-margin-remove-top">level:{{searchUserData[showIndex].searchData.level}}</p>
					</div>
				</div>
			</div>
			<div class="uk-card-body">
				none
			</div>
			<div class="uk-card-footer">
				
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name:"UserInfo",
	props: ["searchUserData", "showIndex"],
	data () {
		return {
			
		}
	},
	methods: {

	}
}
</script>
