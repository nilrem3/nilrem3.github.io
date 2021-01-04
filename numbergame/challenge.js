class challenge {
	constructor(description, requirementtype, requirement, reward){//requirement is a function
		this.description = description;
		this.requirementtype = requirementtype;
		this._requirement = requirement;
		this._completions = new Decimal(0);
		this.active = false;
		this.reward = reward;
		this.bestcompletions = new Decimal(0);
	}
	get requirement(){
		return this._requirement(this.completions);
	}
	setactive(){
		player.overload.resetEverythingOverloadDoes();
		this.active = true;
	}
	get htmlclass(){
		if(this.active == true){
			return "displaytext challengedisplay activechallenge";
		}else{
			return "displaytext challengedisplay";
		}
	}
	get iscomplete(){
		if(this.requirementtype == "Number"){
			return player.number.gte(this.requirement);
		}
		if(this.requirementtype == "NP"){
			return player.sacrifice.numericpoints.gte(this.requirement);
		}
		return false;
	}
	set completions(completions){
		this._completions = completions;
		if(this._completions.gte(this.bestcompletions)){
			this.bestcompletions = this._completions;
		}
	}
	get completions(){
		return this._completions;
	}
}

Vue.component('challengedisplay', {
	props: {
		challenge: challenge
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
	`<div :class="challenge.htmlclass" @click="challenge.setactive()">
	<p>{{challenge.description}}</p>
	<p>Completions: {{challenge.completions.toString()}}</p>
	<p>Goal: {{format(challenge.requirement)}} {{challenge.requirementtype}}</p>
	<p>{{challenge.reward}}</p>
	</div>`
});