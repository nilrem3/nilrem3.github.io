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
	console.log("updating display");
	html = "";
	for(const r in gamestate.resources.properties){
		if(gamestate.resources[r].data.unlocked == true){
			newhtml = `<div class="resourcedisplay" style="color:` + gamestate.resources[r].color + `">`;
			newhtml += gamestate.resources[r].name + " " + gamestate.resources[r].data.amount + `</div>`;
			html += newhtml;
			console.log(html);
		}
		console.log("locked resource");
	}
	document.getElementById("leftresourcepanel").innerHTML = html;
}

function update(){
	for(const r in gamestate.resources.properties){
		if(r.unlockcondition(gamestate)){
			console.log("hi")
			r.data.unlocked = true;
		}
	}
}

new resource("sticks", function(gamestate){console.log("returning true"); return true;}, "#8a6813")
new resource("logs", function(gamestate){return true;}, "#634b0d")
new resource("shelters", function(gamestate){return gamestate.resources["shelters"].data.most > 0;}, "#6e5105")

new recipe("build shelter", function(gamestate){return gamestate.resources["sticks"].most >= 15 && gamestate.resources["logs"].data.most >= 5;}, 10, function(){return {"sticks": 15, "logs": 5}}, function(){return {"shelters": 1}});