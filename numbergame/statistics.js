var statistics = {
	get statistics(){
		ret = [];
		//check which statistics should be displayed to avoid spoilers
		ret.push("Total Number Produced: " + format(player.totalnumberproduced));
		ret.push("Highest Tier Reached: " + format(player.highesttier));
		ret.push("Achievements Completed: " + format(player.achievementshandler.numCompleted));
		ret.push("Times Clicked: " + format(player.clicks));
		if(player.sacrifice.timessacrificed > 0){
			ret.push("Times Sacrificed: " + format(player.sacrifice.timessacrificed));
			ret.push("Total NP gained: " + format(player.sacrifice.totalnpgained));
		}
		if(player.sacrifice.factorshandler.unlocked){
			ret.push("Total Factor Juice Gained: " + format(player.sacrifice.factorshandler.totalfactorjuicegained));
		}
		if(player.overload.unlocked){
			ret.push("Highest times Overloaded: " + format(player.overload.besttimesoverloaded));
		}
		ret.push("OVERALL RATING: " + format(this.overallRating));
		return ret;
	},
	get overallRating(){
		rating = new Decimal(0);
		rating = rating.plus(Decimal.minus(Decimal.log(player.totalnumberproduced.plus(10), new Decimal(10)), 1));
		rating = rating.plus(new Decimal(player.highesttier));
		rating = rating.plus(new Decimal(player.achievementshandler.numCompleted).div(new Decimal(2)));
		rating = rating.plus(Decimal.minus(Decimal.log(Decimal.plus(player.clicks, 10), new Decimal(10)), 1));
		rating = rating.plus(Decimal.pow(player.sacrifice.timessacrificed, new Decimal(0.33)));
		rating = rating.plus(Decimal.mul(2, Decimal.minus(Decimal.log(player.sacrifice.totalnpgained.plus(10), 10), 1)));
		rating = rating.plus(Decimal.minus(Decimal.log(player.sacrifice.factorshandler.totalfactorjuicegained.plus(10), 10), 1));
		rating = rating.plus(player.overload.besttimesoverloaded);
		return rating;
	}
}