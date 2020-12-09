class savedata {
	constructor(player, sacrifice){
		this.data = {
			saveversion: 3,
			number: player.number,
			totalnumberproduced: player.totalnumberproduced,
			tier: player.tier,
			highesttier: player.highesttier,
			producers: [],
			multipliers: [],
			lastupdate: player.lastupdate,
			clicks: player.clicks,
			sacrifice: {
				unlocked: sacrifice.unlocked,
				numericpoints: sacrifice.numericpoints,
				maxmultupgrades: [],
				maxproducerupgrades: [],
				repeatableclickupgrade: getsacrificeupgradesave(sacrifice.repeatableclickupgrade),
				repeatablestartingnumberupgrade: getsacrificeupgradesave(sacrifice.repeatablestartingnumberupgrade),
				repeatablenumbermultupgrade: getsacrificeupgradesave(sacrifice.repeatablenumbermultupgrade),
				repeatablenpmultupgrade: getsacrificeupgradesave(sacrifice.repeatablenpmultupgrade),
				timessacrificed: sacrifice.timessacrificed,
				totalnpgained: sacrifice.totalnpgained
			},
			achievementshandler: {
				achievements: [],
				achievementvisibility: []
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
		game.player.number = savedata.data.number;
		game.player.tier = savedata.data.tier;
		game.player.highesttier = savedata.data.highesttier;
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
		game.player.sacrifice.numericpoints = savedata.data.sacrifice.numericpoints;
		game.player.sacrifice.sacrificed = savedata.data.sacrifice.sacrificed;
		game.player.sacrifice.addmaxupgrades(game.player.highesttier);
		for(var i = 0; i < savedata.data.sacrifice.maxmultupgrades.length; i++){
			game.player.sacrifice.maxmultupgrades[i].amount = savedata.data.sacrifice.maxmultupgrades[i].amount;
		}
		for(var i = 0; i < savedata.data.sacrifice.maxproducerupgrades.length; i++){
			game.player.sacrifice.maxproducerupgrades[i].amount = savedata.data.sacrifice.maxproducerupgrades[i].amount;
		}
		game.player.sacrifice.repeatableclickupgrade.amount = savedata.data.sacrifice.repeatableclickupgrade.amount;
		game.player.sacrifice.repeatablestartingnumberupgrade.amount = savedata.data.sacrifice.repeatablestartingnumberupgrade.amount;
		game.player.sacrifice.repeatablenumbermultupgrade.amount = savedata.data.sacrifice.repeatablenumbermultupgrade.amount;
		game.player.sacrifice.repeatablenpmultupgrade.amount = savedata.data.sacrifice.repeatablenpmultupgrade.amount;
	}
	if(savedata.data.saveversion >= 2){//achievement update
		game.player.clicks = savedata.data.clicks;
		game.player.sacrifice.timessacrificed = savedata.data.sacrifice.timessacrificed;
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
}
function loadproducer(producersave, multiplier){
	loadedproducer = createProducer(producersave.tier, multiplier);
	loadedproducer.amount = producersave.amount;
	loadedproducer.bought = producersave.bought;
	return loadedproducer;
}
function loadmultiplier(multipliersave){
	loadedmultiplier = createMultiplier(multipliersave.tier);
	loadedmultiplier.amount = multipliersave.amount;
	loadedmultiplier.bought = multipliersave.bought;
	return loadedmultiplier;
}
function save(){
	window.localStorage.setItem('save', JSON.stringify(new savedata(game.player, game.player.sacrifice)));
}
function load(){
	loaddata(JSON.parse(window.localStorage.getItem('save')), game);
}
