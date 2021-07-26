class producer {
	constructor(basecost, baseproduction, numericpointvalue, multiplier, tier){
		this.basecost = basecost;
		this.baseproduction = baseproduction;
		this.numericpointvalue = numericpointvalue;
		this.amount = new Decimal(0);
		this.bought = new Decimal(0);
		this._maxnum = new Decimal(10);
		this.multiplier = multiplier;
		this.tier = tier;
	}
	get canBuy() {
		if(player.overload.challenges[7].active || player.overload.challenges[9].active){
			return false;
		}
		if(this.amount.gte(this.maxnum)) return false;
		else return this.cost.lte(player.number);
	}
	get cost(){
		return new Decimal(Decimal.mul(this.basecost, Decimal.pow(this.scaling, this.bought)));
	}
	get scaling(){
		return new Decimal(1).plus(this.tier).pow(0.25);//this should make producers and multipliers cost the same at 6/24. need to rebalance other things accordingly
	}
	buy(num){
		num = Decimal.floor(num);
		if(!this.canBuy){
			return;
		}
		if(this.numaffordable.lt(num)){
			this.buy(this.numaffordable);
		}else{
			player.number = player.number.sub(this.cost.mul(new Decimal(1).sub(this.scaling).pow(num)).div(new Decimal(1).sub(this.scaling)));
			this.amount = this.amount.plus(num);
			this.bought = this.bought.plus(num);
		}
	}
	
	get production(){
		num = this.baseproduction.mul(this.multiplier.value);
		num = Decimal.mul(Decimal.pow(2, player.sacrifice.repeatablenumbermultupgrade.amount), num);
		num = Decimal.mul(player.achievementshandler.achievementBonus("number from producers", true), num);
		num = Decimal.mul(player.achievementshandler.achievementBonus("number", true), num);
		num = Decimal.mul(player.sacrifice.factorshandler.factors[0].bonus, num);
		if(player.overload.overloadupgradetable.columns[2][2].bought){
			num = num.mul(Decimal.log(player.sacrifice.factorshandler.factorjuice.plus(20), 20));
		}
		if(player.overload.overloadupgradetable.columns[0][2].bought){
			num = num.mul(Decimal.log(player.sacrifice.numericpoints.plus(10), 10));
		}
		if(player.overload.overloadupgradetable.columns[0][3].bought){
			if(player.overload.overloadPoints.lte(10)){
				num = num.mul(player.overload.overloadPoints.plus(1));
			}else{
				num = num.mul(Decimal.pow(player.overload.overloadPoints.minus(10), 0.3).plus(11));
			}
		}
		if(player.overload.overloadupgradetable.columns[1][2].bought){
			if(player.tier.lte(2)){
				num = num.mul(10);
			}
		}
		if(player.overload.milestones[0].unlocked){
			num = num.mul(1.5);
		}
		if(player.overload.challenges[0].active || player.overload.challenges[9].active){
			return new Decimal(0);
		}
		if(player.chargers[this.tier - 1] != undefined){
			num = num.mul(player.chargers[this.tier - 1].mult);
		}
		return num;
	}
	get productionPerSecond(){
		return Decimal.mul(this.production, this.amount);
	}
	get buttontext(){
		if(this.amount.lt(this.maxnum)) return "Buy 1: " + format(this.cost);
		return "MAX";
	}
	get numericpointsonsacrifice(){
		if(player.overload.challenges[8].active || player.overload.challenges[9].active){
			return new Decimal(0);
		}
		var points = Decimal.mul(this.amount, this.numericpointvalue);
		if(player.overload.overloadupgradetable.columns[2][0].bought){
			points = points.mul(Decimal.pow(this.multiplier.value, 0.33));
		}
		return points;
	}
	get maxnum(){
		if(player.overload.challenges[4].active || player.overload.challenges[9].active){
			return new Decimal(0);
		}
		num = this._maxnum;
		if(!player.sacrifice.maxproducerupgrades.length < this.tier){
			num = num.plus(player.sacrifice.maxproducerupgrades[this.tier - 1].amount);
		}
		num = num.plus(player.achievementshandler.achievementBonus("maximum producers", false));
		return num;
	}
	get numaffordable(){
		if(this.canBuy == false){
			return new Decimal(0);
		}
		var num =  Decimal.floor(Decimal.log((new Decimal(-1).mul((new Decimal(1).sub(new Decimal(1).plus(new Decimal(0.2).mul(this.tier))).div(this.cost))).mul(player.number)).plus(1), new Decimal(1).plus(new Decimal(0.2).mul(this.tier))));
		if(num.gt(new Decimal(this.maxnum - this.amount))){
			return new Decimal(this.maxnum - this.amount);
		}else{
			return num;
		}
	}		
}

function createProducer(tier, multiplier){
	return new producer(Decimal.pow(10, tier), Decimal.pow(5, tier - 1), Decimal.pow(2, tier - 1), multiplier, tier);
}


