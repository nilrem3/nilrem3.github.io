class overloadmilestone{
	constructor(overloads, reward){
		this.overloads = overloads;
		this.reward = reward;
		this.unlocked = false;
	}
	get htmlclass(){
		if(this.unlocked){
			return "overloadmilestone displaytext unlockedoverloadmilestone";
		}else{
			return "overloadmilestone displaytext";
		}
	}
	get numberhtmlclass(){
		if(this.unlocked){
			return "displaytext";
		}else{
			return "overloadcoloredtext";
		}
	}
}

