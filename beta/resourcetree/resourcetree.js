let resources = {
	
}
let maxtier = 9;
let tilesunlocked = 1;
tiernames = {
	1: "newbies landing 1", 
	2: "newbies landing 2",
	3: "newbies landing 3",
	4: "newbies landing 4",
	5: "flesh world 1",
	6: "flesh world 2",
	7: "flesh world 3",
	8: "flesh world 4",
	9: "tronne planet 1"
	
}
class resource{
	constructor(name, basespeed, requirements, tier){
		this.name = name;
		this.basespeed = basespeed;
		this._requirements = requirements;
		this.speedbonus = 1;
		this.prodbonus = 1;
		this.effbonus = 1;
		this.tier = tier;
		resources[this.name] = this;
	}
	get speed(){
		return this.basespeed / this.speedbonus;
	}
	get requirements(){
		let ret = {};
		Object.assign(ret, this._requirements); //ret = this._requirements makes changes to ret also apply to this._requirements, which is not what we want
		for(const property in ret){
			ret[property] = ret[property] * Math.floor(this.prodbonus);
			ret[property] = Math.ceil(ret[property] * this.effbonus);
		}
		return ret;
	}
	get totalspeed(){
		let speed = this.speed;
		for(const property in this.requirements){
			speed += resources[property].totalspeed * this.requirements[property];
		}
		return speed;
	}
	getamountneeded(resource){
		let amount = 0; 
		for(const property in this.requirements){
			if(resource == property){
				amount += this.requirements[property];
			}else{
				amount += Math.ceil((this.requirements[property] / Math.floor(resources[property].prodbonus))) * resources[property].getamountneeded(resource);
			}
		}
		return amount;
	}
	get totalResourceCost(){
		let cost = {};
		for(const property in resources){
			cost[property] = this.getamountneeded(property);
		}
		for(const property in cost){
			if(cost[property] == 0){
				delete cost[property];
			}
		}
		return cost;
	}
	getCostOf(num){
		num = Math.ceil(num / Math.floor(this.prodbonus));
		let cost = this.totalResourceCost;
		for(const property in cost){
			cost[property] *= num;
		}
		return cost;
	}
	gettime(num){
		let numtiles = num / Math.floor(this.prodbonus);
		return Math.ceil(numtiles / tilesunlocked) * this.speed;
	}
	gettotaltime(num){
		let time = this.gettime(num);
		for(const mat in this.requirements){
			time += resources[mat].gettotaltime(this.requirements[mat] * num);
		}
		return time;
	}
}
function targetmaterialselectionhtml(){
let html = ``;
	for(const prop in resources){
		html += `<option value="` + prop + `">` + prop + `</option>`;
	}
	return html;
}
/*
function speedbonuseshtml(){
	let html = `<table><tr><td><div>Input Speed Bonuses</td></tr></div>`;
	for(resource in resources){
		html += `<tr><td>` + resource + `</td><td><input type="number" step="any" id="` + resource + `speedbonus" value="1"></input></td></tr>`
	}
	html += `</table>`;
	return html;
}
function prodbonuseshtml(){
	let html = `<table><tr><td><div>Input Production Bonuses</td></tr></div>`;
	for(resource in resources){
		html += `<tr><td>` + resource + `</td><td><input type="number" step="any" id="` + resource + `prodbonus" value="1"></input></td></tr>`
	}
	html += `</table>`;
	return html;
}
function effbonuseshtml(){
	let html = `<table><tr><td><div>Input Efficiency Bonuses</td></tr></div>`;
	for(resource in resources){
		html += `<tr><td>` + resource + `</td><td><input type="number" step="any" id="` + resource + `effbonus" value="1"></input></td></tr>`
	}
	html += `</table>`;
	return html;
}
*/
function bonusinputhtml(){
	let html = `<table>
	<tr>
	<td>
	Material
	</td>
	<td>
	Input Speed Bonuses Here
	</td>
	<td>
	Input Production Bonuses Here
	</td>
	<td>
	Input Efficiency Bonuses Here
	</td></tr></table>`;
	for(let tier = 1; tier <= maxtier; tier ++){
		html += tiernames[tier] + `<button onclick="document.getElementById('materials`+tier+`').style.display='none';">hide</button><button onclick="document.getElementById('materials`+tier+`').style.display = 'flex';">show</button><br><div id="materials` + tier + `" class="techtierbonuses"><table>`;
		for(const resource in resources){
			if(resources[resource].tier == tier){
				html += `<tr><td><div class="resourcenamelabel">`+resource+`</div></td><td><input type="number" step="any" id="` + (resource + "speedbonus") + `" value="1"></input></td><td><input type="number" step="any" id="` + resource + `prodbonus" value="1"></input></td><td><input type="number" step="any" id="` + resource + `effbonus" value="1"></input></td></tr>`;
			}
		}
		html += `</table></div>`
	}
	return html;
}
function recalculateStats(){
	tilesunlocked = parseInt(document.getElementById("numtilesinput").value);
	for(resource in resources){
		resources[resource].speedbonus = parseFloat(document.getElementById(resource + "speedbonus").value);
		resources[resource].prodbonus = parseFloat(document.getElementById(resource + "prodbonus").value);
		resources[resource].effbonus = parseFloat(document.getElementById(resource + "effbonus").value);
	}
	let materialoverviewhtml = `<table><tr id="materialtableheader"><td>Material</td><td>Number Needed</td><td>Total Time</td><td>% Total Time</td></tr><tr><td id="space"></tr>`;
	let cost = resources[gettargetmaterial().mat].getCostOf(gettargetmaterial().amount);
	cost[gettargetmaterial().mat] = gettargetmaterial().amount;
	for(item in cost){
		materialoverviewhtml += `<tr>
		<td>`+
		item
		+`</td>
		<td>`+
		Math.ceil(cost[item] / Math.floor(resources[item].prodbonus)) * Math.floor(resources[item].prodbonus)
		+`</td>
		<td>`+
		timeformat(resources[item].gettime(cost[item]))
		+`</td>
		<td>`+
		Math.floor((resources[item].gettime(Math.ceil(cost[item] / Math.floor(resources[item].prodbonus))))/(resources[gettargetmaterial().mat].gettotaltime(gettargetmaterial().amount)) * 10000) / 100
		+`%</td>
		</tr>`;
	}
	materialoverviewhtml += `</table>`;
	document.getElementById("materialoverview").innerHTML = materialoverviewhtml;
}
function gettargetmaterial(){
	let target = {
		mat: document.getElementById("targetmaterialselection").value,
		amount: document.getElementById("targetamountselection").value
		
	};
	return target;
}
function timeformat(time){
	let days = Math.floor(time / 86400);
	time -= days * 86400;
	let hours = Math.floor(time / 3600);
	time -= hours * 3600;
	let minutes = Math.floor(time / 60);
	time -= minutes * 60;
	let ret = "";
	if(days > 0){
		ret += days + " days, ";
	}
	if(hours > 0){
		ret += hours + " hours, ";
	}
	if(minutes > 0){
		ret += minutes + " minutes, ";
	}
	ret += time + " seconds";
	return ret;
}
new resource("iron ore", 3, {}, 1);
new resource("copper ore", 3, {}, 1);
new resource("iron bar", 6, {"iron ore": 2}, 1);
new resource("copper bar", 6, {"copper ore": 2}, 1);
new resource("tier 1 think juice", 10, {"cardboard bar": 3, "glue bar": 3}, 1);
new resource("cardboard ore", 3, {}, 1);
new resource("cardboard bar", 6, {"cardboard ore": 2}, 1);
new resource("glue ore", 3, {}, 1);
new resource("glue bar", 6, {"glue ore": 2}, 1);
new resource("crappy iron cog", 10, {"iron bar": 2}, 2);
new resource("crappy copper wires", 10, {"copper bar": 4}, 2);
new resource("crappy staples", 10, {"iron bar": 2}, 2);
new resource("crappy computer chip", 10, {"iron bar": 3, "crappy copper wires": 3, "crappy staples": 3}, 2);
new resource("tier 2 think juice", 10, {"crappy iron cog": 3, "crappy computer chip": 2}, 2);
new resource("metal frame", 15, {"steel bar": 5, "iron bar": 5}, 3);
new resource("crappy wheels", 15, {"crappy iron cog": 5, "crappy copper wires": 5}, 3);
new resource("crappy hard drive", 15, {"crappy computer chip": 3, "metal frame": 1}, 3);
new resource("shitty robo brain", 15, {"metal frame": 4, "crappy computer chip": 10, "crappy wheels": 2, "crappy hard drive": 1}, 3);
new resource("steel ore", 5, {}, 3);
new resource("steel bar", 15, {"steel ore": 3}, 3);
new resource("steel wool", 15, {"steel bar": 5}, 3);
new resource("crappy reactor", 20, {"metal frame": 3, "crappy computer chip": 10}, 3);
new resource("tier 3 think juice", 20, {"shitty robo brain": 2, "crappy reactor": 2, "crappy hard drive": 2}, 3);
new resource("tier 4 think juice", 20, {"crappy rocket ship": 1, "basic computer chip": 2, "basic fuel": 2}, 4);
new resource("crappy rocket ship", 120, {"decent wiring": 10, "metal frame": 10, "basic computer chip": 5, "crappy reactor": 5}, 4);
new resource("decent wiring", 20, {"crappy copper wires": 5, "copper bar": 50}, 4);
new resource("superglue", 20, {"glue bar": 25, "cardboard bar": 25}, 4);
new resource("basic fuel", 20, {"superglue": 1, "steel wool": 2}, 4);
new resource("killbot v1", 30, {"metal frame": 4, "crappy wheels": 2, "shitty robo brain": 1, "crappy reactor": 2, "steel vest": 1, "steel blade": 1}, 4);
new resource("steel vest", 20, {"iron bar": 100, "steel wool": 3}, 4);
new resource("steel blade", 20, {"steel bar": 15, "iron bar": 100}, 4);
new resource("basic computer chip", 20, {"decent wiring": 3, "superglue": 2, "metal frame": 2, "crappy computer chip": 4}, 4); 
new resource("cardboard spitdrone", 30, {"metal frame": 2, "crappy reactor": 1, "crappy hard drive": 1, "cardboard bar": 50, "glue bar": 50}, 3);
new resource("meat ore", 5, {}, 5);
new resource("meat bar", 10, {"meat ore": 3}, 5);
new resource("bone ore", 5, {}, 5);
new resource("bone bar", 10, {"bone ore": 3}, 5);
new resource("bone beam", 15, {"steel bar": 25, "bone bar": 3}, 5);
new resource("beating heart", 15, {"meat bar": 3}, 5);
new resource("tier 1 flesh juice", 20, {"beating heart": 1, "bone beam": 1}, 5);
new resource("bone frame", 20, {"bone beam": 2, "iron bar": 400, "copper bar": 400, "metal frame": 2}, 6);
new resource("bio-reactor", 30, {"beating heart": 5, "bone frame": 2, "crappy reactor": 25, "steel bar": 50}, 6);
new resource("robo butt", 30, {"bone treads": 2, "bone frame": 2, "bio-reactor": 1, "crappy hard drive": 50}, 6);
new resource("bone treads", 30, {"metal frame": 10, "bone frame": 1}, 6);
new resource("tier 2 flesh juice", 30, {"bio-reactor": 1, "bone treads": 1, "robo butt": 1}, 6);
new resource("offensive buttbot", 30, {"gun mk 1": 2, "robo butt": 1}, 7);
new resource("defensive buttbot", 30, {"basic shield generator": 2, "robo butt": 1}, 7);
new resource("basic shield generator", 30, {"bio-reactor": 3, "bone frame": 2, "basic fuel": 10}, 7);
new resource("gun mk 1", 30, {"bone frame": 10, "metal frame": 100, "bio-reactor": 3}, 7);
new resource("bio-chip", 30, {"basic computer chip": 10, "bone frame": 4, "meat bar": 20}, 7);
new resource("tier 3 flesh juice", 30, {"bio-chip": 4, "basic shield generator": 4, "gun mk 1": 4}, 7);
new resource("flesh engine", 30, {"bio-chip": 3, "decent wiring": 1000, "metal frame": 5000, "bone frame": 20}, 8);
new resource("flesh-assisted reactive transport solution", 30, {"meat bar": 300, "basic fuel": 100, "bio-chip": 1}, 8);
new resource("the biocomputer", 30, {"bio-chip": 3, "crappy hard drive": 1000, "bone frame": 10}, 8);
new resource("the flesh rocket", 30, {"the biocomputer": 1, "flesh-assisted reactive transport solution": 25, "flesh engine": 6, "metal frame": 50000, "bone frame": 100}, 8);
new resource("tier 4 flesh juice", 30, {"the biocomputer": 1, "flesh engine":1, "the flesh rocket": 1}, 8); 
new resource("technetium ore", 5, {}, 9);
new resource("technetium bar", 10, {"technetium ore": 2}, 9);
new resource("plastic ore", 5, {}, 9);
new resource("plastic bar", 10, {"plastic ore": 2}, 9);
new resource("tech alloy", 10, {"iron bar": 10000, "copper bar": 10000, "bone beam": 1000, "meat bar": 3000, "technetium bar": 2, "plastic bar": 2}, 9);
document.getElementById("targetmaterialselection").innerHTML = targetmaterialselectionhtml();
document.getElementById("bonuses").innerHTML = bonusinputhtml();