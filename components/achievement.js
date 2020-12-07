Vue.component('achievementdisplay', {
	props: {
		achievement: achievement
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
	template: `<div :class="achievement.class">
			<h2>{{achievement.name}}</h2>
			{{achievement.description}}<br>
			{{achievement.reward}}
		</div>`
		
		
	
});