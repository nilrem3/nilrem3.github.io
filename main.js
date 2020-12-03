var game = new Vue({
	el:"#app",
	data:{
		player: player
	},
	methods:{
		addnumber(num){
			num = num.times(Decimal.pow(1.5, player.sacrifice.repeatablenumbermultupgrade.amount)); 
			player.number = Decimal.plus(player.number, num);
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
		}
	}
});
//do some init stuff
setInterval(game.gameLoop, 50)
game.switchmenu("producertab")
game.unlockmenu("producersmenubutton")
function format(amount){
	if(new Decimal(amount).lessThan(new Decimal(1000))){
		return new Decimal(amount).toPrecision(3).toString();

	}
	return numberformat.format(amount, {backend: 'decimal.js', format:'scientific', Decimal: Decimal, sigfigs:5});
}
