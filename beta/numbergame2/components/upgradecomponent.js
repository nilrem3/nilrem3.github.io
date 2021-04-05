Vue.component("upgradecomponent", {
	props: ["upgrade"],
	methods: {
		format(amount){
			return format(amount);
		}
	},
	template: `
	<div :class="upgrade.getClass()"><button v-on:click="upgrade.selectupgrade()">{{ upgrade.name }}</button></div>
	`
});