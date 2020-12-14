var sacrifice = {
	factorshandler: factorshandler,
	unlocked: false,
	numericpoints: new Decimal(0),
	totalnpgained: new Decimal(0),
	timessacrificed: 0,
	timessacrificedthisoverload: 0,
	maxmultupgrades: [],
	maxproducerupgrades: [],
	repeatableclickupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "x2 Click Power"),
	repeatablestartingnumberupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "+5 Starting Number"),
	repeatablenumbermultupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "x1.5 number from all producers"),
	repeatablenpmultupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "x1.2 NP from sacrifice"),
	generatemaxproducerupgrade(tier){
		return new sacrificeupgrade(Decimal.mul(10, Decimal.pow(2, tier - 1)), new Decimal(1.6), 13, "Increase the maximum of Producer " + tier);//13 instead of 14 to account for the achievement that gives +1
	},
	generatemaxmultiplierupgrade(tier){
		return new sacrificeupgrade(Decimal.mul(40, Decimal.pow(2, tier - 1)), new Decimal(5), 3, "Increase the maximum of Multiplier " + tier);
	},
	addmaxupgrades(highesttier){
		while(this.maxmultupgrades.length < highesttier){
			this.maxmultupgrades.push(this.generatemaxmultiplierupgrade(this.maxmultupgrades.length + 1));
		}
		while(this.maxproducerupgrades.length < highesttier){
			this.maxproducerupgrades.push(this.generatemaxproducerupgrade(this.maxproducerupgrades.length + 1));
		}
	},
	get numericpointsonsacrifice(){
		var value = new Decimal(0);
		var i;
		for(i = 0; i < player.producers.length; i++){
			value = Decimal.plus(new Decimal(player.producers[i].numericpointsonsacrifice), value);
		}
		value = value.plus(player.achievementshandler.baseNpBonus);
		value = value.mul(player.achievementshandler.npMult);
		value = value.times(Decimal.pow(1.2, sacrifice.repeatablenpmultupgrade.amount));
		value = value.mul(player.sacrifice.factorshandler.factors[1].bonus);
		return value;
	},
	get canSacrifice(){
		return (player.tier >= 5 && this.numericpointsonsacrifice.gte(70));
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
			this.timessacrificed += 1;
			this.timessacrificedthisoverload += 1;
			this.addNumericPoints(this.numericpointsonsacrifice);
			this.resetEverythingSacrificeDoes();
		}
	},
	addNumericPoints(points){
		points = points;
		this.numericpoints = Decimal.plus(this.numericpoints, points);
		this.totalnpgained = Decimal.plus(this.totalnpgained, points);
	},
	get sacrificebuttontext(){
		if(this.canSacrifice) return `Sacrifice Your Producers and Multipliers to Gain <span class=\"sacrificecoloredtext\">` + format(this.numericpointsonsacrifice) + `</span> Numeric Points!`;
		else return `Cannot Sacrifice Below tier 5 or for less than 70 NP`;
	},
	resetEverythingSacrificeDoes(){
		player.tier = 0;
		player.resetEverythingTierUpDoes();
	}
}
