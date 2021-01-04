var game = new Vue({
	el:"#app",
	data:{
		player: player,
	},
	methods:{
		addnumber(num){
			player.number = Decimal.plus(player.number, num);
			player.totalnumberproduced = Decimal.plus(player.totalnumberproduced, num);
		},
		gameLoop(){
			gameLoop(this)
		},
		mounted(){
			
		},
		switchmenu(id){
			var menus = document.getElementsByClassName("menu");
			var i;
			for(i = 0; i<menus.length; i++){
				menus[i].style.display = "none";
			}
			document.getElementById(id).style.display = "initial";
		},
		unlockmenu(buttonid){
			document.getElementById(buttonid).style.display = "inline";
		},
		format(num){
			return format(num);
		},
		click(){
			this.addnumber(player.numberperclick);
			player.clicks = player.clicks.plus(1);
		}
	}
});
//do some init stuff
setInterval(game.gameLoop, 50)
game.switchmenu("producertab")
game.unlockmenu("producersmenubutton")
game.unlockmenu("optionsmenubutton")
game.unlockmenu("achievementsmenubutton")
game.unlockmenu("statisticsmenubutton")
//debug
function format(amount){
	if(new Decimal(amount).lessThan(new Decimal(1000))){
		return new Decimal(amount).toPrecision(4).toString();

	}
	return numberformat.format(amount, {backend: 'decimal.js', format:'scientific', Decimal: Decimal, sigfigs:4});
}
function timeformat(amount){
	var hours = Decimal.floor(amount.div(3600));
	amount = amount.sub(hours.mul(3600));
	var minutes = Decimal.floor(amount.div(60));
	amount = amount.sub(minutes.mul(60));
	ret = "";
	if(hours.gt(0)){
		if(hours.gt(1)){
			ret += format(hours) + " hours";
		}else{
			ret += "1 hour";
		}
	}
	if(minutes.gt(0)){
		if(minutes.gt(1)){
			ret += " " + format(minutes) + " minutes";
		}else{
			ret += " 1 minute";
		}
	}
	if(amount.gt(0)){
			ret += " " + format(amount) + " seconds";
	}
	return ret;
}
