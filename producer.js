class producer {
	constructor(basecost, baseproduction, numericpointvalue, multiplier, tier){
		this.basecost = basecost;
		this.baseproduction = baseproduction;
		this.numericpointvalue = numericpointvalue;
		this.amount = 0;
		this.bought = 0;
		this._maxnum = 10;
		this.multiplier = multiplier;
		this.tier = tier;
	}
	get canBuy() {
		if(this.amount >= this.maxnum) return false;
		else return this.cost.lte(player.number);
	}
	get cost(){
		return new Decimal(Decimal.mul(this.basecost, Decimal.pow(1 + (0.2 * this.tier), this.bought)));
	}
	buy(){
		if(!this.canBuy){
			return;
		}
		player.number -= this.cost;
		this.amount += 1;
		this.bought += 1;
	}
	
	get production(){
		num = this.baseproduction * this.multiplier.value;
		num = Decimal.mul(Decimal.pow(1.2, player.sacrifice.repeatablenumbermultupgrade.amount), num);
		return num;
	}
	get productionPerSecond(){
		return Decimal.mul(this.production, this.amount);
	}
	get buttontext(){
		if(this.amount < this.maxnum) return "Buy 1: " + format(this.cost);
		return "MAX";
	}
	get numericpointsonsacrifice(){
		return Decimal.mul(this.amount, this.numericpointvalue);
	}
	get maxnum(){
		num = this._maxnum;
		if(!player.sacrifice.maxproducerupgrades.length < this.tier){
			num += player.sacrifice.maxproducerupgrades[this.tier - 1].amount;
		}
		num += player.achievementshandler.globalMaximumProducerBonus;
		return num;
	}
}

function createProducer(tier, multiplier){
	return new producer(Decimal.pow(10, tier), Decimal.pow(5, tier - 1), Decimal.pow(2, tier - 1), multiplier, tier);
}


