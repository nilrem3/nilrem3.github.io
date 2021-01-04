Vue.component('overloadupgradedisplay', {
	props: {
		overloadupgrade: overloadupgrade
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
	`<div :class="overloadupgrade.htmlclass" @click="overloadupgrade.buy(1)">
		<div>
		<p>{{overloadupgrade.description}}:</p>  <p>{{overloadupgrade.cost}} OP</p>
		</div>
	</div>`
});	