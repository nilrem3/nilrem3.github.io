var factorshandler = {
	unlocked: false,
	factorjuice: new Decimal(0),
	totalfactorjuicegained: new Decimal(0),
	factorizers: new Decimal(0),
	factorizersbought: new Decimal(0),
	factors: [
		new factor("Multiply Number from producers by the base juice multiplier", function(){return player.sacrifice.factorshandler.baseJuiceMultiplier;}, true),
		new factor("Multiply NP by base juice multipler ^0.5", function(){return Decimal.pow(player.sacrifice.factorshandler.baseJuiceMultiplier, 0.5);}, true),
		new factor("Multiply Click Power by base juice multiplier ^1.5", function(){return Decimal.pow(player.sacrifice.factorshandler.baseJuiceMultiplier, 1.5);}, true),
		new factor("Multiply Starting Number by base juice multiplier ^2", function(){return Decimal.pow(player.sacrifice.factorshandler.baseJuiceMultiplier, 2);}, true),
		new factor("Multiply Multiplier Strength by base juice multiplier ^0.125", function(){return Decimal.pow(player.sacrifice.factorshandler.baseJuiceMultiplier, 0.125);}, true),
		new factor("Multiply Factor Juice Gain by Factorizers bought", function(){return player.sacrifice.factorshandler.factorizersbought;}, true)
	],
	get factorJuicePerSecond(){
		juice = new Decimal(0.025);
		juice = juice.mul(this.factors[5].bonus);
		juice = juice.mul(Decimal.pow(player.sacrifice.timessacrificedthisoverload, new Decimal(0.5)));
		juice = juice.mul(player.achievementshandler.achievementBonus("factor juice", true));
		if(player.overload.overloadupgradetable.columns[2][3].bought){
			juice = juice.mul(Decimal.log(player.sacrifice.numericpoints.plus(10), 10));
		}
		if(player.overload.overloadupgradetable.columns[3][1].bought){
			var havenoprodsormults = true;
			for(var i = 0; i < player.producers.length; i++){
				if(player.producers[i].amount >= 1){
					havenoprodsormults = false;
					break;
				}
			}
			for(var i = 0; i < player.multipliers.length; i++){
				if(player.multipliers[i].amount >= 1){
					havenoprodsormults = false;
					break;
				}
			}
			if(havenoprodsormults){
				juice = juice.mul(10);
			}
		}
		return juice;
	},
	get nextFactorizerCost(){
		ret = new Decimal("1e3");
		ret = ret.mul(Decimal.pow(2, Decimal.pow(this.factorizersbought, 2))); //1000, 2000, 16000, 512000, 33554432000, 68719476736000
		return ret;
	},
	get baseJuiceMultiplier(){
		if(player.overload.challenges[6].active){
			return new Decimal(1);
		}
		mult = Decimal.log(this.factorjuice.plus(10), 10);
		return mult;
	},
	get canBuyFactorizer(){
		if(player.overload.challenges[3].active){
			return false;
		}
		return player.sacrifice.numericpoints.gte(this.nextFactorizerCost);
	},
	unlock(){
		if(player.sacrifice.numericpoints.gte(new Decimal(1000))){
			this.doTheStuffThatHappensOnUnlock();
			player.sacrifice.numericpoints = player.sacrifice.numericpoints.sub(new Decimal(1000));
		}
	},
	buyFactorizer(){
		if(this.canBuyFactorizer){
			player.sacrifice.numericpoints = player.sacrifice.numericpoints.sub(this.nextFactorizerCost);
			this.factorizers = this.factorizers.plus(1);
			this.factorizersbought = this.factorizersbought.plus(1);
		}
	},
	refundFactorizers(){
		player.sacrifice.resetEverythingSacrificeDoes();
		this.factorizers = this.factorizersbought;
		for(var i = 0; i < this.factors.length; i++){
			this.factors[i].numbought = new Decimal(0);
		}
	},
	doTheStuffThatHappensOnUnlock(){
		this.factorizers = this.factorizers.plus(new Decimal(1));
			this.factorizersbought = this.factorizersbought.plus(new Decimal(1));
			document.getElementById("unlockfactors").style.display = "none";
			this.unlocked = true;
			game.unlockmenu("factorsmenubutton");
	}
	
}
