var sacrifice = {
	factorshandler: factorshandler,
	unlocked: false,
	numericpoints: new Decimal(0),
	totalnpgained: new Decimal(0),
	timessacrificed: new Decimal(0),
	timessacrificedthisoverload: new Decimal(0),
	maxmultupgrades: [],
	maxproducerupgrades: [],
	maxclickmultupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), new Decimal(3), "+1 max Clicking Multiplier"),
	repeatableclickupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "x2 Click Power"),
	repeatablestartingnumberupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "+5 Starting Number"),
	repeatablenumbermultupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "x1.5 number from all producers"),
	repeatablenpmultupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "x1.2 NP from sacrifice"),
	generatemaxproducerupgrade(tier){
		return new sacrificeupgrade(Decimal.mul(10, Decimal.pow(2, tier - 1)), new Decimal(1.45), new Decimal(13), "Increase the maximum of Producer " + tier);//13 instead of 14 to account for the achievement that gives +1
	},
	generatemaxmultiplierupgrade(tier){
		return new sacrificeupgrade(Decimal.mul(40, Decimal.pow(2, tier - 1)), new Decimal(5), new Decimal(3), "Increase the maximum of Multiplier " + tier);
	},
	addmaxupgrades(highesttier){
		while(highesttier.gt(this.maxmultupgrades.length)){
			this.maxmultupgrades.push(this.generatemaxmultiplierupgrade(this.maxmultupgrades.length + 1));
		}
		while(highesttier.gt(this.maxproducerupgrades.length)){
			this.maxproducerupgrades.push(this.generatemaxproducerupgrade(this.maxproducerupgrades.length + 1));
		}
		if(player.overload.overloadupgradetable.columns[1][0].bought){
			this.maxclickmultupgrade.unlocked = true;
		}
	},
	get numericpointsonsacrifice(){
		var value = new Decimal(0);
		var i;
		for(i = 0; i < player.producers.length; i++){
			value = Decimal.plus(new Decimal(player.producers[i].numericpointsonsacrifice), value);
		}
		if(player.overload.overloadupgradetable.columns[1][3].bought){
			value = value.plus(Decimal.pow(player.number, 0.2));
		}
		value = value.mul(player.achievementshandler.achievementBonus("np", true));
		value = value.times(Decimal.pow(1.2, sacrifice.repeatablenpmultupgrade.amount));
		value = value.mul(player.sacrifice.factorshandler.factors[1].bonus);
		return value;
	},
	get canSacrifice(){
		if(player.overload.challenges[2].active){
			return false;
		}
		return ((player.tier.gte(5) || player.overload.overloadupgradetable.columns[2][1].bought) && this.numericpointsonsacrifice.gte(70));
	},
	sacrifice(){
		if(this.canSacrifice){
			if(this.numericpointsonsacrifice.gte(new Decimal(500))){
				player.achievementshandler.completeAchievement(17);
			}
			if(this.numericpointsonsacrifice.gte(new Decimal(1000))){
				player.achievementshandler.completeAchievement(18);
			}
			if(player.producers[0].amount == 24 && player.producers[1].amount == 24 && player.producers[2].amount == 24 && player.producers[3].amount == 24 && player.producers[4].amount == 24){
				player.achievementshandler.completeAchievement(23);
			}
			if(player.multipliers[0].amount == 0 && player.multipliers[1].amount == 0 && player.multipliers[2].amount == 0 && player.multipliers[3].amount == 0 && player.multipliers[4].amount == 0 && player.producers[4].amount >= 1){
				player.achievementshandler.completeAchievement(25);
			}
			if(this.numericpointsonsacrifice.gte(new Decimal(2500))){
				player.achievementshandler.completeAchievement(78);
			}
			if(this.numericpointsonsacrifice.gte(new Decimal(10000))){
				player.achievementshandler.completeAchievement(79);
			}
			if(this.numericpointsonsacrifice.gte(new Decimal(25000))){
				player.achievementshandler.completeAchievement(80);
			}
			this.timessacrificed = this.timessacrificed.plus(1);
			this.timessacrificedthisoverload = this.timessacrificedthisoverload.plus(1);
			this.addNumericPoints(this.numericpointsonsacrifice);
			if(player.overload.challenges[9].active){
				this.numericpoints = new Decimal(0);
			}
			this.resetEverythingSacrificeDoes();
		}
	},
	addNumericPoints(points){
		points = points;
		this.numericpoints = Decimal.plus(this.numericpoints, points);
		this.totalnpgained = Decimal.plus(this.totalnpgained, points);
	},
	get sacrificebuttontext(){
		if(player.overload.challenges[2].active){
			return `Can't sacrifice in this challenge!`;
		}
		if(this.canSacrifice) return `Sacrifice Your Producers and Multipliers to Gain <span class=\"sacrificecoloredtext\">` + format(this.numericpointsonsacrifice) + `</span> Numeric Points!`;
		else return `Cannot Sacrifice Below tier 5 or for less than 70 NP`;
	},
	resetEverythingSacrificeDoes(){
		player.tier = new Decimal(0);
		if(player.overload.overloadupgradetable.columns[0][0].bought){
			player.tier = new Decimal(2);
		}
		player.resetEverythingTierUpDoes();
	},
	get numericpointspersecond(){
		points = new Decimal(0);
		if(player.overload.overloadupgradetable.columns[3][0].bought){
			points = points.plus(Decimal.mul(this.numericpointsonsacrifice, 0.001));
		}
		return points;
	}
}
sacrifice.maxclickmultupgrade.unlocked = false;
