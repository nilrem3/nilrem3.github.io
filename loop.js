function gameLoop(that) {
	var now = Date.now();
	let diff = new Decimal((now - that.player.lastupdate) / 1000)
	that.player.lastupdate = now;
	numbertoadd = new Decimal(0);
	var i;
	for(i = 0; i < that.player.producers.length; i++){
		numbertoadd = Decimal.plus(numbertoadd, Decimal.mul(that.player.producers[i].productionPerSecond, diff));
	}
	that.addnumber(numbertoadd);
	//check various unlocks
	if(that.player.sacrifice.unlocked == false){
		if(that.player.tier >= 4 && that.player.sacrifice.numericpointsonsacrifice.gte(new Decimal(70))){
			that.player.sacrifice.unlocked = true;
			that.unlockmenu("sacrificemenubutton");
		}
	}
	
}