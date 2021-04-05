var player = {
	_selectedupgrade: "More Coins I",
	variables: {
		
	},
	bonuses: [],
	upgrades: {
		
	},
	getbonus: function(bonustype){
		var gotbonus = new Decimal(1);
		for(let i = 0; i < this.bonuses.length; i++){
			if(this.bonuses[i].bonustype == bonustype){
			    gotbonus = gotbonus.mul(this.bonuses[i].func());
			}
		}
		return gotbonus;
	},
	getvar(name){
	    let variable = this.variables[name];
        if(variable.calculated == true){
			return variable.basefunc().mul(this.getbonus(name));
		}else{
			return variable.amount;
		}			
	},
	getrawvar(name){
		return this.variables[name];
	},
	buyproducer1: function(){
		if(this.getvar("coins").gte(this.getvar("producer1cost"))){
			this.getrawvar("coins").amount = this.getrawvar("coins").amount.sub(this.getvar("producer1cost"));
			this.getrawvar("producer1bought").amount = this.getrawvar("producer1bought").amount.plus(1);
		}
	},
	buyproducer2: function(){
		if(this.getvar("coins").gte(this.getvar("producer2cost"))){
			this.getrawvar("coins").amount = this.getrawvar("coins").amount.sub(this.getvar("producer2cost"));
			this.getrawvar("producer2bought").amount = this.getrawvar("producer2bought").amount.plus(1);
		}
	},
	buyproducer3: function(){
		if(this.getvar("coins").gte(this.getvar("producer3cost"))){
			this.getrawvar("coins").amount = this.getrawvar("coins").amount.sub(this.getvar("producer3cost"));
			this.getrawvar("producer3bought").amount = this.getrawvar("producer3bought").amount.plus(1);
		}
	},
	buyproducer4: function(){
		if(this.getvar("coins").gte(this.getvar("producer4cost"))){
			this.getrawvar("coins").amount = this.getrawvar("coins").amount.sub(this.getvar("producer4cost"));
			this.getrawvar("producer4bought").amount = this.getrawvar("producer4bought").amount.plus(1);
		}
	},
	setselectedupgrade: function(name){
		this._selectedupgrade = name;	
	},
	get selectedupgrade(){
		return this.upgrades[this._selectedupgrade];
	},
	purchaseselectedupgrade(){
		this.selectedupgrade.buy();
	},
	changevar(name, amount){
		this.getrawvar(name).amount = this.getrawvar(name).amount.plus(amount);
	},
	setvar(name, amount){
		this.getrawvar(name).amount = amount;
	},
	prestige(){
		if(this.getvar("stonesonreset").gte(new Decimal(1))){
			this.changevar("stones", this.getvar("stonesonreset").floor());
			this.reseteverythingprestigedoes();
		}
	},
	reseteverythingprestigedoes(){
		this.setvar("coins", new Decimal(10));
		this.setvar("producer1bought", new Decimal(0));
		this.setvar("producer2bought", new Decimal(0));
		this.setvar("producer3bought", new Decimal(0));
		this.setvar("producer4bought", new Decimal(0));
		for(const property in this.upgrades){
			if(this.upgrades[property].costvar == "coins"){
				this.upgrades[property].levels = new Decimal(0);
			}
		}
	}
}
new accumulatingvariable("coins", new Decimal(10));
new accumulatingvariable("producer1bought", new Decimal(0));
new accumulatingvariable("producer2bought", new Decimal(0));
new accumulatingvariable("producer3bought", new Decimal(0));
new accumulatingvariable("producer4bought", new Decimal(0));
new calculatedvariable("producer1count", function(){ let amount = player.getvar("producer1bought"); return amount;});
new calculatedvariable("producer2count", function(){ let amount = player.getvar("producer2bought"); return amount;});
new calculatedvariable("producer3count", function(){ let amount = player.getvar("producer3bought"); return amount;});
new calculatedvariable("producer4count", function(){ let amount = player.getvar("producer4bought"); return amount;});
new calculatedvariable("producer1cps", function(){ let amount = new Decimal(1).mul(player.getvar("producer1count")); return amount;});
new calculatedvariable("producer2cps", function(){ let amount = new Decimal(5).mul(player.getvar("producer2count")); return amount;});
new calculatedvariable("producer3cps", function(){ let amount = new Decimal(25).mul(player.getvar("producer3count")); return amount;});
new calculatedvariable("producer4cps", function(){ let amount = new Decimal(125).mul(player.getvar("producer4count")); return amount;});
new calculatedvariable("coinspersecond", function(){ return player.getvar("producer1cps").plus(player.getvar("producer2cps")).plus(player.getvar("producer3cps")).plus(player.getvar("producer4cps"));});
new calculatedvariable("producer1cost", function(){ if(player.getvar("producer1count").lte(new Decimal(100))){ return new Decimal(2).pow(player.getvar("producer1bought")).mul(10); }else{ return new Decimal(2).pow(player.getvar("producer1bought").sub(100).pow(2).plus(100)).mul(10);}});
new calculatedvariable("producer2cost", function(){ if(player.getvar("producer2count").lte(new Decimal(100))){ return new Decimal(5).pow(player.getvar("producer2bought")).mul(1000); }else{ return new Decimal(5).pow(player.getvar("producer2bought").sub(100).pow(2).plus(100)).mul(1000);}});
new calculatedvariable("producer3cost", function(){ if(player.getvar("producer3count").lte(new Decimal(100))){ return new Decimal(10).pow(player.getvar("producer3bought")).mul(1000000); }else{ return new Decimal(10).pow(player.getvar("producer3bought").sub(100).pow(2).plus(100)).mul(1000000);}});
new calculatedvariable("producer4cost", function(){ if(player.getvar("producer4count").lte(new Decimal(100))){ return new Decimal(25).pow(player.getvar("producer4bought")).mul(1000000000000); }else{ return new Decimal(25).pow(player.getvar("producer4bought").sub(100).pow(2).plus(100)).mul(1000000000000);}});

new upgrade("More Coins I", "Gain +1x more coins per level, from all sources!", "coins", function(bought){return new Decimal(10).pow(bought.plus(3));}, Decimal.Infinity);
new bonus("coinspersecond", function(){return new Decimal(1).plus(player.upgrades["More Coins I"].levels);});

new upgrade("Better Producer 1 I", "Gain 5x as many coins from producer 1", "coins", function(bought){return new Decimal(50);}, new Decimal(1));
new bonus("producer1cps", function(){return new Decimal(1).plus(player.upgrades["Better Producer 1 I"].levels.mul(4));});

new upgrade("Better Producer 2 I", "Gain 5x as many coins from producer 2", "coins", function(bought){return new Decimal(25000);}, new Decimal(1));
new bonus("producer2cps", function(){return new Decimal(1).plus(player.upgrades["Better Producer 2 I"].levels.mul(4));});

new upgrade("Better Producer 3 I", "Gain 5x as many coins from producer 3", "coins", function(bought){return new Decimal(125000000);}, new Decimal(1));
new bonus("producer3cps", function(){return new Decimal(1).plus(player.upgrades["Better Producer 3 I"].levels.mul(4));});

new upgrade("Better Producer 4 I", "Gain 5x as many coins from producer 4", "coins", function(bought){return new Decimal(625000000000000);}, new Decimal(1));
new bonus("producer4cps", function(){return new Decimal(1).plus(player.upgrades["Better Producer 4 I"].levels.mul(4));});

new accumulatingvariable("stones", new Decimal(0));
new calculatedvariable("stonesonreset", function(){return Decimal.max(new Decimal(Decimal.log(player.getvar("coins").div(200), 5)), new Decimal(0));});

new upgrade("More Producer 1 I", "10% more producer 1 per level", "stones", function(bought){return new Decimal(bought).plus(1);}, new Decimal(10));
new  bonus("producer1count", function(){return new Decimal(1).plus(new Decimal(0.1).mul(player.upgrades["More Producer 1 I"].levels));});
new upgrade("More Producer 2 I", "10% more producer 2 per level", "stones", function(bought){return new Decimal(bought).plus(1).mul(5);}, new Decimal(10));
new  bonus("producer2count", function(){return new Decimal(1).plus(new Decimal(0.1).mul(player.upgrades["More Producer 2 I"].levels));});
new upgrade("More Producer 3 I", "10% more producer 3 per level", "stones", function(bought){return new Decimal(bought).plus(1).mul(25);}, new Decimal(10));
new  bonus("producer3count", function(){return new Decimal(1).plus(new Decimal(0.1).mul(player.upgrades["More Producer 3 I"].levels));});
new upgrade("More Producer 4 I", "10% more producer 4 per level", "stones", function(bought){return new Decimal(bought).plus(1).mul(125);}, new Decimal(10));
new  bonus("producer4count", function(){return new Decimal(1).plus(new Decimal(0.1).mul(player.upgrades["More Producer 4 I"].levels));});
new upgrade("More Coins II", "Gain +1x coins per level, from all sources!", "stones", function(bought){return new Decimal(2).pow(bought);}, Decimal.Infinity);
new bonus("coinspersecond", function(){return new Decimal(1).plus(player.upgrades["More Coins II"].levels);});

new upgrade("Producer 1 boosts Producer 2", "Gain +2% producer 2 cps per producer 1 bought per level", "stones", function(bought){return new Decimal(1.2).pow(bought);}, new Decimal(25));
new bonus("producer2cps", function(){return new Decimal(1).plus(new Decimal(0.02).mul(player.upgrades["Producer 1 boosts Producer 2"].levels).mul(player.getvar("producer1bought")));});

new upgrade("Producer 2 boosts Producer 3", "Gain +2% producer 3 cps per producer 2 bought per level", "stones", function(bought){return new Decimal(1.2).pow(bought).mul(10);}, new Decimal(25));
new bonus("producer3cps", function(){return new Decimal(1).plus(new Decimal(0.02).mul(player.upgrades["Producer 2 boosts Producer 3"].levels).mul(player.getvar("producer2bought")));});

new upgrade("Producer 3 boosts Producer 4", "Gain +2% producer 4 cps per producer 3 bought per level", "stones", function(bought){return new Decimal(1.2).pow(bought).mul(1000);}, new Decimal(25));
new bonus("producer4cps", function(){return new Decimal(1).plus(new Decimal(0.02).mul(player.upgrades["Producer 3 boosts Producer 4"].levels).mul(player.getvar("producer3bought")));});

new upgrade("Cheaper Producers", "Producers cost 10% less per level", "stones", function(bought){return new Decimal(5).plus(bought);}, new Decimal(100));
new bonus("producer1cost", function(){return new Decimal(0.9).pow(player.upgrades["Cheaper Producers"].levels);});
new bonus("producer2cost", function(){return new Decimal(0.9).pow(player.upgrades["Cheaper Producers"].levels);});
new bonus("producer3cost", function(){return new Decimal(0.9).pow(player.upgrades["Cheaper Producers"].levels);});
new bonus("producer4cost", function(){return new Decimal(0.9).pow(player.upgrades["Cheaper Producers"].levels);});

new upgrade("More Stones I", "Gain +1x more stones per level", "coins", function(bought){return new Decimal(10).pow(new Decimal(1.2).pow(bought)).mul(1000);}, new Decimal(999));
new bonus("stonesonreset", function(){return new Decimal(1).plus(player.upgrades["More Stones I"].levels);});
