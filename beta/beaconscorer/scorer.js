beacontypes = {};
maps = {};
buildingletters = {"Lab": "L"};
buildingnames = {"L": "Lab"};
class beacon{
	constructor(name, geteffect, letters){
		this.speedmult = 0;
		this.name = name;
		this._geteffect = geteffect;
		beacontypes[this.name] = this;
		buildingletters[this.name] = letters
		buildingnames[letters] = this.name;
	}
	geteffects(map, x, y){
		this._geteffect(map, x, y);
	}
}
class lab{
	constructor(){
		this.name = "Lab";
		this.speedmult = 1;
	}
}
class map{
	constructor(placeabletiles, name){
		this.placeabletiles = placeabletiles;//2d dictionary of tiles and what tier they unlock at.  1, 2, 3, 4, (5=never unlocked, so water)
		this.name = name;
		this.buildings = {};
		this.settier(1);
		maps[this.name] = this;
	}
	addspeedmult(x, y, amount){
		if(this.placeabletiles[x] == undefined || this.placeabletiles[x][y] == undefined || this.placeabletiles[x][y] > this.tier || this.buildings[x][y] == " "){
			//console.log("invalid tile at " + x + ", " + y);
			return;
		}
		if(this.buildings[x] == undefined){
			this.buildings[x] = {};
		}
		if(this.buildings[x][y] == undefined){
			this.buildings[x][y] = new lab();
		}
		this.buildings[x][y].speedmult += amount;
	}
	score(tier=this.tier){
		this.settier(tier);
		for(const x in this.placeabletiles){
			for(const y in this.placeabletiles[x]){
				if(this.placeabletiles[x][y] > this.tier){
					continue;
				}
				if(this.buildings[x] == undefined){
					this.buildings[x] = {};
				}
				if(this.buildings[x][y] == undefined || this.buildings[x][y] == " "){
					this.buildings[x][y] = new lab();
				}
			}
		}
		for(const x in this.buildings){
			for(const y in this.buildings[x]){
				if(this.buildings[x][y] == undefined || this.placeabletiles[x] == undefined || this.placeabletiles[x][y] == undefined){
					delete this.buildings[x][y];
				}
			}
		}
		for(const x in this.buildings){
			for(const y in this.buildings[x]){
				if(this.buildings[x][y] != undefined && this.buildings[x][y] != " "){
					this.buildings[x][y].speedmult = 1;
				}
			}
		}
		for(const x in this.buildings){
			for(const y in this.buildings[x]){
				if(this.buildings[x][y].name != "Lab" && this.buildings[x][y] != " "){
					this.buildings[x][y].geteffects(this, x, y);
				}
			}
		}
		var score = 0;
		for(const x in this.buildings){
			for(const y in this.buildings[x]){
				if(this.buildings[x][y].name == "Lab"){
					score += this.buildings[x][y].speedmult;
				}
			}
		}
		return score;
	}
	addbuilding(x, y, building){
		if(this.placeabletiles[x] == undefined || this.placeabletiles[x][y] == undefined || this.placeabletiles[x][y] > this.tier){
			return;
		}
		if(this.buildings[x] == undefined){
			this.buildings[x] = {};
		}
		this.buildings[x][y] = building;
	}
	settier(tier){
		this.tier = tier;
		for(const x in this.buildings){
			for(const y in this.buildings[x]){
				if(this.placeabletiles[x] == undefined || this.placeabletiles[x][y] == undefined || this.placeabletiles[x][y] > this.tier){
					this.buildings[x][y] = " ";
				}
			}
		}
	}
	getbuildingstring(){
		var string = "";
		for(const x in this.buildings){
			for(const y in this.buildings){
				if(this.buildings[x][y] == undefined){
					string += " ";
				}else{
					string += buildingletters[this.buildings[x][y].name];
				}
				string += "-";
			}
			string += "|-";
		}
		return string;
	}
	getbuildingarr(){
		var arr = [];
		for(const x in this.buildings){
			for(const y in this.buildings[x]){
				if(this.buildings[x][y] == " "){
					arr.push(" ");
				}else if(this.buildings[x][y].name == "Lab"){
					arr.push("L");
				}else{
					arr.push(buildingletters[this.buildings[x][y].name]);
				}
			}
			arr.push("|");
		}
		arr.pop(); //because the extra "|" is unneccesary
		return arr;
	}
}
function parseplaceabletilesstring(string){
	rows = string.split("|");
	placeabletiles = {};
	for(let x = 0; x < rows.length; x++){
		placeabletiles[x] = {};
		for(let y = 0; y < rows[x].length; y++){
			if(rows[x][y] == " "){
				placeabletiles[x][y] = 5;
			}else{
				placeabletiles[x][y] = parseInt(rows[x][y]);
			}
		}
	}
	return placeabletiles;
}
function parsebuildingsfromstring(string){
	rows = string.split("|");
	buildings = {};
	for(let x = 0; x < rows.length; x++){
		if(rows[x].length == 0){
			continue;
		}
		binrows = rows[x].split("-");
		if(binrows.length > 0){
			buildings[x] = {};
		}
		for(let y = 0; y < binrows.length; y++){
			if(binrows[y] == " "){
				buildings[x][y] = " ";
			}else  if(binrows[y] == "L"){
				buildings[x][y] = new lab();
			}else{
				buildings[x][y] = beacontypes[buildingnames[binrows[y]]];
			}
		}
	}
	return buildings;
}
function parsebuildingsfromarray(arr){
	rows = [[]];
	for(let i = 0; i < arr.length; i++){
		rows[rows.length - 1].push(arr[i]);
		if(arr[i] == "|"){
			rows.push([]);
		}
	}
	buildings = {};
	for(let x = 0; x < rows.length; x++){
		buildings[x] = {}; 
		for(let y = 0; y < rows[x].length; y++){
			if(rows[x][y] == "|"){
				continue;
			}
			if(rows[x][y] == " "){
				buildings[x][y] = null;
			}else  if(rows[x][y] == "L"){
				buildings[x][y] = new lab();
			}else{
				buildings[x][y] = beacontypes[buildingnames[rows[x][y]]];
			}
		}
	}
	return buildings;
}
new map(parseplaceabletilesstring("                    |"+
								  "               1    |"+
								  "              11111 |"+
								  "             111111 |"+
								  "        11  1111111 |"+
								  "   1111 11   1 1 11 |"+
								  "   11111111 11111111|"+
								  "   11111111 1  1    |"+
								  "   1111111111  1    |"+
								  "   1111111111  1    |"+
								  "      11 1111111111 |"+
								  "             111  1 |"+
								  "             111111 |"+
								  "  1    111   111111 |"+
								  "  11   111          |"+
								  "       111          |"+
								  "                     "), "tutorial");
new beacon("box beacon", function(map, x, y){
	for(let xx = -1; xx < 2; xx++){
		for(let yy = -1; yy < 2; yy++){
			map.addspeedmult(xx + parseInt(x), yy + parseInt(y), 0.4); 
		}
	}
}, "B");
new beacon("knight beacon", function(map, x, y){
	x = parseInt(x);
	y = parseInt(y);
	map.addspeedmult(x - 2, y - 1, 0.35);
	map.addspeedmult(x - 2, y + 1, 0.35);
	map.addspeedmult(x - 1, y - 2, 0.35);
	map.addspeedmult(x - 1, y + 2, 0.35);
	map.addspeedmult(x + 1, y - 2, 0.35);
	map.addspeedmult(x + 1, y + 2, 0.35);
	map.addspeedmult(x + 2, y - 1, 0.35);
	map.addspeedmult(x + 2, y + 1, 0.35);
}, "K");
new beacon("arrow beacon left", function(map, x, y){
	x = parseInt(x);
	y = parseInt(y);
	map.addspeedmult(x-1, y, 0.26);
	map.addspeedmult(x-2, y, 0.26);
	map.addspeedmult(x-3, y, 0.26);
	map.addspeedmult(x-4, y, 0.26);
	map.addspeedmult(x-5, y, 0.26);
	map.addspeedmult(x-3, y+1, 0.26);
	map.addspeedmult(x-3, y+2, 0.26);
	map.addspeedmult(x-3, y-1, 0.26);
	map.addspeedmult(x-3, y-2, 0.26);
	map.addspeedmult(x-4, y+1, 0.26);
	map.addspeedmult(x-4, y-1, 0.26);
}, "Al");
new beacon("arrow beacon right", function(map, x, y){
	x = parseInt(x);
	y = parseInt(y);
	map.addspeedmult(x+1, y, 0.26);
	map.addspeedmult(x+2, y, 0.26);
	map.addspeedmult(x+3, y, 0.26);
	map.addspeedmult(x+4, y, 0.26);
	map.addspeedmult(x+5, y, 0.26);
	map.addspeedmult(x+3, y+1, 0.26);
	map.addspeedmult(x+3, y+2, 0.26);
	map.addspeedmult(x+3, y-1, 0.26);
	map.addspeedmult(x+3, y-2, 0.26);
	map.addspeedmult(x+4, y+1, 0.26);
	map.addspeedmult(x+4, y-1, 0.26);
}, "Ar");
/*new beacon("arrow beacon down", function(map, x, y){
	x = parseInt(x);
	y = parseInt(y);
	map.addspeedmult(x, y+1, 0.26);
	map.addspeedmult(x, y+2, 0.26);
	map.addspeedmult(x, y+3, 0.26);
	map.addspeedmult(x, y+4, 0.26);
	map.addspeedmult(x, y+5, 0.26);
	map.addspeedmult(x+1, y+3, 0.26);
	map.addspeedmult(x+2, y+3, 0.26);
	map.addspeedmult(x-1, y+3, 0.26);
	map.addspeedmult(x-2, y+3, 0.26);
	map.addspeedmult(x+1, y+4, 0.26);
	map.addspeedmult(x-1, y+4, 0.26);
}, "Ad");*/
new beacon("arrow beacon up", function(map, x, y){
	x = parseInt(x);
	y = parseInt(y);
	map.addspeedmult(x, y-1, 0.26);
	map.addspeedmult(x, y-2, 0.26);
	map.addspeedmult(x, y-3, 0.26);
	map.addspeedmult(x, y-4, 0.26);
	map.addspeedmult(x, y-5, 0.26);
	map.addspeedmult(x+1, y-3, 0.26);
	map.addspeedmult(x+2, y-3, 0.26);
	map.addspeedmult(x-1, y-3, 0.26);
	map.addspeedmult(x-2, y-3, 0.26);
	map.addspeedmult(x+1, y-4, 0.26);
	map.addspeedmult(x-1, y-4, 0.26);
}, "Au");
new beacon("wall beacon horizontal", function(map, x, y){
	x = parseInt(x);
	y = parseInt(y);
	for(let xx = -6; xx < 7; xx++){
		map.addspeedmult(x+xx, y, 0.27);
	}
}, "Wh");
new beacon("wall beacon vertical", function(map, x, y){
	x = parseInt(x);
	y = parseInt(y);
	for(let yy = -6; yy < 7; yy++){
		map.addspeedmult(x, y+yy, 0.27);
	}
}, "Wv");
function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}
function choose(list){
	var index = Math.floor(Math.random() * list.length);
	return list[index];
}
function mutate(oldbuildings, num=1){
	var buildings = [];
	for(let i = 0; i < oldbuildings.length; i++){
		buildings.push(oldbuildings[i]);
	}
	for(let i = 0; i < num; i++){
		var index = Math.floor(Math.random() * buildings.length);
		while(buildings[index] == " " || buildings[index] == "|"){
			index = Math.floor(Math.random() * buildings.length);
		}
		var letters = [];
		for(const prop in buildingnames){
			letters.push(prop);
		}
		buildings[index] = choose(letters);
	}
	return buildings;
}
function mix(buildings1, buildings2){
	let ret = [];
	for(let i = 0; i < buildings1.length; i++){
		if(Math.random() > 0.5){
			ret.push(buildings1[i]);
		}else{
			ret.push(buildings2[i]);
		}
	}
	return ret;
}
function geneticalgorithm(map, tier, generations, competitors=[]){
	map.settier(1);
	map.score(tier);
	var letters = "";
	for(const prop in buildingnames){
		letters += prop;
	}
	var empty = map.getbuildingstring().split("-");
	if(competitors.length == 0){
		for(let i = 0; i < 100; i++){
			competitors.push(empty);
		}
	}
	var scores = [];
	for(let i = 0; i < competitors.length; i++){
		map.buildings = parsebuildingsfromarray(competitors[i]);
		score = map.score(tier);
		scores.push({"score": score, "competitor": competitors[i]});
	}
	scores.sort(function(a, b){
		if(a["score"] < b["score"]){
			return 1;
		}else if(a["score"] > b["score"]){
			return -1;
		}
		return 0;
	});
	if(generations < 1){
		console.log("THE BEST LAYOUT IS: " + scores[0]["competitor"].join("").split("|").join("\n"));
		return;
	}
	competitors = [];
	for(let i = 0; i < Math.floor(scores.length / 2); i++){
		competitors.push(scores[i]["competitor"]);
	}
	let cl = competitors.length;
	for(let i = 0; i < cl; i++){
		competitors.push(mutate(mix(competitors[i], choose(competitors))));
	}
	for(let i = 1; i < competitors.length; i++){
		if(arrayEquals(competitors[i], competitors[0])){
			competitors[i] = mutate(competitors[i], 1);
		}
	}
	drawlayout(scores[0]["competitor"]);
	console.log(scores[0]["score"] >= scores[1]["score"]);
	setTimeout(geneticalgorithm, 0, map, tier, generations - 1, competitors);
}
function drawlayout(layout){
	var table = document.getElementById("table");
	var html = "";
	html += "<tr>";
	for(let i = 0; i < layout.length; i++){
		if(layout[i] == "|"){
			html += "</tr><tr>";
		}else{
			html += "<td>" + layout[i] + "</td>";
		}
	}
	table.innerHTML = html;
}