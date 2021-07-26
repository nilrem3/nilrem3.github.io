var player = {
	number: new Decimal(0),
	totalnumberproduced: new Decimal(0),
	producers: [],
	tier: new Decimal(0),
	highesttier: new Decimal(0),
	_maxtier: new Decimal(5),
	clicks: new Decimal(0),
	multipliers: [],
	chargers: [],
	lastupdate: Date.now(),
	sacrifice: sacrifice,
	achievementshandler: achievementshandler,
	statistics: statistics,
	overload: overload,
	clickingmultiplier: null,
	autobuyers: autobuyers,
	get numberperclick(){
		if(player.overload.challenges[9].active){
			return new Decimal(0);
		}
		num = new Decimal(1);
		if(player.overload.overloadupgradetable.columns[0][1].bought){
			for(var i = 0; i < this.producers.length; i++){
				num = num.plus(Decimal.mul(Decimal.mul(this.producers[i].amount, 0.25), i + 1));
			}
		}
		if(player.overload.overloadupgradetable.columns[0][2].bought){
			num = num.mul(Decimal.log(this.sacrifice.numericpoints.plus(10), 10));
		}
		num =  num.times(Decimal.pow(2, sacrifice.repeatableclickupgrade.amount));
		num = Decimal.mul(num, this.achievementshandler.achievementBonus("click power", true));
		num = Decimal.mul(player.achievementshandler.achievementBonus("number", true), num);
		num = Decimal.mul(num, this.sacrifice.factorshandler.factors[2].bonus);
		if(this.clickingmultiplier != null){
			num = num.mul(this.clickingmultiplier.value);
		}
		if(this.overload.overloadupgradetable.columns[1][2].bought){
			if(this.tier.lte(2)){
				num = num.mul(10);
			}
		}
		if(player.overload.overloadupgradetable.columns[3][2].bought){
			if(player.overload.overloadPoints.lte(10)){
				num = num.mul(player.overload.overloadPoints.plus(1));
			}else{
				num = num.mul(Decimal.pow(this.overload.overloadPoints.minus(10), 0.3).plus(11));
			}
		}
		if(player.overload.milestones[0].unlocked){
			num = num.mul(1.5);
		}
		return num;
	},
	get tierUpCostScaling(){
		return new Decimal(20);
	},
	get tierUpCost(){
		return Decimal.mul(Decimal.pow(this.tierUpCostScaling, new Decimal(this.tier)), new Decimal(10));
	},
	get canTierUp(){
		if(this.overload.challenges[1].active){
			return false;
		}
		if(this.number.gte(this.tierUpCost) && this.tier.lt(this.maxtier)){
			return true;
		}else{
			return false;
		}
	},
	get formattednumber(){
		return format(this.number);
	},
	tierUp(num){
		num = Decimal.floor(num);
		if(this.canTierUp == false){
			return;
		}
		if(num.gt(this.timesTierUpable)){
			this.tierUp(this.timesTierUpable);
		}
		this.tier = this.tier.plus(num);
		if(this.tier.gt(this.highesttier)){
			this.highesttier = this.tier;
		}
		this.resetEverythingTierUpDoes();
	},
	resetEverythingTierUpDoes(){
		this.number = new Decimal(0);
		//starting number
		this.number = this.number.plus(new Decimal(5).times(sacrifice.repeatablestartingnumberupgrade.amount))
		this.number = this.number.plus(this.achievementshandler.achievementBonus("starting number", false));
		if(this.overload.milestones[1].unlocked){
			this.number = this.number.plus(20);
		}
		//multipliers to starting number
		this.number = this.number.mul(this.sacrifice.factorshandler.factors[3].bonus);
		//set up producers and multipliers
		this.producers = [];
		this.multipliers = [];
		this.chargers = [];
		for(var i = 0; new Decimal(i).lt(this.tier); i++){
			this.multipliers.push(createMultiplier(i + 1));
			this.producers.push(createProducer(i + 1, this.multipliers[i]));
			this.chargers.push(makecharger(i));
		}
		this.clickingmultiplier = null;
		if(this.overload.overloadupgradetable.columns[1][0].bought){
			this.clickingmultiplier = new multiplier(new Decimal(10), new Decimal(5), null);
		}
		//sacrifice upgrades:
		sacrifice.addmaxupgrades(this.tier);
		//starting prods and mults
		if(this.overload.overloadupgradetable.columns[4][0].bought && this.producers.length >= 1){
			this.producers[0].amount = new Decimal(1);
		}
		if(this.overload.overloadupgradetable.columns[5][0].bought && this.multipliers.length >= 1){
			this.multipliers[0].amount = new Decimal(1);
		}
		if(this.overload.overloadupgradetable.columns[4][1].bought && this.producers.length >= 2){
			this.producers[1].amount = new Decimal(1);
		}
		if(this.overload.overloadupgradetable.columns[5][1].bought && this.multipliers.length >= 2){
			this.multipliers[1].amount = new Decimal(1);
		}
		if(this.overload.overloadupgradetable.columns[4][2].bought && this.producers.length >= 3){
			this.producers[2].amount = new Decimal(1);
		}
		if(this.overload.overloadupgradetable.columns[5][2].bought && this.multipliers.length >= 3){
			this.multipliers[2].amount = new Decimal(1);
		}
		if(this.overload.overloadupgradetable.columns[4][3].bought && this.producers.length >= 4){
			this.producers[3].amount = new Decimal(1);
		}
		if(this.overload.overloadupgradetable.columns[5][3].bought && this.multipliers.length >= 4){
			this.multipliers[3].amount = new Decimal(1);
		}
	},
	get tierUpbuttontext(){
		if(this.overload.challenges[1].active){
			return "Can't tier up in this challenge!";
		}
		if(this.tier.lt(this.maxtier)){
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
		
		return ret;
	},
	get maxtier(){
		return this.overload.timesoverloaded.plus(this._maxtier);
	},
	get clickmulthtml(){
		if(this.clickingmultiplier != null){
			return `<div class="multiplierdisplay">
		<span class="displaytext">Click Multiplier: x` + format(player.clickingmultiplier.value) + `</span>
		<button onclick="player.clickingmultiplier.buy(1)">` + player.clickingmultiplier.buttontext + `</button>
	</div>`;
		}else{
			return ``;
		}
	},
	get timesTierUpable(){
		if(this.canTierUp == false){
			return new Decimal(0);
		}
		var num = Decimal.floor(Decimal.log(new Decimal(-1).mul(new Decimal(1).sub(this.tierUpCostScaling).div(this.tierUpCost)).mul(player.number).plus(1), this.tierUpCostScaling));
		if(num.gte(this.maxtier.sub(this.tier))){
			return this.maxtier.sub(this.tier);
		}
		return num;
	},
	get npmaxxed(){
		//returns true if nothing that can be bought with number (producers, multipliers, chargers) would increase np on sacrifice if purchased.
		for(var i = 0; i < this.producers.length; i++){
			if(this.producers[i].amount.lt(this.producers[i].maxnum)){
				return false;
			}
		}
		if(this.overload.overloadupgradetable.columns[2][0].bought){
			for(var i = 0; i < this.multipliers[i].length; i++){
				if(this.multipliers[i].amount.lt(this.multipliers[i].maxnum)){
					return false;
				}
			}
		}
		//at some point if chargers affect np check if they're maxxed too
		return true;
	}


	
}
var defaultplayer = player;