gamestate = {
	resources: {},
	recipes: {},
	saveableelements: {}
}

class saveableelement{
	constructor(data, id){
		this.data = data;
		let getterfunc = function(k){
			return { get [k](){
					if(this.data.properties.contains(k)){
						return this.data[k];
					}
					return this[k];
				}
			};
		}
		let setterfunc = function(k){
			const kk = k;
			return {
				set [kk](val){
					if(this.data.properties.contains(kk)){
						this.data[kk] = val;
					}
					this[kk] = val;
				}
			} 
		}
		for(var k in this.data.properties){
			Object.defineProperty(this, k, getterfunc(k));
			Object.defineProperty(this, k, setterfunc(k));
		}
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
	}
}

class action extends saveableelement{
	constructor(name, unlockcondition, time, oncompletion){
		super({progress: 0, timescompleted: 0}, "action_" + name);
		this.name = name;
		this.unlockcondition = unlockcondition;
		this.time = time;
		this.oncompletion = oncompletion;
	}
}

function canafford(cost){
	for(const resource in cost.properties){
		
	}
}

function update_display(){
	html = "";
	for(const r in gamestate.resources.properties){
		if(gamestate.resources[r].unlocked == true){
			newhtml = `<div class="resourcedisplay" style="color:` + gamestate.resources[r].color + `">`;
			newhtml += gamestate.resources[r].name + " " + gamestate.resources[r].amount + `</div>`;
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
			r.unlocked = true;
		}
	}
}

new resource("sticks", function(gamestate){return true;}, "#8a6813")
new resource("logs", function(gamestate){return true;}, "#634b0d")
new resource("shelters", function(gamestate){return gamestate.resources["shelters"].most > 0;}, "#6e5105")

new recipe("build shelter", function(gamestate){return gamestate.resources["sticks"].most >= 15 && gamestate.resources["logs"].most >= 5;}, 10, function(){return {"sticks": 15, "logs": 5}}, function(){return {"shelters": 1}});