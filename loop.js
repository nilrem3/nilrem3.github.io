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
	
}