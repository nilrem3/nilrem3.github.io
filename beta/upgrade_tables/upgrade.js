class upgrade{
	constructor(table, row, number, methods, cost){
		this.table = table;
		this.row = row;
		this.number = number;
		this.name = "T" + table + "R" + row + "X" + number;
		this.methods = methods;
		this._cost = cost;
	}
	function isVisible(gameState){
		return this.methods.isVisible(gameState, this);
	}
	function purchaseAllowed(gameState){
		return this.methods.purchaseAllowed(gameState, this);
	}
	function canAfford(gameState){
		for(const letter in "abcdefghijklmnopqrstuvwxyz"){
			if(this.cost[letter] == undefined){
				continue;
			}
		    if(gameState.playerData.resources[letter] <= this.cost[letter]){
				return false;
			}
		}
		return true;
	}
	function getCost(gameState){
		return this._cost(gameState, this)
	}
	function canBuy(gameState){
		return this.isVisible(gameState, this) && this.purchaseAllowed(gameState, this) && this.canAfford(gameState);
	}
}