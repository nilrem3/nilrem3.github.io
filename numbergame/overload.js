var overload = {
	unlocked: false,
	_timesoverloaded: new Decimal(0),
	besttimesoverloaded: new Decimal(0),
	overloadPoints: new Decimal(0),
	overloadPointsEarned: new Decimal(0),
	overloadupgradetable: {
		columns: [[
			new overloadupgrade("Start in tier 2 when you sacrifice, overload, or enter a challenge", new Decimal(1)),
			new overloadupgrade("Clicking is stronger the more producers you have", new Decimal(5)),
			new overloadupgrade("Unspent NP boosts number slightly", new Decimal(19)),
			new overloadupgrade("unspent OP boosts number from producers", new Decimal(215))
		],
		[
			new overloadupgrade("There is a multiplier for clicking (when you buy this, it won't appear until you tier up/sacrifice/overload once.)", new Decimal(1)),
			new overloadupgrade("Start with 1 factorizer when you overload or enter a challenge", new Decimal(15)),
			new overloadupgrade("Gain 10x Number in Tier 2 and below", new Decimal(98)),
			new overloadupgrade("Gain Extra NP when sacrificing based on unspent number", new Decimal(157))
		],
		[
			new overloadupgrade("Multiplier Value multiplies corresponding producer's NP value with reduced effect", new Decimal(1)),
			new overloadupgrade("You can sacrifice before tier 5", new Decimal(21)),
			new overloadupgrade("Factor Juice boosts number from producers directly", new Decimal(118)),
			new overloadupgrade("unspent NP boosts factor juice gain", new Decimal(100))
		],
		[
			new overloadupgrade("Gain 0.1% of your NP on sacrifice every second", new Decimal(4)),
			new overloadupgrade("If you have no producers or multipliers, gain factor juice 10x as fast", new Decimal(29)),
			new overloadupgrade("Clicking is boosted by Unspent OP", new Decimal(51)),
			new overloadupgrade("Repeatable Sacrifice upgrade scaling is now 3x.  (when you buy this upgrade you'll need to overload or enter a challenge for it to take effect.)", new Decimal(141))
		],
		[
			new overloadupgrade("Start with a producer 1", new Decimal(1)),
			new overloadupgrade("Start with a producer 2", new Decimal(2)),
			new overloadupgrade("Start with a producer 3", new Decimal(3)),
			new overloadupgrade("Start with a producer 4", new Decimal(4))
		],
		[
			new overloadupgrade("Start with a multiplier 1", new Decimal(2)),
			new overloadupgrade("Start with a multiplier 2", new Decimal(4)),
			new overloadupgrade("Start with a multiplier 3", new Decimal(6)),
			new overloadupgrade("Start with a multiplier 4", new Decimal(8)),
		]
		]
	},
	challenges: [
		new challenge("Producers Produce No Number", "Number", function(completions){return Decimal.pow(new Decimal("1e3"), Decimal.plus(completions, 1));}, "Reward: +1 maximum charger 1!"),
		new challenge("You Can't Tier Up", "Number", function(completions){return Decimal.pow(new Decimal("1e6"), Decimal.plus(completions, 1));}, "Reward: +1 maximum charger 2!"),
		new challenge("You Can't Sacrifice", "Number", function(completions){return Decimal.mul(new Decimal("1e9"), Decimal.pow(new Decimal("1e6"), completions))}, "Reward: +1 maximum charger 3!"),
		new challenge("You can't buy factorizers", "Number", function(completions){return Decimal.mul(new Decimal("1e9"), Decimal.pow(new Decimal("1e7"), completions));}, "Reward: +1 maximum charger 4!"),
		new challenge("Producers and Multipliers Max at 0", "Number", function(completions){return Decimal.mul(new Decimal("1e5"), Decimal.pow(new Decimal("1e3"), completions));}, "Reward: +1 maximum charger 5!"),
		new challenge("Can't buy Sacrifice Upgrades", "Number", function(completions){return Decimal.pow(new Decimal("1e6"), completions + 2);}, "Reward: +1 maximum charger 6!"),
		new challenge("Base Juice Multiplier is always x1.00", "Number", function(completions){return Decimal.mul(new Decimal("1e3"), Decimal.pow(new Decimal("1e6"), completions + 1));}, "Reward: +1 maximum charger 7!"),
		new challenge("You Can't Buy producers or multipliers", "Number", function(completions){return new Decimal("1e9").mul(Decimal.pow(new Decimal("1e6"), completions));}, "Reward: +1 maximum charger 8!"),
		new challenge("Producers are worth 0 NP", "NP", function(completions){return new Decimal("1e3").mul(Decimal.pow(new Decimal("1e2"), completions));}, "Reward: +1 maximum charger 9!"),
		new challenge("Producers Producer No Number, Max at 0, and Can't be Bought, and are worth no NP. You can't buy sacrifice upgrades, and you lose all your NP directly after sacrificing. You can only have 1 factorizer. Clicking gives 0 number.", "NP", function(completions){return new Decimal("1e2").mul(Decimal.pow(new Decimal("1e2"), completions));}, "Reward: +1 maximum chargers 10 and up!")
		//only the 1 factorizer limit is not implemented
	],
	milestones: [
		new overloadmilestone(1, "Gain 50% more Number"),
		new overloadmilestone(2, "+20 starting Number"),
		new overloadmilestone(3, "Unlock the Producer Autobuyer"),
		new overloadmilestone(4, "Unlock the Multiplier Autobuyer"),
		new overloadmilestone(5, "Unlock the Tier Up Autobuyer"),
		new overloadmilestone(6, "Unlock the Sacrifice Autobuyer"),
		new overloadmilestone(7, "Unlock the Factorizer Autobuyer"),
		new overloadmilestone(8, "Unlock the Autobuyer for Maximum Sacrifice Upgrades"),
		new overloadmilestone(9, "Unlock the Autobuyer for Repeatable Sacrifice Upgrades"),
		new overloadmilestone(10, "Unlock the Charger Autobuyer")/*,
		new overloadmilestone(11, "Unlock a Factor for OP")*/
	],
	resetEverythingOverloadDoes(){
		player.sacrifice.maxproducerupgrades = [];
		player.sacrifice.maxmultupgrades = [];
		if(this.overloadupgradetable.columns[3][3].bought){
			player.sacrifice.repeatableclickupgrade = new sacrificeupgrade(new Decimal(50), new Decimal(3), null, "x2 Click Power");
			player.sacrifice.repeatablestartingnumberupgrade = new sacrificeupgrade(new Decimal(50), new Decimal(3), null, "+5 Starting Number");
			player.sacrifice.repeatablenumbermultupgrade = new sacrificeupgrade(new Decimal(50), new Decimal(3), null, "x2 number from all producers");
			player.sacrifice.repeatablenpmultupgrade = new sacrificeupgrade(new Decimal(50), new Decimal(3), null, "x1.3 NP from sacrifice");
		}else{
			player.sacrifice.repeatableclickupgrade = new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "x2 Click Power");
			player.sacrifice.repeatablestartingnumberupgrade = new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "+5 Starting Number");
			player.sacrifice.repeatablenumbermultupgrade = new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "x2 number from all producers");
			player.sacrifice.repeatablenpmultupgrade = new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "x1.3 NP from sacrifice");
		}
		player.sacrifice.numericpoints = new Decimal(0);
		player.sacrifice.factorshandler.factorjuice = new Decimal(0);
		player.sacrifice.timessacrificedthisoverload = new Decimal(0);
		player.sacrifice.factorshandler.factorizersbought = new Decimal(0);
		if(this.overloadupgradetable.columns[1][1].bought){
			player.sacrifice.factorshandler.doTheStuffThatHappensOnUnlock();
		}
		player.sacrifice.factorshandler.refundFactorizers();
		for(var i = 0; i < player.sacrifice.factorshandler.factors.length; i++){
			player.sacrifice.factorshandler.factors[i].numbought = new Decimal(0);
		}
		player.sacrifice.resetEverythingSacrificeDoes();
	},
	overload(){
		if(this.canOverload){
			this.overloadPoints = this.overloadPoints.plus(this.OPonoverload);
			this.overloadPointsEarned = this.overloadPointsEarned.plus(this.OPonoverload);
			this.timesoverloaded = this.timesoverloaded.plus(1);
			this.resetEverythingOverloadDoes();
		}
	},
	get canOverload(){
		if(player.tier.equals(player.maxtier)){
			for(var i = 0; i < player.sacrifice.maxproducerupgrades.length; i++){
				if(player.sacrifice.maxproducerupgrades[i].amount.lt(player.sacrifice.maxproducerupgrades[i].maxlevel)){
					return false;
				}
			}
			for(var i = 0; i < player.sacrifice.maxmultupgrades.length; i++){
				if(player.sacrifice.maxmultupgrades[i].amount.lt(player.sacrifice.maxmultupgrades[i].maxlevel)){
					return false;
				}
			}
			for(var i = 0; i < player.producers.length; i++){
				if(player.producers[i].amount.lt(player.producers[i].maxnum)){
					return false;
				}
			}
			for(var i = 0; i < player.multipliers.length; i++){
				if(player.multipliers[i].amount.lt(player.multipliers[i].maxnum)){
					return false;
				}
			}
			return true;
		}
		return false;
	},
	get OPonoverload(){
		let op = Decimal.pow(this.timesoverloaded.plus(1), 2);
		//apply bonuses here
		return op;
	},
	get overloadPointsdisplay(){
		if(this.overloadPoints.lt(100)){
			return this.overloadPoints;
		}else{
			return format(this.overloadPoints);
		}
	},
	exitchallenges(){
		var exited = false;
		for(var i = 0; i < this.challenges.length; i++){
			if(this.challenges[i].active){
				exited = true;
			}
			this.challenges[i].active = false;
		}
		if(exited){
			this.resetEverythingOverloadDoes();
		}
	},
	refundOverloadPoints(){
		for(var i = 0; i < this.overloadupgradetable.columns.length; i++){
			for(var j = 0; j < this.overloadupgradetable.columns[i].length; j++){
				this.overloadupgradetable.columns[i][j].bought = false;
			}				
		}
		this.overloadPoints = this.overloadPointsEarned;
		this.exitchallenges();
		this.resetEverythingOverloadDoes();
	},
	set timesoverloaded(times){
		this._timesoverloaded = times;
		if(this._timesoverloaded.gte(this.besttimesoverloaded)){
			this.besttimesoverloaded = this._timesoverloaded;
		}
	},
	get timesoverloaded(){
		return this._timesoverloaded;
	}
}
overload.overloadupgradetable.columns[0][1].requiredupgrade = overload.overloadupgradetable.columns[0][0];
overload.overloadupgradetable.columns[0][2].requiredupgrade = overload.overloadupgradetable.columns[0][1];
overload.overloadupgradetable.columns[0][3].requiredupgrade = overload.overloadupgradetable.columns[0][2];
overload.overloadupgradetable.columns[1][1].requiredupgrade = overload.overloadupgradetable.columns[1][0];
overload.overloadupgradetable.columns[1][2].requiredupgrade = overload.overloadupgradetable.columns[1][1];
overload.overloadupgradetable.columns[1][3].requiredupgrade = overload.overloadupgradetable.columns[1][2];
overload.overloadupgradetable.columns[2][1].requiredupgrade = overload.overloadupgradetable.columns[2][0];
overload.overloadupgradetable.columns[2][2].requiredupgrade = overload.overloadupgradetable.columns[2][1];
overload.overloadupgradetable.columns[2][3].requiredupgrade = overload.overloadupgradetable.columns[2][2];
overload.overloadupgradetable.columns[3][1].requiredupgrade = overload.overloadupgradetable.columns[3][0];
overload.overloadupgradetable.columns[3][2].requiredupgrade = overload.overloadupgradetable.columns[3][1];
overload.overloadupgradetable.columns[3][3].requiredupgrade = overload.overloadupgradetable.columns[3][2];