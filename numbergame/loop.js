function gameLoop(that) {
	var now = Date.now();
	let diff = new Decimal((now - that.player.lastupdate) / 1000)
	that.player.lastupdate = now;
	numbertoadd = Decimal.mul(that.player.numberPerSecond, diff);
	that.addnumber(numbertoadd);
	that.player.sacrifice.addNumericPoints(that.player.sacrifice.numericpointspersecond.mul(diff));
	//check various unlocks
	if(that.player.sacrifice.unlocked == false){
		if(that.player.tier >= 4 && that.player.sacrifice.numericpointsonsacrifice.gte(new Decimal(70))){
			that.player.sacrifice.unlocked = true;
			that.unlockmenu("sacrificemenubutton");
		}
	}
	//milestones
	for(var i = 0; i < player.overload.milestones.length; i++){
		if(player.overload.milestones[i].unlocked == false){
			if(player.overload.timesoverloaded.gte(player.overload.milestones[i].overloads)){
				player.overload.milestones[i].unlocked = true;
			}
		}
	}
	//factor juice
	if(that.player.sacrifice.factorshandler.unlocked){
		that.player.sacrifice.factorshandler.factorjuice = that.player.sacrifice.factorshandler.factorjuice.plus(Decimal.mul(diff, that.player.sacrifice.factorshandler.factorJuicePerSecond));
		that.player.sacrifice.factorshandler.totalfactorjuicegained = that.player.sacrifice.factorshandler.totalfactorjuicegained.plus(Decimal.mul(diff, that.player.sacrifice.factorshandler.factorJuicePerSecond));
	}
	//overload unlock
	if(that.player.overload.unlocked == false && player.overload.canOverload){
		player.overload.unlocked = true;
		game.unlockmenu('overloadmenubutton');
		game.unlockmenu("overloadupgrademenubutton")
		game.unlockmenu("challengestabbutton")
		game.unlockmenu("overloadmilestonesbutton")
		game.unlockmenu("overloadautobuyersmenubutton")
	}
	//challenges
	for(var i = 0; i < player.overload.challenges.length; i++){
		if(player.overload.challenges[i].iscomplete && player.overload.challenges[i].active){
			player.overload.challenges[i].active = false;
			player.overload.challenges[i].completions = player.overload.challenges[i].completions.plus(1);
		}
	}
	//chargers
	for(var i = 0; i < player.chargers.length; i++){
		player.chargers[i].mult = player.chargers[i].mult.plus(player.chargers[i].multpersecond.mul(diff));
	}
	//autobuyers
	that.player.autobuyers.checkautobuyerunlocks();
	if(that.player.autobuyers.producerautobuyer.unlocked){
		that.player.autobuyers.producerautobuyer.update(diff);
	}
	if(that.player.autobuyers.multiplierautobuyer.unlocked){
		that.player.autobuyers.multiplierautobuyer.update(diff);
	}
	if(that.player.autobuyers.tierupautobuyer.unlocked){
		that.player.autobuyers.tierupautobuyer.update(diff);
	}
	if(that.player.autobuyers.chargerautobuyer.unlocked){
		that.player.autobuyers.chargerautobuyer.update(diff);
	}
	if(that.player.autobuyers.sacrificeautobuyer.unlocked){
		that.player.autobuyers.sacrificeautobuyer.update(diff);
	}
	if(that.player.autobuyers.factorizerautobuyer.unlocked){
		that.player.autobuyers.factorizerautobuyer.update(diff);
	}
	if(that.player.autobuyers.repeatablenpupgradeautobuyer.unlocked){
		that.player.autobuyers.repeatablenpupgradeautobuyer.update(diff);
	}
	if(that.player.autobuyers.maxnpupgradeautobuyer.unlocked){
		that.player.autobuyers.maxnpupgradeautobuyer.update(diff);
	}
	that.player.achievementshandler.checkAchievementVisibility();
	//check each achievement's unlock status
	if(that.player.clicks.gte(100)){
		that.player.achievementshandler.completeAchievement(0);
	}
	if(that.player.clicks.gte(250)){
		that.player.achievementshandler.completeAchievement(1);
	}
	if(that.player.clicks.gte(500)){
		that.player.achievementshandler.completeAchievement(2);
	}
	if(that.player.clicks.gte(1000)){
		that.player.achievementshandler.completeAchievement(3);
	}
	if(that.player.clicks.gte(2500)){
		that.player.achievementshandler.completeAchievement(4);
	}
	if(that.player.highesttier.gte(1)){
		that.player.achievementshandler.completeAchievement(5);
	}
	if(that.player.highesttier.gte(2)){
		that.player.achievementshandler.completeAchievement(6);
	}
	if(that.player.highesttier.gte(3)){
		that.player.achievementshandler.completeAchievement(7);
	}
	if(that.player.highesttier.gte(4)){
		that.player.achievementshandler.completeAchievement(8);
	}
	if(that.player.highesttier.gte(5)){
		that.player.achievementshandler.completeAchievement(9);
	}
	if(that.player.sacrifice.timessacrificed >= 1){
		that.player.achievementshandler.completeAchievement(10);
	}
	if(that.player.number.gte(new Decimal("1e4"))){
		that.player.achievementshandler.completeAchievement(11);
	}
	if(that.player.number.gte(new Decimal("1e6"))){
		that.player.achievementshandler.completeAchievement(12);
	}
	if(that.player.number.gte(new Decimal("1e8"))){
		that.player.achievementshandler.completeAchievement(13);
	}
	if(that.player.clicks.gte(5000)){
		that.player.achievementshandler.completeAchievement(14);
	}
	if(that.player.clicks.gte(10000)){
		that.player.achievementshandler.completeAchievement(15);
	}
	if(that.player.clicks.gte(25000)){
		that.player.achievementshandler.completeAchievement(16);
	}
	if(that.player.numberPerSecond.gte(new Decimal("1e4"))){
		that.player.achievementshandler.completeAchievement(19);
	}
	if(that.player.numberPerSecond.gte(new Decimal("1e5"))){
		that.player.achievementshandler.completeAchievement(20);
	}
	if(that.player.sacrifice.timessacrificed >= 10){
		that.player.achievementshandler.completeAchievement(21);
	}
	if(that.player.sacrifice.timessacrificed >= 25){
		that.player.achievementshandler.completeAchievement(22);
	}
	if(player.tier >= 5){//so that all the producers and multipliers exist
		if(player.multipliers[0].amount == 6 && player.multipliers[1].amount == 6 && player.multipliers[2].amount == 6 && player.multipliers[3].amount == 6 && player.multipliers[4].amount == 6){
			player.achievementshandler.completeAchievement(24);
		}
		
		if(player.producers[0].amount == 1 && player.producers[1].amount == 2 && player.producers[2].amount == 3 && player.producers[3].amount == 4 && player.producers[4].amount == 5){
			player.achievementshandler.completeAchievement(28);
		}
	}
	if(that.player.tier <= 2 && that.player.number.gte(new Decimal("1e5"))){
			player.achievementshandler.completeAchievement(27);
	}
	if(that.player.number.gte(new Decimal("1e10"))){
		that.player.achievementshandler.completeAchievement(29);
	}
	if(that.player.totalnumberproduced.gte(new Decimal("1e6"))){
		that.player.achievementshandler.completeAchievement(30);
	}
	if(that.player.totalnumberproduced.gte(new Decimal("1e8"))){
		that.player.achievementshandler.completeAchievement(31);
	}
	if(that.player.totalnumberproduced.gte(new Decimal("1e10"))){
		that.player.achievementshandler.completeAchievement(32);
	}
	if(that.player.totalnumberproduced.gte(new Decimal("1e12"))){
		that.player.achievementshandler.completeAchievement(33);
	}
	if(that.player.number.gte(new Decimal("1e12"))){
		that.player.achievementshandler.completeAchievement(34);
	}
	if(that.player.sacrifice.totalnpgained.gte(new Decimal(1000))){
		that.player.achievementshandler.completeAchievement(35);
	}
	if(that.player.sacrifice.totalnpgained.gte(new Decimal(2500))){
		that.player.achievementshandler.completeAchievement(36);
	}
	if(that.player.sacrifice.totalnpgained.gte(new Decimal(5000))){
		that.player.achievementshandler.completeAchievement(37);
	}
	if(that.player.sacrifice.totalnpgained.gte(new Decimal(10000))){
		that.player.achievementshandler.completeAchievement(38);
	}
	if(that.player.sacrifice.totalnpgained.gte(new Decimal(25000))){
		that.player.achievementshandler.completeAchievement(39);
	}
	if(that.player.sacrifice.factorshandler.totalfactorjuicegained.gte(new Decimal(10))){
		that.player.achievementshandler.completeAchievement(40);
	}
	if(that.player.sacrifice.factorshandler.totalfactorjuicegained.gte(new Decimal(100))){
		that.player.achievementshandler.completeAchievement(41);
	}
	if(that.player.sacrifice.factorshandler.totalfactorjuicegained.gte(new Decimal(1000))){
		that.player.achievementshandler.completeAchievement(42);
	}
	if(that.player.sacrifice.factorshandler.totalfactorjuicegained.gte(new Decimal("1e4"))){
		that.player.achievementshandler.completeAchievement(43);
	}
	if(that.player.sacrifice.factorshandler.totalfactorjuicegained.gte(new Decimal("1e5"))){
		that.player.achievementshandler.completeAchievement(44);
	}
	if(that.player.sacrifice.factorshandler.totalfactorjuicegained.gte(new Decimal("1e6"))){
		that.player.achievementshandler.completeAchievement(45);
	}
	if(that.player.sacrifice.factorshandler.totalfactorjuicegained.gte(new Decimal("1e7"))){
		that.player.achievementshandler.completeAchievement(46);
	}
	if(that.player.sacrifice.factorshandler.factorizersbought.gte(new Decimal(1))){
		that.player.achievementshandler.completeAchievement(47);
	}
	if(that.player.sacrifice.factorshandler.factorizersbought.gte(new Decimal(2))){
		that.player.achievementshandler.completeAchievement(48);
	}
	if(that.player.sacrifice.factorshandler.factorizersbought.gte(new Decimal(3))){
		that.player.achievementshandler.completeAchievement(49);
	}
	if(that.player.sacrifice.factorshandler.factorizersbought.gte(new Decimal(4))){
		that.player.achievementshandler.completeAchievement(50);
	}
	if(that.player.numberPerSecond.gte(new Decimal("1e6"))){
		that.player.achievementshandler.completeAchievement(51);
	}
	if(that.player.numberPerSecond.gte(new Decimal("1e7"))){
		that.player.achievementshandler.completeAchievement(52);
	}
	if(that.player.number.gte(new Decimal("1e14"))){
		that.player.achievementshandler.completeAchievement(53);
	}
	if(that.player.totalnumberproduced.gte(new Decimal("1e14"))){
		that.player.achievementshandler.completeAchievement(54);
	}
	if(that.player.sacrifice.timessacrificed >= 100){
		that.player.achievementshandler.completeAchievement(55);
	}
	if(that.player.sacrifice.timessacrificed >= 250){
		that.player.achievementshandler.completeAchievement(56);
	}
	if(that.player.sacrifice.timessacrificed >= 500){
		that.player.achievementshandler.completeAchievement(57);
	}
	if(that.player.sacrifice.timessacrificed >= 1000){
		that.player.achievementshandler.completeAchievement(58);
	}
	if(that.player.sacrifice.totalnpgained.gte(new Decimal(100000))){
		that.player.achievementshandler.completeAchievement(59);
	}
	if(that.player.highesttier.gte(6)){
		that.player.achievementshandler.completeAchievement(60);
	}
	if(that.player.highesttier.gte(7)){
		that.player.achievementshandler.completeAchievement(61);
	}
	if(that.player.highesttier.gte(8)){
		that.player.achievementshandler.completeAchievement(62);
	}
	if(that.player.highesttier.gte(9)){
		that.player.achievementshandler.completeAchievement(63);
	}
	if(that.player.highesttier.gte(10)){
		that.player.achievementshandler.completeAchievement(64);
	}
	if(that.player.highesttier.gte(11)){
		that.player.achievementshandler.completeAchievement(65);
	}
	if(that.player.highesttier.gte(12)){
		that.player.achievementshandler.completeAchievement(66);
	}
	if(that.player.highesttier.gte(13)){
		that.player.achievementshandler.completeAchievement(67);
	}
	if(that.player.highesttier.gte(14)){
		that.player.achievementshandler.completeAchievement(68);
	}
	if(that.player.highesttier.gte(15)){
		that.player.achievementshandler.completeAchievement(69);
	}
	if(that.player.overload.timesoverloaded.gte(1)){
		that.player.achievementshandler.completeAchievement(70);
	}
	if(that.player.overload.timesoverloaded.gte(2)){
		that.player.achievementshandler.completeAchievement(71);
	}
	if(that.player.overload.timesoverloaded.gte(10)){
		that.player.achievementshandler.completeAchievement(72);
	}
	if(that.player.overload.challenges[0].completions.gte(1)){
		that.player.achievementshandler.completeAchievement(73);
	}
	if(that.player.overload.challenges[2].completions.gte(1)){
		that.player.achievementshandler.completeAchievement(74);
	}
	if(that.player.overload.challenges[6].completions.gte(1)){
		that.player.achievementshandler.completeAchievement(75);
	}
	if(that.player.overload.challenges[8].completions.gte(1)){
		that.player.achievementshandler.completeAchievement(76);
	}
	if(that.player.overload.challenges[9].completions.gte(1)){
		that.player.achievementshandler.completeAchievement(77);
	}
	if(that.player.number.gte(new Decimal("1e16"))){
		that.player.achievementshandler.completeAchievement(81);
	}
	if(that.player.totalnumberproduced.gte(new Decimal("1e16"))){
		that.player.achievementshandler.completeAchievement(82);
	}
	
	
	
}