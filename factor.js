class factor{
	constructor(description, bonusfunction, unlocked){
		this.description = description;
		this.bonusfunction = bonusfunction;
		this.numbought = new Decimal(0);
		this.unlocked = unlocked;
	}
	get bonus(){
		var bonus = Decimal.pow(this.bonusfunction(), this.numbought);
		if(bonus.gte(new Decimal(1))){
			return bonus;
		}else{
			return new Decimal(1);
		}
	}
	get buttontext(){
		if(this.numbought.equals(0) /*&& can only buy 1 of each factor*/){
			return "Activate Factor for 1 Factorizer";
		}/*else if(can buy multiple factors and already bought sone){
			return "Increase Factor Strength For 1 Factorizer"
		}*/else if(this.numbought == 1){
			return "Already Active!";
		}else{
			return 'ERROR';
		}
		
	}
	get canbuy(){
		if(player.sacrifice.factorshandler.factorizers.lt(1)){
			return false;
		}
		if(this.numbought.gte(1) /*&& can't buy more than 1*/){
			return false;
		}
		return true;
	}
	get bonusfrom1factorizer(){
		return new Decimal(this.bonusfunction());
	}
	buy(){
		if(this.canbuy){
			this.numbought = this.numbought.plus(1);
			player.sacrifice.factorshandler.factorizers = player.sacrifice.factorshandler.factorizers.sub(1);
		}
		return;
	}
	get htmlClass(){
		if(this.unlocked){
			return "factordisplay displaytext";
		}else{
			return "lockedfactor";
		}
	}
}

