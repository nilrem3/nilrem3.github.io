class upgrade{
	constructor(name, description, costvar, costscaling, maxlevels){
		this.name = name;
		this.description = description;
		this.costvar = costvar;
		this.costscaling = costscaling;
		this.maxlevels = maxlevels;
		this.levels = new Decimal(0);
		player.upgrades[this.name] = this;
	}
	get cost(){
		let basecost = this.costscaling(this.levels);
		//reduce cost, etc here.
		return basecost;
	}
	selectupgrade(){
		player.setselectedupgrade(this.name);
	}
	buy(){
		if(player.getvar(this.costvar).gte(this.cost)){
			if(this.levels.lt(this.maxlevels) || this.maxlevels == Decimal.Infinity){
				player.changevar(this.costvar, new Decimal(-1).mul(this.cost));
				this.levels = this.levels.plus(1);
			}
		}
	}
	get upgradecostbuttontext(){
		if(this.levels.gte(this.maxlevels) && this.maxlevels != Decimal.Infinity){
			return "MAX";
		}
		return format(this.cost) + this.costvar[0].toUpperCase();
	}
	getClass(){
		return this.costvar + "upgrade upgrade";
	}
}