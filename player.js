var player = {
	number: new Decimal(0),
	totalnumberproduced: new Decimal(0),
	producers: [],
	tier: 0,
	highesttier: 0,
	maxtier: 5,
	clicks: 0,
	multipliers: [],
	lastupdate: Date.now(),
	sacrifice: sacrifice,
	achievementshandler: achievementshandler,
	statistics: statistics,
	get numberperclick(){
		num =  (new Decimal(1)).times(Decimal.pow(2, sacrifice.repeatableclickupgrade.amount));
		num = Decimal.mul(num, this.achievementshandler.clickPowerMult);
		num = Decimal.mul(num, this.achievementshandler.globalNumberMult);
		return num;
	},
	get tierUpCost(){
		return Decimal.mul(Decimal.pow(new Decimal(20), new Decimal(this.tier)), new Decimal(10));
	},
	get canTierUp(){
		if(this.number.greaterThanOrEqualTo(this.tierUpCost) && this.tier < this.maxtier){
			return true;
		}else{
			return false;
		}
	},
	get formattednumber(){
		return format(this.number);
	},
	tierUp(){
		if(this.canTierUp)
		{
			this.tier += 1;
			if(this.tier > this.highesttier){
				this.highesttier = this.tier;
				sacrifice.addmaxupgrades(this.highesttier);
			}
			this.resetEverythingTierUpDoes();
		}
		
	},
	resetEverythingTierUpDoes(){
		this.number = new Decimal(0);
		//starting number
		this.number = this.number.plus(new Decimal(5).times(sacrifice.repeatablestartingnumberupgrade.amount))
		this.number = this.number.plus(this.achievementshandler.startingNumberBonus);
		//set up producers and multipliers
		this.producers = [];
		this.multipliers = [];
		var i;
		for(i = 0; i < this.tier; i++){
			this.multipliers.push(createMultiplier(i + 1));
			this.producers.push(createProducer(i + 1, this.multipliers[i]));
		}
	},
	get tierUpbuttontext(){
		if(this.tier < this.maxtier){
			return "Tier Up to gain a new Producer! Cost: " + format(player.tierUpCost);
		}else{
			return "Cannot Tier up past " + player.maxtier + ". (yet!)";
		}	
	},
	get numberPerSecond(){
		ret = new Decimal(0);
		for(var i = 0; i < this.producers.length; i++){
			ret = Decimal.plus(this.producers[i].productionPerSecond, ret);
		}
		ret = ret.mul(player.achievementshandler.globalNumberMult);
		return ret;
	}
	
}