class multiplier{
	constructor(basecost, scaling, tier){
		this.basecost = basecost;
		this.scaling = scaling;
		this._maxnum = 3;
		this.amount = 0;
		this.bought = 0;
		this.tier = tier;
		this.mult = 1.5;
	}
	get canBuy() {
		if(this.amount >= this.maxnum) return false;
		else return this.cost.lte(player.number);
	}
	get value(){
		return Decimal.pow(this.mult, this.amount);
	}
	get cost(){
		return new Decimal(Decimal.mul(this.basecost, Decimal.pow(this.scaling, new Decimal(this.amount))));
	}
	buy(){
		if(!this.canBuy) return;
		player.number -= this.cost;
		this.amount += 1;
		this.bought = 1
		
	}
	get buttontext(){
		if(this.amount < this.maxnum) return "x" + this.mult + ": " + format(this.cost);
		return "MAX";
	}
	get maxnum(){
		if(player.sacrifice.maxmultupgrades.length < this.tier){
			return this._maxnum;
		}else{
			return this._maxnum + player.sacrifice.maxmultupgrades[this.tier - 1].amount;
		}
	}
}

function createMultiplier(tier){
	return new multiplier(Decimal.pow(10, tier + 1), Decimal.plus(1, tier), tier);
}