class savedata {
	constructor(player, sacrifice){
		this.data = {
			saveversion: 1,
			number: player.number,
			tier: player.tier,
			highesttier: player.highesttier,
			producers: [],
			multipliers: [],
			lastupdate: player.lastupdate,
			sacrifice: {
				unlocked: sacrifice.unlocked,
				numericpoints: sacrifice.numericpoints,
				maxmultupgrades: [],
				maxproducerupgrades: [],
				repeatableclickupgrade: getsacrificeupgradesave(sacrifice.repeatableclickupgrade),
				repeatablestartingnumberupgrade: getsacrificeupgradesave(sacrifice.repeatablestartingnumberupgrade),
				repeatablenumbermultupgrade: getsacrificeupgradesave(sacrifice.repeatablenumbermultupgrade),
				repeatablenpmultupgrade: getsacrificeupgradesave(sacrifice.repeatablenpmultupgrade)
			}
		}
		for(var i = 0; i < player.producers.length; i++){
			this.data.producers.push(getproducersave(player.producers[i]));
		}
		for(var i = 0; i < player.multipliers.length; i++){
			this.data.multipliers.push(getmultipliersave(player.multipliers[i]));
		}
		for(var i = 0; i < sacrifice.maxproducerupgrades.length; i++){
			this.data.sacrifice.maxproducerupgrades.push(getsacrificeupgradesave(sacrifice.maxproducerupgradess[i]));
		}
		for(var i = 0; i < sacrifice.maxmultupgrades.length; i++){
			this.data.sacrifice.maxmultupgrades.push(getsacrificeupgradesave(sacrifice.maxmultupgrades[i]));
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
function getmultipliersave(multiplier)[
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
function load(savedata, game){
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
		game.player.sacrifice.numericpoints = savedata.data.sacrifice.numericpoints;
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
}
function loadproducer(producersave, multiplier){
	producer = new producer(producersave.basecost, producersave.baseproduction, producersave.numericpointvalue, multiplier, producersave.tier);
	producer.amount = producersave.amount;
	producer.bought = producersave.bought;
	return producer;
}
function loadmultiplier(multipliersave){
	multiplier = new multiplier(multipliersave.basecost, multipliersave,scaling, multipliersave.tier);
	multiplier.amount = multipliersave.amount;
	multiplier.bought = multipliersave.bought;
	return multiplier;
}
