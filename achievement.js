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
		return "????????????????";
	}
	get description(){
		if(this.visible){
			return this._description;
		}
		return "????????????????"
	}
	get reward(){
		if(this.visible){
			return "Reward: " + this._reward;
		}
		return "???????????????";
	}
	get class(){
		if(this.unlocked){
			return "completeachievement displaytext achievementdisplay";
		}else{
			return "incompleteachievement displaytext achievementdisplay";
		}
	}
}
var achievementshandler = {
	//things given as achievement rewards need to be small and generic and already come from somewhere else, so no new mechanics
	/*
	small number mult
	small click power mult
	small number from producers mult
	small np mult
	some base np
	some starting number
	*/
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
	new achievement("Back to Square 1", "Sacrifice once!", "+1 maximum on all producers", 2), //10
	new achievement("Large Number", "Have 1e4 number", "1.1x Number from producers", 1),
	new achievement("Larger Number", "Have 1e6 number", "1.1x Number from producers", 1),
	new achievement("Really Big Number", "Have 1e8 number", "1.1x Number from producers", 2),
	new achievement("Harderererer Worker", "Click 5000 times", "1.05x click power", 3),
	new achievement("Hardererererer Worker", "Click 10000 times.  I wonder if I'll ever make more creative names for these?", "1.05x click power", 3),
	new achievement("Harderererererer Worker", "Click 25000 times.  I don't know why this achievement exisits, it really shouldn't.", "1.05x click power", 4),
	new achievement("On your knees day and night", "Sacrifice for at least 500 NP", "1.05x NP gain", 3),
	new achievement("A million times humbler than thou art", "Sacrifice for at least 1000 NP", "1.05x NP gain", 4),//18
	new achievement("Zoom", "make 1e4 number per second", "x1.05x number from producers", 2),
	new achievement("Zoomier", "make 1e5 number per second", "x1.05x number from producers", 3),
	new achievement("Auger", "sacrifice 10 times", "+5 base NP when sacrificing", 3),
	new achievement("Sacrificial Expert", "Sacrifice 25 times", "+5 base NP when sacrificing", 4),
	new achievement("Perfect Sacrifice", "Sacrifice with 20 of each producer", "+10 base NP when sacrificing", 2),
	new achievement("Maximum Multiplication", "Get 6 of each multiplier 1-5", "multipliers are now x1.55 per level", 3),//24
	new achievement("Minimum Multiplication", "Sacrifice without having any multipliers, and having at least 1 producer 5.", "1.05x all number", 3),
	new achievement("Overloaded", "Have 6 of each multiplier and 20 of each producer 1-5", "UNLOCK A NEW FEATURE (technically not implemented yet), and also x1.05 all number", 3),//this one doesn't have an unlock yet but the reward is in
	new achievement("Meaningless Wealth", "Have at least 1e5 number in tier 2", "1.05x all number in tiers 4 and below", 3),
	new achievement("Organized", "Have 1 of producer 1, 2 of producer 2, 3 of producer 3, etc. up to 5", "1.1x all number", 3),//28
	new achievement("Huge Number", "Have 1e10 Number", "1.1x number from producers", 3),
	new achievement("Production", "Make a total of 1e6 number", "1.02x all number", 1),
	new achievement("More Production", "Make a total of 1e8 number", "1.02x all number", 2),
	new achievement("Even More Production", "Make a total of 1e10 number", "1.02x all number", 3),
	new achievement("Even Even More Production", "Make a total of 1e12 number", "1.02x all number", 4),
	new achievement("Very Huge number", "Have 1e12 number", "1.1x number from producers", 4),//34
	new achievement("Pious", "Gain a total of 1000 NP", "1.05x NP gain", 3),//this and onwards don't have implemented rewards or unlocks yet
	new achievement("Piouser", "Gain a total of 2500 NP", "1.05x NP gain", 3),
	new achievement("Piouserer", "Gain a total of 5000 NP", "1.05x NP gain", 3),
	new achievement("Piousererest", "Gain a total of 10000 NP", "1.05x NP gain", 3),
	new achievement("Piousererseter", "Gain a total of 25000 NP.  Did you think the last one was the end?", "1.05x NP gain", 4)
	//new achievement("Useless", "Sacrifice without having any producer 1", "1.2x number from producer 1", 3),
	],
	checkAchievementVisibility(){
		this.makevisible(1);
		if(player.tier >= 5){
			this.makevisible(2);
		}
		if(player.sacrifice.timessacrificed > 0){
			this.makevisible(3);
		}
		if(player.sacrifice.timessacrificed >= 10){
			this.makevisible(4);
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
		if(this.achievements[14].unlocked){
			mult = Decimal.mul(mult, new Decimal(1.05));
		}
		if(this.achievements[15].unlocked){
			mult = Decimal.mul(mult, new Decimal(1.05));
		}
		if(this.achievements[16].unlocked){
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
	},
	get numberFromProducerMult(){
		mult = new Decimal(1);
		if(this.achievements[11].unlocked){
			mult = mult.mul(new Decimal(1.1));
		}
		if(this.achievements[12].unlocked){
			mult = mult.mul(new Decimal(1.1));
		}
		if(this.achievements[13].unlocked){
			mult = mult.mul(new Decimal(1.1));
		}
		if(this.achievements[19].unlocked){
			mult = mult.mul(new Decimal(1.05));
		}
		if(this.achievements[20].unlocked){
			mult = mult.mul(new Decimal(1.05));
		}
		if(this.achievements[29].unlocked){
			mult = mult.mul(new Decimal(1.1));
		}
		if(this.achievements[34].unlocked){
			mult = mult.mul(new Decimal(1.1));
		}
		return mult;
	},
	get npMult(){
		mult = new Decimal(1);
		if(this.achievements[17].unlocked){
			mult = mult.mul(1.05, mult);
		}
		if(this.achievements[18].unlocked){
			mult = mult.mul(1.05, mult);
		}
		if(this.achievements[35].unlocked){
			mult = mult.mul(1.05, mult);
		}
		if(this.achievements[36].unlocked){
			mult = mult.mul(1.05, mult);
		}
		if(this.achievements[37].unlocked){
			mult = mult.mul(1.05, mult);
		}
		if(this.achievements[38].unlocked){
			mult = mult.mul(1.05, mult);
		}
		if(this.achievements[39].unlocked){
			mult = mult.mul(1.05, mult);
		}
		return mult;
	},
	get baseNpBonus(){
		bonus = new Decimal(0);
		if(this.achievements[21].unlocked){
			bonus = bonus.plus(new Decimal(5));
		}
		if(this.achievements[22].unlocked){
			bonus = bonus.plus(new Decimal(5));
		}
		if(this.achievements[23].unlocked){
			bonus = bonus.plus(new Decimal(10));
		}
		return bonus;
	},
	get multiplierStrengthBonus(){
		bonus = new Decimal(0);
		if(this.achievements[24].unlocked){
			bonus = bonus.plus(new Decimal(0.05));
		}
		return bonus;
	},
	get globalNumberMult(){
		mult = new Decimal(1);
		if(this.achievements[25].unlocked){
			mult = mult.mul(new Decimal(1.05));
		}
		if(this.achievements[26].unlocked){
			mult = mult.mul(new Decimal(1.05));
		}
		if(this.achievements[27].unlocked && player.tier <= 4){
			mult = mult.mul(new Decimal(1.05));
		}
		if(this.achievements[28].unlocked){
			mult = mult.mul(new Decimal(1.1));
		}
		if(this.achievements[30].unlocked){
			mult = mult.mul(new Decimal(1.02));
		}
		if(this.achievements[31].unlocked){
			mult = mult.mul(new Decimal(1.02));
		}
		if(this.achievements[32].unlocked){
			mult = mult.mul(new Decimal(1.02));
		}
		if(this.achievements[33].unlocked){
			mult = mult.mul(new Decimal(1.02));
		}
		return mult;
	},
	get numCompleted(){
		num = 0;
		for(var i = 0; i < this.achievements.length; i++){
			if(this.achievements[i].unlocked){
				num ++;
			}
		}
		return num;
	}
}
