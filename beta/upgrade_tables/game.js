gameState = {
	playerData: playerData
}
var game = new Vue({
	el: "#app",
	data: {
		gameState: gameState,
		playerData: playerData
	},
	methods: {
		format: function(n){
			return format(n);
		}
	}
});

function format(n){
	if(new Decimal(n).lessThan(new Decimal(1000))){
		return new Decimal(n).toPrecision(4).toString();
	}
	return numberformat.format(amount, {backend: 'decimal.js', format:'scientific', Decimal: Decimal, sigfigs:4});
}

