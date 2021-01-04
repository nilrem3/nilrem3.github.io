class multiplier{
	constructor(basecost, scaling, tier){
		this.basecost = basecost;
		this.scaling = scaling;
		this._maxnum = new Decimal(3);
		this.amount = new Decimal(0);
		this.bought = new Decimal(0);
		this.tier = tier;
		this._mult = new Decimal(1.5);
	}
	get canBuy() {
		if(player.overload.challenges[7].active){
			return false;
		}
		if(this.amount.gte(this.maxnum)) return false;
		else return this.cost.lte(player.number);
	}
	get value(){
		return Decimal.pow(this.mult, this.amount);
	}
	get cost(){
		return new Decimal(Decimal.mul(this.basecost, Decimal.pow(this.scaling, new Decimal(this.bought))));
	}
	buy(num){
		num = Decimal.floor(num);
		if(!this.canBuy){
			return;
		}
		if(this.numaffordable.lt(num)){
			this.buy(this.numaffordable);
		}else{
			player.number = player.number.sub(this.cost.mul(new Decimal(1).sub(this.scaling.pow(num))).div(new Decimal(1).sub(this.scaling)));
			this.amount = this.amount.plus(num);
			this.bought = this.bought.plus(num);
		}
	}
	get buttontext(){
		if(this.amount.lt(this.maxnum)) return "x" + format(this.mult) + ": " + format(this.cost);
		return "MAX";
	}
	get maxnum(){
		if(player.overload.challenges[4].active){
			return new Decimal(0);
		}
		if(this.tier == null){
			return this._maxnum.plus(player.sacrifice.maxclickmultupgrade.amount);
		}
		if(player.sacrifice.maxmultupgrades.length < this.tier){
			return this._maxnum;
		}else{
			return this._maxnum.plus(player.sacrifice.maxmultupgrades[this.tier - 1].amount);
		}
	}
	get mult(){
		mult = this._mult;
		mult = mult.plus(player.achievementshandler.achievementBonus("multiplier strength", false));
		mult = mult.mul(player.sacrifice.factorshandler.factors[4].bonus);
		return mult;
	}
	get numaffordable(){
		if(this.canBuy == false){
			return new Decimal(0);
		}
		var num = Decimal.floor(Decimal.log((new Decimal(-1).mul((new Decimal(1).sub(this.scaling).div(this.cost))).mul(player.number)).plus(1), this.scaling));
		if(num.gt(new Decimal(this.maxnum - this.amount))){
			return new Decimal(this.maxnum - this.amount);
		}else{
			return num;
		}
	}	
}

function createMultiplier(tier){
	return new multiplier(Decimal.pow(10, tier + 1), Decimal.plus(1, tier), tier);
}