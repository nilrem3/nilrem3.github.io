class overloadupgrade {
	constructor(description, cost, requiredupgrade){
		this.description = description;
		this.cost = cost;
		this.bought = false;
		this.requiredupgrade = requiredupgrade;
	}
	get htmlclass(){
		ret = "overloadupgrade displaytext";
		if(this.bought == true){
			ret += " purchasedoverloadupgrade";
		}else if(this.canbuy){
			ret += " affordableoverloadupgrade";
		}
		return ret;
	}
	buy(){
		if(this.canbuy){
			this.bought = true;
			player.overload.overloadPoints = player.overload.overloadPoints.minus(this.cost);
		}
	}
	get canbuy(){
		if(this.requiredupgrade != null){
			if(this.requiredupgrade.bought == false){
				return false;
			}
		}
		if(player.overload.overloadPoints.gte(this.cost)){
			return true;
		}
		return false;
	}
}

