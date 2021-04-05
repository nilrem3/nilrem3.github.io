class calculatedvariable{
	constructor(name, basefunc){
		this.name = name;
		this.basefunc = basefunc;
		this.calculated = true;
		player.variables[this.name] = this;
	}
}

class accumulatingvariable{
	constructor(name, baseamount){
		this.name = name;
		this.calculated = false;
		this.amount = baseamount;
		player.variables[this.name] = this;
	}
}