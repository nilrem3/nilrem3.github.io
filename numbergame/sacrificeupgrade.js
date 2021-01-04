class sacrificeupgrade {
	constructor(cost, scaling, maxlevel, name){
		this._cost = cost;
		this.scaling = scaling;
		this._maxlevel = maxlevel;
		this.amount = new Decimal(0);
		this.name = name;
		this.unlocked = true;
	}
	get cost(){
		return Decimal.mul(this.scaling.pow(this.amount), this._cost);
	}
	get canbuy(){
		if(player.overload.challenges[5].active || player.overload.challenges[9].active){
			return false;
		}
		if(this.maxnum != null){
			if(this.amount >= this.maxnum) return false;
		}
		else return this.cost.lte(sacrifice.numericpoints);
	}
	buy(num){
		if(!this.canbuy) return;
		if(this.numaffordable.lt(num)){
			this.buy(this.numaffordable);
		}
		player.sacrifice.numericpoints = player.sacrifice.numericpoints.sub(this.cost.mul(new Decimal(1).sub(this.scaling.pow(num)).div(new Decimal(1).sub(this.scaling))));
		this.amount = this.amount.plus(num);
	}
	get buttontext(){
		if(this.maxlevel != null){
			if(this.maxlevel > this.amount){
				return this.name + ": " + format(this.cost) + " NP";
			}else{
				return "MAX";
			}
		}else{
			return this.name + ": " + format(this.cost) + " NP";
		}
	}
	get htmlclass(){
		if(this.unlocked){
			return "sacrificeupgradedisplay";
		}else{
			return "sacrificeupgradedisplay lockedsacrificeupgrade";
		}
	}
	get numaffordable(){
		if(this.canbuy == false){
			return new Decimal(0);
		}
		var num = Decimal.floor(Decimal.log((new Decimal(-1).mul((new Decimal(1).sub(this.scaling).div(this.cost))).mul(player.number)).plus(1), this.scaling));
		if(num.gte(this.maxlevel.sub(this.amount))){
			return this.maxlevel.sub(this.amount);
		}
		return num;
	}
	get maxlevel(){
		var level = this._maxlevel;
		return level;
	}
}
Vue.component('sacrificeupgradedisplay', {
	props: {
		upgrade: sacrificeupgrade
	},
	data: function(){
		return {
			
		}
	},
	methods: {
		format(amount){
			return format(amount);
		}
	},
	template: 
	`<div :class="upgrade.htmlclass">
		<button class="sacrificecolored" @click="upgrade.buy(1)">{{upgrade.buttontext}}</button>
	</div>`
});