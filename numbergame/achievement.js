class achievement{
	constructor(name, description, rewardtype, reward, ismult,visibilitytype){
		this._name = name;
		this._description = description;
		this.reward = reward;
		this.unlocked = false;
		this.visible = false;
		this.visibilitytype = visibilitytype;
		this.rewardtype = rewardtype;
		this.ismult = ismult;
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
	get rewardstring(){
		if(this.visible){
			ret = "Reward: ";
			if(this.ismult){
				ret += "x";
			}else{
				ret += "+";
			}
			ret += format(this.reward);
			ret += " " + this.rewardtype;
			return ret;
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
	some starting number
	*/
	achievements: [
	new achievement("Hard Worker", "Click 100 times!", "click power", new Decimal(1.05), true, 1),
	new achievement("Harder Worker", "Click 250 times!", "click power", new Decimal(1.05), true, 1),
	new achievement("Harderer Worker", "Click 500 times!", "click power", new Decimal(1.05), true, 2),
	new achievement("Hardererer Worker", "Click 1000 times, enough for a producer 3!", "click power", new Decimal(1.05), true, 2),
	new achievement("Even Hardererer Worker", "Click 2500 times!", "click power", new Decimal(1.05), true, 3),
	new achievement("New Beginning", "Tier Up Once!", "starting number", new Decimal(1), false, 1),
	new achievement("Conspiracy", "Tier Up Twice!", "starting number", new Decimal(1), false, 1),
	new achievement("Third time's the charm", "Tier Up Thrice!", "starting number", new Decimal(1), false, 1),
	new achievement("Four Score", "Tier Up Quice! (was that an undertale reference?)", "starting number", new Decimal(1), false, 1),
	new achievement("5 pieces of Exodia", "Tier Up 5 times! (is that really the max?)", "starting number", new Decimal(1), false, 1),
	new achievement("Back to Square 1", "Sacrifice once!", "maximum producers", new Decimal(1), false, 2), //10
	new achievement("Large Number", "Have 1e4 number", "number from producers", new Decimal(1.1), true, 1),
	new achievement("Larger Number", "Have 1e6 number", "number from producers", new Decimal(1.1), true, 1),
	new achievement("Really Big Number", "Have 1e8 number", "number from producers", new Decimal(1.1), true, 2),
	new achievement("Harderererer Worker", "Click 5000 times", "click power", new Decimal(1.05), true, 3),
	new achievement("Hardererererer Worker", "Click 10000 times.  I wonder if I'll ever make more creative names for these?", "click power", new Decimal(1.05), true, 3),
	new achievement("Harderererererer Worker", "Click 25000 times.  I don't know why this achievement exisits, it really shouldn't.", "click power", new Decimal(1.05), true, 4),
	new achievement("On your knees day and night", "Sacrifice for at least 500 NP", "np gain", new Decimal(1.05), true, 3),
	new achievement("A million times humbler than thou art", "Sacrifice for at least 1000 NP", "np gain", new Decimal(1.05), true, 4),//18
	new achievement("Zoom", "make 1e4 number per second", "number from producers", new Decimal(1.05), true, 2),
	new achievement("Zoomier", "make 1e5 number per second", "number from producers", new Decimal(1.05), true, 3),
	new achievement("Auger", "sacrifice 10 times", "np gain", new Decimal(1.05), true, 3),
	new achievement("Sacrificial Expert", "Sacrifice 25 times", "np gain", new Decimal(1.05), true, 4),
	new achievement("Perfect Sacrifice", "Sacrifice with 24 of each producer", "np gain", new Decimal(1.1), true, 2),
	new achievement("Maximum Multiplication", "Get 6 of each multiplier 1-5", "multiplier strength", new Decimal(0.05), false, 3),//24
	new achievement("Minimum Multiplication", "Sacrifice without having any multipliers, and having at least 1 producer 5.", "number", new Decimal(1.05), true, 3),
	new achievement("Overloaded", "Have 6 of each multiplier and 24 of each producer 1-5", "number", new Decimal(1.05), true, 3),//this one doesn't have an unlock yet but the reward is in
	new achievement("Meaningless Wealth", "Have at least 1e5 number in tier 2", "1.05x all number in tiers 4 and below", 3),
	new achievement("Organized", "Have 1 of producer 1, 2 of producer 2, 3 of producer 3, etc. up to 5", "number", new Decimal(1.1), true, 3),//28
	new achievement("Huge Number", "Have 1e10 Number", "number from producers", new Decimal(1.1), true, 3),
	new achievement("Production", "Make a total of 1e6 number", "number", new Decimal(1.05), true, 1),
	new achievement("More Production", "Make a total of 1e8 number", "number", new Decimal(1.05), true, 2),
	new achievement("Even More Production", "Make a total of 1e10 number", "number", new Decimal(1.05), true, 3),
	new achievement("Even Even More Production", "Make a total of 1e12 number", "number", new Decimal(1.05), true, 4),
	new achievement("Very Huge number", "Have 1e12 number", "number from producers", new Decimal(1.1), true, 4),//34
	new achievement("Pious", "Gain a total of 1000 NP", "np gain", new Decimal(1.05), true, 3),
	new achievement("Piouser", "Gain a total of 2500 NP", "np gain", new Decimal(1.05), true, 3),
	new achievement("Piouserer", "Gain a total of 5000 NP", "np gain", new Decimal(1.05), true, 3),
	new achievement("Piousererest", "Gain a total of 10000 NP", "np gain", new Decimal(1.05), true, 3),
	new achievement("Piousererseter", "Gain a total of 25000 NP.  Did you think the last one was the end?", "np gain", new Decimal(1.05), true, 4),//39
	new achievement("Damp", "Gain a total of 10 Factor Juice", "factor juice", new Decimal(1.05), true, 5),
	new achievement("Moist", "Gain a total of 100 Factor Juice", "factor juice", new Decimal(1.05), true, 5),
	new achievement("Soggy", "Gain a total of 1000 Factor Juice", "factor juice", new Decimal(1.05), true, 5),
	new achievement("Wet", "Gain a total of 1e4 Factor Juice", "factor juice", new Decimal(1.05), true, 5),
	new achievement("Sopping", "Gain a total of 1e5 Factor Juice", "factor juice", new Decimal(1.05), true, 5),
	new achievement("Soaked", "Gain a total of 1e6 Factor Juice", "factor juice", new Decimal(1.05), true, 6),
	new achievement("Gushing", "Gain a total of 1e7 Factor Juice", "factor juice", new Decimal(1.05), true, 6),//Flowing, Pouring, Dripping, Drizzling, Roaring River(not necessarily in that order) 
	new achievement("Factorized", "Have 1 Factorizer", "number", new Decimal(1.05), true, 5),
	new achievement("Twice as Factorized", "Have 2 Factorizers", "number", new Decimal(1.05), true, 5),
	new achievement("TriFactorizer", "Have 3 Factorizers", "number", new Decimal(1.05), true, 6), 
	new achievement("Quadrofactor", "Have 4 Factorizers", "factor juice", new Decimal(1.05), true, 7),//50
	new achievement("Zoomierer", "make 1e6 number per second", "number from producers", new Decimal(1.05), true, 5),
	new achievement("Zoomiererer", "make 1e7 number per second", "number from producers", new Decimal(1.05), true, 6),
	new achievement("Really Huge Number", "Have 1e14 number", "number from producers", new Decimal(1.1), true, 7),
	new achievement("Crazy Production", "Make a total of 1e14 number", "number", new Decimal(1.05), true, 7),
	new achievement("Priest", "Sacrifice 100 times", "np gain", new Decimal(1.05), true, 6),
	new achievement("Monk", "Sacrifice 250 times", "np gain", new Decimal(1.05), true, 7),
	new achievement("Abbot", "Sacrifice 500 times", "np gain", new Decimal(1.05), true, 7),
	new achievement("Deacon", "Sacrifice 1000 times", "np gain", new Decimal(1.05), true, 7),//58
	new achievement("Piousereresterest", "Gain a total of 100000 NP", "np gain", new Decimal(1.05), true, 6),
	new achievement("It wasn't the final tier.", "Reach Tier 6.  I guess 5 wasn't the max after all.", "starting number", new Decimal(2), false, 6),
	new achievement("Lucky Seven", "Reach Tier 7", "starting number", new Decimal(2), false, 7),
	new achievement("Crazy Eight", "Reach Tier 8", "starting number", new Decimal(2), false, 7),
	new achievement("Nine Lives", "Reach Tier 9", "starting number", new Decimal(2), false, 7),
	new achievement("Extra Inning", "Reach Tier 10", "starting number", new Decimal(2), false, 7),
	new achievement("Eleven Pipers Piping", "Reach Tier 11", "starting number", new Decimal(3), false, 8),
	new achievement("Zodiac", "Reach Tier 12", "starting number", new Decimal(3), false, 8),
	new achievement("Friday the 13th", "Reach Tier 13", "starting number", new Decimal(3), false, 8),
	new achievement("Minotaur Feast", "Reach Tier 14", "starting number", new Decimal(3), false, 8),
	new achievement("Shor's First test", "Reach Tier 15", "starting number", new Decimal(3), false, 8),
	new achievement("Increased Potential", "Overload Once", "factor juice", new Decimal(1.05), true, 6),
	new achievement("Too OP", "Overload twice", "factor juice", new Decimal(1.05), true, 7),
	new achievement("Over 9000", "Overload 10 times", "factor juice", new Decimal(1.05), true, 8),
	new achievement("One for the dark lord on his dark throne", "Complete Challenge 1", "charger speed", new Decimal(1.02), true, 7),
	new achievement("Three for the Elven kings under the sky", "Complete Challenge 3", "charger speed", new Decimal(1.02), true, 7),
	new achievement("Seven for the dwarf lords in their halls of stone", "Complete Challenge 7", "charger speed", new Decimal(1.02), true, 7),
	new achievement("Nine for the Mortal Men doomed to die", "Complete Challenge 9", "charger speed", new Decimal(1.02), true, 7),	
	new achievement("In the land of Mordor where the Shadows Lie", "Complete Challenge 10", "charger speed", new Decimal(1.02), true, 7),//77
	new achievement("Selling Quilts at Discount Price", "Sacrifice for 2500 NP at once", "np gain", new Decimal(1.05), true, 6),
	new achievement("Technologically impaired", "Sacrifice for 10000 NP at once", "np gain", new Decimal(1.05), true, 7),
	new achievement("milkin' cows at 4:30", "Sacrifice for 25000 NP at once", "np gain", new Decimal(1.05), true, 7),
	new achievement("Huger Number", "Have 1e16 number", "number from producers", new Decimal(1.1), true, 7),//reward and unlock not implemented yet from here on
	new achievement("Crazier Production", "Make a total of 1e16 number", "number", new Decimal(1.05), true, 7)
	//stretch once achievement "bursting at the seams"
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
		if(player.sacrifice.factorshandler.unlocked){
			this.makevisible(5);
		}
		if(player.sacrifice.factorshandler.factorizersbought.gte(2)){
			this.makevisible(6);
		}
		if(player.overload.timesoverloaded.gte(1)){
			this.makevisible(7);
		}
		if(player.highesttier >= 10){
			this.makevisible(8);
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
	get numCompleted(){
		num = 0;
		for(var i = 0; i < this.achievements.length; i++){
			if(this.achievements[i].unlocked){
				num ++;
			}
		}
		return num;
	},
	achievementBonus(bonustype, ismult){
		var mult = new Decimal(1);
		var bonus = new Decimal(0);
		for(var i = 0; i < this.achievements.length; i++){
			if(this.achievements[i].rewardtype == bonustype){
				if(this.achievements[i].ismult){
					mult = mult.mul(this.achievements[i].reward);
				}else{
					bonus = bonus.plus(this.achievements[i].reward);
				}
			}
		}
		if(ismult){
			return mult;
		}else{
			return bonus;
		}
	}
}
