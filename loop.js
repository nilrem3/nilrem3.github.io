function gameLoop(that) {
	var now = Date.now();
	let diff = new Decimal((now - that.player.lastupdate) / 1000)
	that.player.lastupdate = now;
	numbertoadd = Decimal.mul(that.player.numberPerSecond, diff);
	that.addnumber(numbertoadd);
	//check various unlocks
	if(that.player.sacrifice.unlocked == false){
		if(that.player.tier >= 4 && that.player.sacrifice.numericpointsonsacrifice.gte(new Decimal(70))){
			that.player.sacrifice.unlocked = true;
			that.unlockmenu("sacrificemenubutton");
		}
	}
	//factor juice
	if(player.sacrifice.factorshandler.unlocked){
		that.player.sacrifice.factorshandler.factorjuice = that.player.sacrifice.factorshandler.factorjuice.plus(Decimal.mul(diff, that.player.sacrifice.factorshandler.factorJuicePerSecond));
		that.player.sacrifice.factorshandler.totalfactorjuicegained = that.player.sacrifice.factorshandler.totalfactorjuicegained.plus(Decimal.mul(diff, that.player.sacrifice.factorshandler.factorJuicePerSecond));
	}
	that.player.achievementshandler.checkAchievementVisibility();
	//check each achievement's unlock status
	if(that.player.clicks >= 100){
		that.player.achievementshandler.completeAchievement(0);
	}
	if(that.player.clicks >= 250){
		that.player.achievementshandler.completeAchievement(1);
	}
	if(that.player.clicks >= 500){
		that.player.achievementshandler.completeAchievement(2);
	}
	if(that.player.clicks >= 1000){
		that.player.achievementshandler.completeAchievement(3);
	}
	if(that.player.clicks >= 2500){
		that.player.achievementshandler.completeAchievement(4);
	}
	if(that.player.highesttier >= 1){
		that.player.achievementshandler.completeAchievement(5);
	}
	if(that.player.highesttier >= 2){
		that.player.achievementshandler.completeAchievement(6);
	}
	if(that.player.highesttier >= 3){
		that.player.achievementshandler.completeAchievement(7);
	}
	if(that.player.highesttier >= 4){
		that.player.achievementshandler.completeAchievement(8);
	}
	if(that.player.highesttier >= 5){
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
	if(that.player.clicks >= 5000){
		that.player.achievementshandler.completeAchievement(14);
	}
	if(that.player.clicks >= 10000){
		that.player.achievementshandler.completeAchievement(15);
	}
	if(that.player.clicks >= 25000){
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
	
	
}