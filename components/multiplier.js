Vue.component('multiplierdisplay', {
	props: {
		multiplier: multiplier
	},
	data: function(){
		return {
			
		}
	},
	methods: {
		format(amount){
			return format(amount);
		}
	},
	template: 
	`<div class="multiplierdisplay">
		<span class="displaytext">Multiplier {{multiplier.tier}}: x{{format(multiplier.value)}}</span>
		<button @click="multiplier.buy()">{{multiplier.buttontext}}</button>
	</div>`
})