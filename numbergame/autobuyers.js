class autobuyer{
	constructor(thingtobuy, basefrequency){
		this.thingtobuy = thingtobuy;
		this.basefrequency = basefrequency;
		this.unlocked = false;
		this.timeleft = new Decimal(0);
		this.active = true;
	}
	get charges(){
		return Decimal.floor(this.timeleft.div(this.basefrequency));
	}
	update(timetoadd){
		if(this.active == false){
			this.timeleft = new Decimal(0);
			return;
		}
		this.timeleft = this.timeleft.plus(timetoadd.mul(this.speedboost));	
		if(this.timeleft.gte(this.basefrequency)){
			var chargestouse = this.charges;
			this.timeleft = this.timeleft.sub(this.basefrequency.mul(chargestouse));
			this.timeleft = this.timeleft.plus(this.thingtobuy(chargestouse));
		}
	}
	get speedboost(){
		var boost = new Decimal(1);
		return boost;
	}
	get activatebuttontext(){
		if(this.active){
			return "ON";
		}else{
			return "OFF";
		}
	}
	toggleactive(){
		if(this.active == false){
			this.active = true;
		}else{
			this.active = false;
		}
	}
	get activationtimetext(){
		if(this.speedboost.gte(this.basefrequency)){
			return format(this.speedboost.div(this.basefrequency)) + " times per second";
		}else{
			return "once every " + timeformat(this.basefrequency.div(this.speedboost));
		}
	}
	get htmlclass(){
		if(this.unlocked){
			return "displaytext";
		}else{
			return "hidden";
		}
	}
	
}
var autobuyers = {
	autoBuyProducers: function(charges){
		for(var i = 0; i < player.producers.length; i++){
			if(player.producers[i].numaffordable.lte(charges)){
				charges = charges.sub(player.producers[i].numaffordable);
				player.producers[i].buy(player.producers[i].numaffordable);
			}else{
				player.producers[i].buy(charges);
				break;
			}
		}
		return charges;//charges not used
	},
	autoBuyMultipliers: function(charges){
		for(var i = 0; i < player.multipliers.length; i++){
			if(player.multipliers[i].numaffordable.lte(charges)){
				charges = charges.sub(player.multipliers[i].numaffordable);
				player.multipliers[i].buy(player.multipliers[i].numaffordable);
			}else{
				player.multipliers[i].buy(charges);
				break;
			}
		}
		return charges;//charges not used
	},
	autoBuyTierUp: function(charges){
		if(player.timesTierUpable.gte(charges)){
			player.tierUp(charges);
			return new Decimal(0);
		}else{
			console.log(player.timesTierUpable);
			charges = charges.sub(player.timesTierUpable);
			player.tierUp(player.timesTierUpable);
			return charges;
		}
	},
	autoBuySacrifice: function(charges){
		if(player.sacrifice.canSacrifice){
			if(this.autosacrificewhenmaxxed){
				if(player.npmaxxed){
					player.sacrifice.sacrifice();
					return charges.sub(1);
				}
			}else if(this.nprequiredforautosacrifice.gte(player.sacrifice.numericpointsonsacrifice)){
				player.sacrifice.sacrifice();
				return charges.sub(1);
			}
			return charges;
		}
		return charges;
	},
	autoBuyFactorizer: function(charges){
		if(player.sacrifice.factorshandler.canBuyFactorizer){
			player.sacrifice.buyFactorizer();
			return charges.sub(1);
		}
		return charges; //charges not used
	},
	autoBuyRepeatableNPupgrades: function(charges){
	var upgrades = [player.sacrifice.maxclickmultupgrade, player.sacrifice.repeatableclickupgrade, player.sacrifice.repeatablestartingnumberupgrade, player.sacrifice.repeatablenumbermultupgrade, player.sacrifice.repeatablenpmultupgrade];
	for(var i = 0; i < upgrades.length; i++){
		if(upgrades[i].canbuy){
			if(upgrades[i].numaffordable.lte(charges)){
				charges.sub(upgrades[i].numaffordable);
				upgrades[i].buy(upgrades[i].numaffordable);
			}else{
				upgrades[i].buy(charges);
				return new Decimal(0);
			}
		}
	}
	return charges;
	},
	autoBuyMaxNPupgrades: function(charges){
		for(var i = 0; i < player.sacrifice.maxproducerupgrades.length; i++){
		if(player.sacrifice.maxproducerupgrades[i].canbuy){
			if(player.sacrifice.maxproducerupgrades[i].numaffordable.lte(charges)){
				charges.sub(player.sacrifice.maxproducerupgrades[i].numaffordable);
				player.sacrifice.maxproducerupgrades[i].buy(player.sacrifice.maxproducerupgradese[i].numaffordable);
			}else{
				player.sacrifice.maxproducerupgrades[i].buy(charges);
				return new Decimal(0);
			}
		}
		}
		for(var i = 0; i < player.sacrifice.maxmultupgrades.length; i++){
			if(player.sacrifice.maxmultupgrades[i].canbuy){
				if(player.sacrifice.maxmultupgrades[i].numaffordable.lte(charges)){
					charges.sub(player.sacrifice.maxmultupgrades[i].numaffordable);
					player.sacrifice.maxmultupgrades[i].buy(player.sacrifice.maxmultupgradese[i].numaffordable);
				}else{
					player.sacrifice.maxmultupgrades[i].buy(charges);
					return new Decimal(0);
				}
			}
		}
		return charges;
	},
	autoBuyChargers: function(charges){
		for(var i = 0; i < player.chargers.length; i++){
			if(player.chargers[i].numaffordable.lte(charges)){
				charges = charges.sub(player.chargers[i].numaffordable);
				player.chargers[i].buy(player.chargers[i].numaffordable);
			}else{
				player.chargers[i].buy(charges);
				break;
			}
		}
		return charges;//charges not used
	},
	addAutobuyers(){
		this.producerautobuyer = new autobuyer(this.autoBuyProducers, new Decimal(30));
		this.multiplierautobuyer = new autobuyer(this.autoBuyMultipliers, new Decimal(30));
		this.tierupautobuyer = new autobuyer(this.autoBuyTierUp, new Decimal(300));
		this.chargerautobuyer = new autobuyer(this.autoBuyChargers, new Decimal(30));
		this.sacrificeautobuyer = new autobuyer(this.autoBuySacrifice, new Decimal(1800));
		this.factorizerautobuyer = new autobuyer(this.autoBuyFactorizer, new Decimal(3600));
		this.repeatablenpupgradeautobuyer = new autobuyer(this.autoBuyRepeatableNPupgrades, new Decimal(3600));
		this.maxnpupgradeautobuyer = new autobuyer(this.autoBuyMaxNPupgrades, new Decimal(3600));
	},
	get nprequiredforautosacrifice(){
		if(new Decimal(document.getElementById('nprequiredforautosacrifice').value) == undefined || document.getElementById('nprequiredforautosacrifice').value == ""){
			return new Decimal(0);
		}
		try{
			return new Decimal(document.getElementById('nprequiredforautosacrifice').value);
		}catch{
			return new Decimal(0);
		}
	},
	get autosacrificewhenmaxxed(){
		if(document.getElementById('autosacrificewhenmaxxedcheckbox').checked == true){
			return true;
		}
		return false;;
	},
	checkautobuyerunlocks(){
		if(player.overload.milestones[2].unlocked){
			this.producerautobuyer.unlocked = true;
		}
		if(player.overload.milestones[3].unlocked){
			this.multiplierautobuyer.unlocked = true;
		}
		if(player.overload.milestones[4].unlocked){
			this.tierupautobuyer.unlocked = true;
		}
		if(player.overload.milestones[5].unlocked){
			this.sacrificeautobuyer.unlocked = true;
		}
		if(player.overload.milestones[6].unlocked){
			this.factorizerautobuyer.unlocked = true;
		}
		if(player.overload.milestones[7].unlocked){
			this.maxnpupgradeautobuyer.unlocked = true;
		}
		if(player.overload.milestones[8].unlocked){
			this.repeatablenpupgradeautobuyer.unlocked = true;
		}
		if(player.overload.milestones[9].unlocked){
			this.chargerautobuyer.unlocked = true;
		}
	}
	
	
}
autobuyers.addAutobuyers();
