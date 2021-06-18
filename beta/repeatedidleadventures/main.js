mapareas = {};
tiletypes = {};
objects = {};
startingtempdata = {
	inventory: [],
	pos: {x: 2, y: 2},
	direction: "right"
};
player = {
    data: {
		gold: 0
	},
	tempdata: {},
	useitem(item){
		if(item in this.inventory){
			remove(this.inventory, item);
			return true;
		}
		return false;
	},
	addgold(num){
		this.data.gold += num;
	},
	addinvobject(name){
		this.inventory.push(name);
	}
};
state = {
	tiles: [],
	objects: [],
	movedelay: 0,
	timer: 5,
	gettile(x, y){
		if(y < 0 || y >= this.tiles.length || x < 0 || x >= this.tiles[y].length){
			return copytile("wall");
		}
		return this.tiles[y][x];
	},
	getobject(x, y){
		if(this.objects[y][x] == null || this.objects[y][x] == undefined){
			return null;
		}
		return this.objects[y][x];
	}
}
instructionhandler = {
	instructionlist: [],
	pointer: 0,
	doinstruction(){
		if(this.pointer < this.instructionlist.length){
			console.log(this.pointer);
			this.instructionlist[this.pointer].execute();
			this.pointer += 1;
		}
	}
}
class maparea{
	constructor(name, tiles, objects, data={}){
		this.name = name;
		this.tiles = tiles;
		this.objects = objects;
		this.data = data;
		mapareas[this.name] = this;
	}
	gettile(x, y){
		return copytile(this.tiles[y][x]);
	}
	getobject(x, y){
		if(this.objects[y][x] == null){
			return null;
		}
		return copyobject(this.objects[y][x]); //stored in list of rows, so y comes first.
	}
}
class tile{
	constructor(name, time, passable, actions, data={}){
		this.name = name;
		this.time = time;
		this.passable = passable;
		this.data = data;
		this.actions = actions;
		tiletypes[this.name] = this;
	}
	doaction(action){
		if(this.actions[action] == undefined){
			return 0;
		}
		return this.actions[action]();
	}
}
class mapobject{
	constructor(name, actions, data={}){
		//actions is a dictionary of "name": function.
		this.name = name;
		this.actions = actions;
		this.data = data;
		objects[this.name] = this;
	}
	doaction(action){
		if(this.actions[action] == null){
			return 0;
		}
		return this.actions[action]();
	}
}

class instruction{
	constructor(name, data){
		this.name = name;
		this.data = data;
	}
	execute(){
		switch(this.name){
			case "move":
				switch(this.data["direction"]){
					case "up":
						game.player.tempdata.direction = "up";
						if(game.state.tiles(game.player.tempdata.pos.x, game.player.tempdata.pos.y - 1).passable){
							game.player.tempdata.pos.y -= 1;
						}
						break;
					case "down":
						game.player.tempdata.direction = "down";
						if(game.state.tiles(game.player.tempdata.pos.x, game.player.tempdata.pos.y + 1).passable){
							game.player.tempdata.pos.y += 1;
						}
						break;
					case "left":
						game.player.tempdata.direction = "left";
						if(game.state.gettile(game.player.tempdata.pos.x - 1, game.player.tempdata.pos.y).passable){
							game.player.tempdata.pos.x -= 1;
							console.log("thing");
						}
						break;
					case "right":
						game.player.tempdata.direction = "right";
						if(game.state.gettile(game.player.tempdata.pos.x + 1, game.player.tempdata.pos.y).passable){
							game.player.tempdata.pos.x += 1;
						}
						break;
				}
				//do these even if the player did not move at all.  walking into walls takes time, you know.
				state.movedelay += state.gettile(player.tempdata.pos.x, player.tempdata.pos.y).time; //do this first in case passing the tile causes a change in the player's position (i.e. teleportation)
				state.gettile(player.tempdata.pos.x, player.tempdata.pos.y).doaction("pass"); //call the tile at the player's new position's pass function.
				break;
			case "do":
				var result = game.state.getobject(game.player.tempdata.pos.x, game.player.tempdata.pos.y).doaction(this.data["action"]);
				if(result == null){
					result = game.state.gettile(game.player.tempdata.pos.x, game.player.tempdata.pos.y).doaction(this.data["action"]);
				}
				if(result == null){
					//couldn't do the thing on the tile the player is on, must be done on the tile the player is looking at.
					let xoffset = {"up": 0, "down": 0, "left": -1, "right": 1};
					let yoffset = {"up": -1, "down": 1, "left": 0, "right": 0};
					result = game.state.gettile(game.player.tempdata.pos.x + xoffset[game.player.tempdata.direction], game.player.tempdata.pos.y + yoffset[game.player.tempdata.direction]).doaction(this.data["action"]);
				}
				if(result == null){
					game.state.movedelay += 1; //doing nothing at all takes 1 second, I guess.
				}
				else{
					game.state.movedelay += result;
				}
				break;
		}
	}
}
function definedata(){
	new tile("empty", 1, true, {"pass": function(){}});
	new tile("wall", 1, false, {"pass": function(){}});
	new tile("trap", 3, true, {"pass": function(){
		player.dealdamage({"damage": this.data.damage, "source": "trap"});
	}}, {"damage": 3});
	new tile("locked door", 1, false, {"unlock": function(){
		if(player.useitem("key")){
			this.call(changetile("door"));
		}
		return 5; //time taken to do the action;
	}});
	new tile("door", 1, false, {"open": function(){
		this.call(changetile("open door"));
		return 2;
	}});
	new tile("open door", 1, true, {"close": function(){
		this.call(changetile("door"));
		return 2;
	}});
	new mapobject("gold coin", {"loot": function(){
		player.addgold(this.data["gold"]);
		return 2;
	}}, {"gold": 1});
	new mapobject("gold pile", {"loot": function(){
		player.addgold(this.data["gold"]);
		return 2;
	}}, {"gold": 5});
	new mapobject("key", {"loot": function(){
		player.addinvobject("key");
		return 2;
	}});
	new maparea("tutorial", [["empty", "trap", "empty", "trap", "empty"],
							["door", "wall", "wall", "wall", "locked door"],
							["empty", "wall", "empty", "empty", "empty"],
							["wall", "wall", "wall", "wall", "door"],
							["empty", "empty", "empty", "empty", "empty"]],
							[[null, null, null, null, null], 
							[null, null, null, null, null],
							[null, null, null, "gold coin", null],
							[null, null, null, null, null],
							["key", null, "gold coin", null, "gold pile"]]);
}
definedata();
function copytile(name, data=null){
	if(data != null){
		return new tile(name, tiletypes[name].time, tiletypes[name].passable, tiletypes[name].actions, data);
	}else{
		return new tile(name, tiletypes[name].time, tiletypes[name].passable, tiletypes[name].actions, tiletypes[name].data);
	}
}
function copyobject(name, data=null){
	if(data != null){
		return new mapobject(name, objects[name].actions, data);
	}else{
		return new tile(name, objects[name].actions, objects[name].data);
	}
}
function changetile(name, data=null){
	newtile = copytile(name, data);
	this.name = newtile.name;
	this.time = newtile.time;
	this.passable = newtile.passable;
	this.actions = newtile.actions;
	this.data = newtile.data;
}
function remove(list, elementtoremove){
	for(let i = 0; i < elementtoremove.length; i++){
		if(list[i] == elementtoremove){
			list.splice(i, 1);
			break;
		}
	}
}
function dodropchance(chance, item){
	//gets the player's luck bonuses, etc;
}
function loadmap(maparea){
	state.tiles = [];
	state.objects = [];
	for(let y = 0; y < maparea.tiles.length; y++){
		row = [];
		for(let x = 0; x < maparea.tiles[y].length; x++){
			row.push(maparea.gettile(x, y));
		}
		state.tiles.push(row);
	}
	for(let y = 0; y < maparea.objects.length; y++){
		row = [];
		for(let x = 0; x < maparea.tiles[y].length; x++){
			row.push(maparea.getobject(x, y));
		}
		state.objects.push(row);
	}
}
loadmap(mapareas["tutorial"]);
var game = new Vue({
	el:"#app",
	data: {
		state: state,
		player: player,
		instructionhandler: instructionhandler,
		lastupdate: Date.now()
	},
	methods:{
		resetloop(){
			game.player.tempdata.pos = {x:2, y:2};
			loadmap(mapareas["tutorial"])
			game.player.tempdata.inventory = [];
			game.player.tempdata.direction = "right";
			game.state.movedelay = 0;
			game.state.timer = 5;
			game.instructionhandler.pointer = 0;
		},
		draw(){
			var screen = document.getElementById("screen");
			ctx = screen.getContext("2d");
			for(let y = -1; y < game.state.tiles.length + 1; y++){
				for(let x = -1; x < (y>-1&&y<game.state.tiles.length?state.tiles[y].length + 1:game.state.tiles[0].length + 1); x++){
					if(game.state.gettile(x, y).passable){
						ctx.fillStyle = "#FFFFFF";
					}else{
						ctx.fillStyle = "#000000";
					}
					ctx.fillRect((x + 1) * 50, (y + 1) * 50, 50, 50);
					
					ctx.fillStyle = "#FF8888";
					ctx.beginPath();
					ctx.arc((game.player.tempdata.pos.x + 1.5) * 50, (game.player.tempdata.pos.y + 1.5) * 50, 50, 0, 2 * Math.PI);
					ctx.fill();
				}					
			}
			
		}
	}
});
game.resetloop();
setInterval(loop, 50);
setInterval(game.draw, 50);