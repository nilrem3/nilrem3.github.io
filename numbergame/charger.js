class charger{
	constructor(name, basecost, scaling, speeddivider, challenge){
		this.name = name;
		this.basecost = basecost;
		this.scaling = scaling;
		this.speeddivider = speeddivider;
		this.mult = new Decimal(1);
		this.amount = new Decimal(0);
		this.bought = new Decimal(0);
		this.challenge = challenge;
	}
	get cost(){
		return this.basecost.mul(this.scaling.pow(this.amount));
	}
	get maxnum(){
		num = new Decimal(0);
		num = num.plus(this.challenge.completions);
		return num;
	}
	get multpersecond(){
		var mult = new Decimal(this.amount).div(100);
		mult = mult.mul(player.achievementshandler.achievementBonus("charger speed", true));
		//an upgrade that makes corresponding challenge boost charger speed
		return mult.div(this.speeddivider);
	}
	get htmlclass(){
		if(this.maxnum.lt(1)){
			return "hidden";
		}else{
			return "displaytext chargerdisplay";
		}
	}
	get buttontext(){
		if(this.amount.lt(this.maxnum)){
			return "+1: " + format(this.cost);
		}else{
			return "MAX";
		}
	}
	get numaffordable(){
		if(this.canbuy == false){
			return new Decimal(0);
		}
		var num = Decimal.floor(Decimal.log((new Decimal(-1).mul((new Decimal(1).sub(this.scaling).div(this.cost))).mul(player.number)).plus(1), this.scaling));
		if(num.gt(new Decimal(this.maxnum - this.amount))){
			return new Decimal(this.maxnum - this.amount);
		}else{
			return num;
		}
	}
	get canbuy(){
		if(this.amount.gte(this.maxnum)){
			return false;
		}
		return player.number.gte(this.cost);
	}
	buy(num){
		num = Decimal.floor(num);
		if(!this.canbuy){
			return;
		}
		if(this.numaffordable.lt(num)){
			this.buy(this.numaffordable);
		}else{
			player.number = player.number.sub(this.cost.mul(new Decimal(1).sub(this.scaling.pow(num))).div(new Decimal(1).sub(this.scaling)));
			this.amount = this.amount.plus(num);
			this.bought = this.bought.plus(num);
		}
	}
	
}
function makecharger(tier){
	var challenge = player.overload.challenges[9];
	if(tier < 9){
		challenge = player.overload.challenges[tier];
	}
	return new charger("Charger " + (tier + 1), new Decimal("1e4").mul(new Decimal(10).pow(tier)), new Decimal(10).plus(new Decimal(5).mul(tier)), tier + 1, challenge);
}

Vue.component('chargerdisplay', {
	props: {
		charger: charger
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
	`<div :class="charger.htmlclass">
	{{charger.name}}: {{charger.amount}}, x{{format(charger.mult)}} <button @click="charger.buy(1)">{{charger.buttontext}}</button>
	</div>`
});