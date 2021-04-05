var game = new Vue({
	el: "#app",
	data: {
		player: player
	},
	methods: {
		format: function(n){
			return format(n);
		}
	}
});
var lasttime = new Decimal(Date.now());
function loop(){
	let timestep = new Decimal(Date.now()).sub(lasttime).div(1000);
	lasttime = new Decimal(Date.now());
	game.player.changevar("coins", player.getvar("coinspersecond").mul(timestep));
}
function format(amount){
	    if(new Decimal(amount).lessThan(new Decimal(1000))){
		return new Decimal(amount).toPrecision(4).toString();

	}
	return numberformat.format(amount, {backend: 'decimal.js', format:'scientific', Decimal: Decimal, sigfigs:4});
}
setInterval(loop, 50);
function save(){
	let vardata = {};
	let upgradedata = {};
	for(const property in game.player.variables){
		if(game.player.variables[property].calculated == false){
			vardata[property] = game.player.variables[property].amount;
		}
	}
	for(const upgrade in game.player.upgrades){
		upgradedata[game.player.upgrades[upgrade].name] = game.player.upgrades[upgrade].levels;
	}
    let savefile = {
		vars: vardata,
		upgrades: upgradedata
	}
	window.localStorage.setItem('save', JSON.stringify(savefile));
}
function load(){
	savefile = JSON.parse(window.localStorage.getItem('save'));
	for(const property in savefile.vars){
		game.player.setvar(property, new Decimal(savefile.vars[property]));
	}
	for(const property in savefile.upgrades){
		game.player.upgrades[property].levels = new Decimal(savefile.upgrades[property]);
	}
}