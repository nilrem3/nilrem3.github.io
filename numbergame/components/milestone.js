Vue.component('overloadmilestonedisplay', {
	props: {
		overloadmilestone: overloadmilestone
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
	`<div :class="overloadmilestone.htmlclass">
		<div><h2 :class="overloadmilestone.numberhtmlclass">{{overloadmilestone.overloads}}</h2></div>
		<div class="marginleft10">{{overloadmilestone.reward}}</div>
	</div>`
});