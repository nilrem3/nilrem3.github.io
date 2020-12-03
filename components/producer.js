Vue.component('producerdisplay', {
	props: {
		producer: producer
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
	`<div class="producerdisplay">
		<span class="displaytext">Producer {{producer.tier}}: {{format(producer.amount)}}</span>
		<button @click="producer.buy()">{{producer.buttontext}}</button>
		<span class="displaytext"> +{{format(producer.productionPerSecond)}} Number/s</span>
	</div>`
})