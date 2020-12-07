var sacrifice = {
	unlocked: false,
	numericpoints: new Decimal(0),
	timessacrificed: 0,
	maxmultupgrades: [],
	maxproducerupgrades: [],
	repeatableclickupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "x1.5 Click Power"),
	repeatablestartingnumberupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "+5 Starting Number"),
	repeatablenumbermultupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "x1.2 number from all producers"),
	repeatablenpmultupgrade: new sacrificeupgrade(new Decimal(50), new Decimal(5), null, "x1.1 NP from sacrifice"),
	generatemaxproducerupgrade(tier){
		return new sacrificeupgrade(Decimal.mul(10, Decimal.pow(2, tier - 1)), new Decimal(1.6), 10, "Increase the maximum of Producer " + tier);
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
		value = value.times(Decimal.pow(1.1, sacrifice.repeatablenpmultupgrade.amount));
		return value;
	},
	get canSacrifice(){
		return (player.tier >= 5 && this.numericpointsonsacrifice.gte(70));
	},
	sacrifice(){
		if(this.canSacrifice){
			this.timessacrificed += 1;
			this.addNumericPoints(this.numericpointsonsacrifice);
			player.tier = 0;
			player.resetEverythingTierUpDoes();
		}
	},
	addNumericPoints(points){
		points = points;
		this.numericpoints = Decimal.plus(this.numericpoints, points);
	},
	get sacrificebuttontext(){
		if(this.canSacrifice) return "Sacrifice Your Producers and Multipliers to Gain " + this.numericpointsonsacrifice + " Numeric Points!";
		else return "Cannot Sacrifice Below tier 5 or for less than 70 NP";
	}
}
