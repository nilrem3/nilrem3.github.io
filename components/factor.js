Vue.component('factordisplay', {
	props: {
		factor: factor
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
	`<div :class="factor.htmlClass">
		<button @click="factor.buy()" class="factorcolored">{{factor.buttontext}}</button>
		<div class="displaytext">
		{{factor.description}} (x{{format(factor.bonusfrom1factorizer)}} per factorizer, currently x{{format(factor.bonus)}})
		</div>
	</div>`
});