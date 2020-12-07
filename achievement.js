class achievement{
	constructor(name, description, reward, visibilitytype){
		this._name = name;
		this._description = description;
		this._reward = reward;
		this.unlocked = false;
		this.visible = false;
		this.visibilitytype = visibilitytype;
	}
	get name(){
		if(this.visible){
			return this._name;
		}
		return "";
	}
	get description(){
		if(this.visible){
			return this._description;
		}
		return ""
	}
	get reward(){
		if(this.visible){
			return "Reward: " + this._reward;
		}
		return "";
	}
	get class(){
		if(this.visible){
			if(this.unlocked){
				return "completeachievement displaytext achievementdisplay";
			}else{
				return "incompleteachievement displaytext achievementdisplay";
			}
		}else{
			return "invisibleachievement displaytext achievementdisplay";
		}
	}
}
var achievementshandler = {
	achievements: [
	new achievement("Hard Worker", "Click 100 times!", "1.05x click power", 1),
	new achievement("Harder Worker", "Click 250 times!", "1.05x click power", 1),
	new achievement("Harderer Worker", "Click 500 times!", "1.05x click power", 2),
	new achievement("Hardererer Worker", "Click 1000 times, enough for a producer 3!", "1.05x click power", 2),
	new achievement("Even Hardererer Worker", "Click 2500 times!", "1.05x click power", 3),
	new achievement("New Beginning", "Tier Up Once!", "+1 starting number", 1),
	new achievement("Newer Beginning", "Tier Up Twice!", "+1 starting number", 1),
	new achievement("Newerer Beginning", "Tier Up Thrice!", "+1 starting number", 1),
	new achievement("Newererer Beginning", "Tier Up Quice! (was that an undertale reference?)", "+1 starting number", 1),
	new achievement("Final Tier . . . or is it?", "Tier Up 5 times!", "+1 starting number", 1),
	new achievement("Back to Square 1", "Sacrifice once!", "+1 maximum on all producers", 2)/*,
	new achivement("Large Number", "Have 1e4 number", "1.1x Number from producers", 1),
	new achievement("Larger Number", "Have 1e6 number", "1.1x Number from producers", 1),
	new achievement("Really Big Number", "Have 1e8 number", "1.1x Number from producers", 2).
	new achievement("Perfect Sacrifice", "Sacrifice when all of your producers are maxxed", "+10 base NP when sacrificing", 2),
	new achievement("Maximum Multiplication", "Get 6 of each multiplier 1-5", "multipliers are now x1.6 per level", 3),
	new achievement("Minimum Multiplication", "Sacrifice without having any multipliers, and having at least 1 producer 5.", "you gain 3 base number per second", 3),
	new achievement("Overloaded", "Have 6 of each multiplier and 20 of each producer 1-5", "UNLOCK A NEW FEATURE, and also gain 0.1 NP per second", 3),
	new achievement("Meaningless Wealth", "Have at least 1e5 number in tier 2", "1.1x number in tiers 4 and below", 3),
	new achievement("Useless", "Sacrifice without having any producer 1", "Producer 1 produces twice as much number and is worth 1.2x as much NP", 3),
	new achievement("Organized", "Have 1 of producer 1, 2 of producer 2, 3 of producer 3, etc. up to 5", "Producers that are maxxed produce 1.05x more number", 3)
	*/
	],
	checkAchievementVisibility(){
		this.makevisible(1);
		if(player.tier >= 5){
			this.makevisible(2);
		}
		if(player.sacrifice.timessacrificed > 0){
			this.makevisible(3);
		}
	},
	makevisible(visibilitytype){
		for(var i = 0; i < this.achievements.length; i++){
			if(this.achievements[i].visibilitytype == visibilitytype){
				this.achievements[i].visible = true;
			}
		}
	},
	completeAchievement(num){
		if(this.achievements[num].visible){
			this.achievements[num].unlocked = true;
		}
	},
	get clickPowerMult(){
		mult = new Decimal(1);
		if(this.achievements[0].unlocked){
			mult = Decimal.mul(mult, new Decimal(1.05));
		}
		if(this.achievements[1].unlocked){
			mult = Decimal.mul(mult, new Decimal(1.05));
		}
		if(this.achievements[2].unlocked){
			mult = Decimal.mul(mult, new Decimal(1.05));
		}
		if(this.achievements[3].unlocked){
			mult = Decimal.mul(mult, new Decimal(1.05));
		}
		if(this.achievements[4].unlocked){
			mult = Decimal.mul(mult, new Decimal(1.05));
		}
		return mult;
	},
	get startingNumberBonus(){
		bonus = new Decimal(0);
		if(this.achievements[5].unlocked){
			bonus = bonus.plus(new Decimal(1));
		}
		if(this.achievements[6].unlocked){
			bonus = bonus.plus(new Decimal(1));
		}
		if(this.achievements[7].unlocked){
			bonus = bonus.plus(new Decimal(1));
		}
		if(this.achievements[8].unlocked){
			bonus = bonus.plus(new Decimal(1));
		}
		if(this.achievements[9].unlocked){
			bonus = bonus.plus(new Decimal(1));
		}
		return bonus;
	},
	get globalMaximumProducerBonus(){
		bonus = 0;
		if(this.achievements[10].unlocked){
			bonus += 1;
		}
		return bonus;
	}
}
