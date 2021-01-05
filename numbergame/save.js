class savedata {
	constructor(player, sacrifice){
		this.data = {
			saveversion: 5,
			number: player.number,
			totalnumberproduced: player.totalnumberproduced,
			tier: player.tier,
			highesttier: player.highesttier,
			producers: [],
			multipliers: [],
			chargers: [],
			chargersbought: [],
			chargermults: [],
			clickingmultiplier: getmultipliersave(player.clickingmultiplier),
			lastupdate: player.lastupdate,
			clicks: player.clicks,
			sacrifice: {
				unlocked: sacrifice.unlocked,
				numericpoints: sacrifice.numericpoints,
				maxmultupgrades: [],
				maxproducerupgrades: [],
				maxclickmultupgrade: getsacrificeupgradesave(sacrifice.maxclickmultupgrade),
				repeatableclickupgrade: getsacrificeupgradesave(sacrifice.repeatableclickupgrade),
				repeatablestartingnumberupgrade: getsacrificeupgradesave(sacrifice.repeatablestartingnumberupgrade),
				repeatablenumbermultupgrade: getsacrificeupgradesave(sacrifice.repeatablenumbermultupgrade),
				repeatablenpmultupgrade: getsacrificeupgradesave(sacrifice.repeatablenpmultupgrade),
				timessacrificed: sacrifice.timessacrificed,
				timessacrificedthisoverload: sacrifice.timessacrificedthisoverload,
				totalnpgained: sacrifice.totalnpgained,
				factorshandler: {
					unlocked: player.sacrifice.factorshandler.unlocked,
					factorjuice: player.sacrifice.factorshandler.factorjuice,
					totalfactorjuicegained: player.sacrifice.factorshandler.totalfactorjuicegained,
					factorizers: player.sacrifice.factorshandler.factorizers,
					factorizersbought: player.sacrifice.factorshandler.factorizersbought,
					factors: [],
					factorsunlocked: []
				}
			},
			achievementshandler: {
				achievements: [],
				achievementvisibility: []
			},
			overload: {
				unlocked: player.overload.unlocked,
				timesoverloaded: player.overload.timesoverloaded,
				besttimesoverloaded: player.overload.besttimesoverloaded,
				overloadPoints: player.overload.overloadPoints,
				overloadPointsEarned: player.overload.overloadPointsEarned,
				overloadupgradetable: {
					columns: [
						
					]
				},
				challenges: {
					completions: [],
					active: []
				},
				milestones: []
			}
		};
		for(var i = 0; i < player.producers.length; i++){
			this.data.producers.push(getproducersave(player.producers[i]));
		}
		for(var i = 0; i < player.multipliers.length; i++){
			this.data.multipliers.push(getmultipliersave(player.multipliers[i]));
		}
		for(var i = 0; i < sacrifice.maxproducerupgrades.length; i++){
			this.data.sacrifice.maxproducerupgrades.push(getsacrificeupgradesave(sacrifice.maxproducerupgrades[i]));
		}
		for(var i = 0; i < sacrifice.maxmultupgrades.length; i++){
			this.data.sacrifice.maxmultupgrades.push(getsacrificeupgradesave(sacrifice.maxmultupgrades[i]));
		}
		for(var i = 0; i < player.achievementshandler.achievements.length; i++){
			this.data.achievementshandler.achievements.push(player.achievementshandler.achievements[i].unlocked);
		}
		for(var i = 0; i < player.achievementshandler.achievements.length; i++){
			this.data.achievementshandler.achievementvisibility.push(player.achievementshandler.achievements[i].visible);
		}
		for(var i = 0; i < sacrifice.factorshandler.factors.length; i++){
			this.data.sacrifice.factorshandler.factors.push(sacrifice.factorshandler.factors[i].numbought);
			this.data.sacrifice.factorshandler.factorsunlocked.push(sacrifice.factorshandler.factors[i].unlocked);
		}
		for(var i = 0; i < player.overload.overloadupgradetable.columns.length; i++){
			var column = [];
			for(var j = 0; j < player.overload.overloadupgradetable.columns[i].length; j++){
				column.push(player.overload.overloadupgradetable.columns[i][j].bought);
			}
			this.data.overload.overloadupgradetable.columns.push(column);
		}
		for(var i = 0; i < player.overload.challenges.length; i++){
			this.data.overload.challenges.completions.push(player.overload.challenges[i].completions);
			this.data.overload.challenges.active.push(player.overload.challenges[i].active);
		}
		for(var i = 0; i < player.overload.milestones.length; i++){
			this.data.overload.milestones.push(player.overload.milestones[i].unlocked);
		}
		for(var i = 0; i < player.chargers.length; i++){
			this.data.chargers.push(player.chargers[i].amount);
			this.data.chargermults.push(player.chargers[i].mult);
			this.data.chargersbought.push(player.chargers[i].bought);
		}
	}
}
function getproducersave(producer){
	return {
		basecost: producer.basecost,
		baseproduction: producer.baseproduction,
		numericpointvalue: producer.numericpointvalue,
		amount: producer.amount,
		bought: producer.bought,
		tier: producer.tier
	}
}
function getmultipliersave(multiplier){
	if(multiplier == null){
			return null;
	}
	return {
		basecost: multiplier.basecost,
		scaling: multiplier.scaling,
		_maxnum: multiplier._maxnum,
		amount: multiplier.amount,
		bought: multiplier.bought,
		tier: multiplier.tier,
		mult: multiplier.mult
	}
}
function getsacrificeupgradesave(upgrade){
	return {
		amount: upgrade.amount
	}
}
function loaddata(savedata, game){
	if(savedata.data.saveversion >= 1){
		game.player.number = new Decimal(savedata.data.number);
		game.player.tier = new Decimal(savedata.data.tier);
		game.player.highesttier = new Decimal(savedata.data.highesttier);
		game.player.producers = [];
		game.player.multipliers = [];
		game.player.chargers = [];
		for(var i = 0; i < savedata.data.multipliers.length; i++){
			game.player.multipliers.push(loadmultiplier(savedata.data.multipliers[i]));
		}
		for(var i = 0; i < savedata.data.producers.length; i++){
			game.player.producers.push(loadproducer(savedata.data.producers[i], game.player.multipliers[i]));
		}
		game.player.lastupdate = savedata.data.lastupdate;
		game.player.sacrifice.unlocked = savedata.data.sacrifice.unlocked;
		if(sacrifice.unlocked){
			game.unlockmenu("sacrificemenubutton");
		}
		game.player.sacrifice.numericpoints = new Decimal(savedata.data.sacrifice.numericpoints);
		game.player.sacrifice.sacrificed = savedata.data.sacrifice.sacrificed;
		game.player.sacrifice.addmaxupgrades(game.player.highesttier);
		for(var i = 0; i < savedata.data.sacrifice.maxmultupgrades.length; i++){
			game.player.sacrifice.maxmultupgrades[i].amount = new Decimal(savedata.data.sacrifice.maxmultupgrades[i].amount);
		}
		for(var i = 0; i < savedata.data.sacrifice.maxproducerupgrades.length; i++){
			game.player.sacrifice.maxproducerupgrades[i].amount = new Decimal(savedata.data.sacrifice.maxproducerupgrades[i].amount);
		}
		game.player.sacrifice.repeatableclickupgrade.amount = new Decimal(savedata.data.sacrifice.repeatableclickupgrade.amount);
		game.player.sacrifice.repeatablestartingnumberupgrade.amount = new Decimal(savedata.data.sacrifice.repeatablestartingnumberupgrade.amount);
		game.player.sacrifice.repeatablenumbermultupgrade.amount = new Decimal(savedata.data.sacrifice.repeatablenumbermultupgrade.amount);
		game.player.sacrifice.repeatablenpmultupgrade.amount = new Decimal(savedata.data.sacrifice.repeatablenpmultupgrade.amount);
	}
	while(game.player.chargers.length < game.player.producers.length){
		game.player.chargers.push(makecharger(game.player.chargers.length));
	}
	if(savedata.data.saveversion >= 2){//achievement update
		game.player.clicks = new Decimal(savedata.data.clicks);
		game.player.sacrifice.timessacrificed = new Decimal(savedata.data.sacrifice.timessacrificed);
		for(var i = 0; i < savedata.data.achievementshandler.achievements.length; i++){
			game.player.achievementshandler.achievements[i].unlocked = savedata.data.achievementshandler.achievements[i];
		}
	}
	if(savedata.data.saveversion >= 3){//Version 0.2.2
		for(var i = 0; i < savedata.data.achievementshandler.achievementvisibility.length; i++){
			game.player.achievementshandler.achievements[i].visible = savedata.data.achievementshandler.achievementvisibility[i];
		}
		game.player.totalnumberproduced = new Decimal(savedata.data.totalnumberproduced);
		game.player.sacrifice.totalnpgained = new Decimal(savedata.data.sacrifice.totalnpgained);
	}
	if(savedata.data.saveversion >= 4){//factors update
		game.player.sacrifice.timessacrificedthisoverload = new Decimal(savedata.data.sacrifice.timessacrificedthisoverload);
		if(savedata.data.sacrifice.factorshandler.unlocked){
			game.unlockmenu("factorsmenubutton");
			document.getElementById("unlockfactors").style.display = "none";
			game.player.sacrifice.factorshandler.unlocked = true;
		}
		game.player.sacrifice.factorshandler.factorjuice = new Decimal(savedata.data.sacrifice.factorshandler.factorjuice);
		game.player.sacrifice.factorshandler.totalfactorjuicegained = new Decimal(savedata.data.sacrifice.factorshandler.totalfactorjuicegained);
		game.player.sacrifice.factorshandler.factorizers = new Decimal(savedata.data.sacrifice.factorshandler.factorizers);
		game.player.sacrifice.factorshandler.factorizersbought = new Decimal(savedata.data.sacrifice.factorshandler.factorizersbought);
		for(var i = 0; i < savedata.data.sacrifice.factorshandler.factors.length; i++){
			game.player.sacrifice.factorshandler.factors[i].numbought = new Decimal(savedata.data.sacrifice.factorshandler.factors[i]);
			game.player.sacrifice.factorshandler.factors[i].unlocked = savedata.data.sacrifice.factorshandler.factorsunlocked[i];
		}
	}
	if(savedata.data.saveversion >= 5){
		if(savedata.data.clickingmultiplier != null){
			game.player.clickingmultiplier = new multiplier(new Decimal(10), new Decimal(5), null);
			game.player.clickingmultiplier.amount = new Decimal(savedata.data.clickingmultiplier.amount);
			game.player.clickingmultiplier.bought = new Decimal(savedata.data.clickingmultiplier.bought);
		}
		game.player.sacrifice.maxclickmultupgrade.amount = new Decimal(savedata.data.sacrifice.maxclickmultupgrade.amount);
		game.player.overload.unlocked = savedata.data.overload.unlocked;
		game.player.overload.timesoverloaded = new Decimal(savedata.data.overload.timesoverloaded);
		game.player.overload.besttimesoverloaded = new Decimal(savedata.data.overload.besttimesoverloaded);
		game.player.overload.overloadPoints = new Decimal(savedata.data.overload.overloadPoints);
		game.player.overload.overloadPointsEarned = new Decimal(savedata.data.overload.overloadPointsEarned);
		for( var i = 0; i < savedata.data.overload.overloadupgradetable.columns.length; i++){
			for(var j = 0; j < savedata.data.overload.overloadupgradetable.columns[i].length; j++){
				game.player.overload.overloadupgradetable.columns[i][j].bought = savedata.data.overload.overloadupgradetable.columns[i][j];
			}
		}
		for(var i = 0; i < savedata.data.overload.challenges.completions.length; i++){
			game.player.overload.challenges[i].completions = new Decimal(savedata.data.overload.challenges.completions[i]);
		}
		for(var i = 0; i < savedata.data.overload.challenges.active.length; i++){
			game.player.overload.challenges[i].active = savedata.data.overload.challenges.active[i];
		}
		for(var i = 0; i < savedata.data.overload.milestones.length; i++){
			game.player.overload.milestones[i].unlocked = savedata.data.overload.milestones[i];
		}
		if(game.player.overload.unlocked){
			game.unlockmenu("overloadmenubutton")
			game.unlockmenu("overloadupgrademenubutton")
			game.unlockmenu("challengestabbutton")
			game.unlockmenu("overloadmilestonesbutton")
			game.unlockmenu("overloadautobuyersmenubutton")
		}
		for(var i = 0; i < savedata.data.chargers.length; i++){
			game.player.chargers[i].amount = new Decimal(savedata.data.chargers[i]);
		}
		for(var i = 0; i < savedata.data.chargersbought.length; i++){
			game.player.chargers[i].bought = new Decimal(savedata.data.chargersbought[i]);
		}
		for(var i = 0; i < savedata.data.chargermults.length; i++){
			game.player.chargers[i].mult = new Decimal(savedata.data.chargermults[i]);
		}
	}
	
}
function loadproducer(producersave, multiplier){
	loadedproducer = createProducer(producersave.tier, multiplier);
	loadedproducer.amount = new Decimal(producersave.amount);
	loadedproducer.bought = new Decimal(producersave.bought);
	return loadedproducer;
}
function loadmultiplier(multipliersave){
	loadedmultiplier = createMultiplier(multipliersave.tier);
	loadedmultiplier.amount = new Decimal(multipliersave.amount);
	loadedmultiplier.bought = new Decimal(multipliersave.bought);
	return loadedmultiplier;
}
function save(){
	window.localStorage.setItem('save', JSON.stringify(new savedata(game.player, game.player.sacrifice)));
}
function load(){
	loaddata(JSON.parse(window.localStorage.getItem('save')), game);
}
function saveToClipboard(){
	var copyText = JSON.stringify(new savedata(game.player, game.player.sacrifice));
	alert("Your save is: " + copyText);
}
function loadFromPastedSave(){
		console.log(document.getElementById("savebox").value);
		loaddata(JSON.parse(document.getElementById("savebox").value), game);
}
load();
setInterval(save, 30000);
