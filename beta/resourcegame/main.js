gamestate = {
	resources: {},
	recipes: {},
	actions: {},
	saveableelements: {}
}

class saveableelement{
	constructor(data, id){
		this.data = data;
		this.id = id
		gamestate.saveableelements[this.id] = this;
	}
}

class resource extends saveableelement{
	constructor(name, unlockcondition, color){
		super({amount: 0, most: 0, unlocked: false}, "resource_" + name);
		this.name = name;
		this.unlockcondition = unlockcondition;
		this.color = color;
		gamestate.resources[this.name] = this;
	}
}

class recipe extends saveableelement{
	constructor(name, unlockcondition, time, inputs, outputs){
		super({progress: 0, timescompleted: 0}, "recipe_" + name);
		this.name = name;
		this.unlockcondition = unlockcondition;
		this.time = time;
		this.inputs = inputs;
		this.outputs = outputs;
		gamestate.recipes[this.name] = this;
	}
}

class action extends saveableelement{
	constructor(name, unlockcondition, time, oncompletion){
		super({progress: 0, timescompleted: 0}, "action_" + name);
		this.name = name;
		this.unlockcondition = unlockcondition;
		this.time = time;
		this.oncompletion = oncompletion;
		gamestate.actions[this.name] = this;
	}
}

function canafford(cost){
	for(const resource in cost.properties){
		
	}
}

function update_display(){
	html = "";
	counthtml = "";
	for(const r in gamestate.resources){
		if(gamestate.resources[r].data.unlocked == true){
			newcounthtml = `<div class="resourcedisplay" style="color:` + gamestate.resources[r].color + `">`;
			newcounthtml += gamestate.resources[r].data.amount + `</div>`;
			newhtml = `<div class="resourcedisplay" style="color:` + gamestate.resources[r].color + `">`;
			newhtml += gamestate.resources[r].name + `</div>`;
			html += newhtml;
			counthtml += newcounthtml;
		}
	}
	document.getElementById("leftresourcepanel").innerHTML = html;
	document.getElementById("leftresourcecountpanel").innerHTML = counthtml;
	
	selectorhtml = ""
	for(const a in gamestate.actions){
		if(gamestate.actions[a].data.unlocked){
			selectorhtml += `<option value="` + gamestate.actions[a].name + `">` + gamestate.actions[a].name + `</option>`;
		}
	}
	document.getElementById("actionsselector").innerHTML = selectorhtml;
}

function update(){
	for(const r in gamestate.resources){
		if(gamestate.resources[r].unlockcondition(gamestate)){
			gamestate.resources[r].data.unlocked = true;
		}
	}
	for(const a in gamestate.actions){
		if(gamestate.actions[a].unlockcondition(gamestate)){
			gamestate.actions[a].data.unlocked = true;
		}
	}
}

new resource("sticks", function(gamestate){return true;}, "#8a6813")
new resource("logs", function(gamestate){return true;}, "#634b0d")
new resource("shelters", function(gamestate){return gamestate.resources["shelters"].data.most > 0;}, "#6e5105")

new recipe("build shelter", function(gamestate){return gamestate.resources["sticks"].most >= 15 && gamestate.resources["logs"].data.most >= 5;}, 10, function(){return {"sticks": 15, "logs": 5}}, function(){return {"shelters": 1}});

new action("gather sticks", function(gamestate){return true}, 5, function(gamestate){gamestate.resources["sticks"].data.amount += 1; if(gamestate.actions["gather sticks"].data.completions % 3 == 0){gamestate.resources["logs"].data.amount += 1;}});
setInterval(update, 20);
setInterval(update_display, 50);