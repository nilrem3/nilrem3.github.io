game = new jgame(document.getElementById("test-canvas"), 
{
	FPS:50, 
	TPS:3, 
	WIDTH: 1000,
	HEIGHT: 1000,
	TITLE: "gacha",
	SKIP_FRAMES: false,
	gamestate: {
		persistent_data: {
			world_data: {
				position: {
					x: 2,
					y: 2
				},
				zone: "starting",
				zone_states: {
					
				}
			},
			character_data: {
				selectedcharacters: ["kaiya"]
			}
		},
		mode: "world", //combat, world, menu
		reset_combat_state: function(){
			this.combat_state.submode = "move select";
			this.combat_state.agents = [];
			this.combat_state.deadagents = []
		},
		combat_state: {
			submode: "move select", //moveselect, targetselect, animation
			agents: [],
			deadagents: [],
			turnstep: function(){
				//remove dead agents
				for(let a = 0; a < this.agents.length; a++){
					if(this.agents[a].hp <= 0){
						newagents = this.agents.filter(agent => agent.hp > 0);
						newlydeceasedagents = this.agents.filter(agent => !newagents.includes(agent))
						for(let n = 0; n < newlydeceasedagents.length; n++){
							this.deadagents.push(newlydeceasedagents[n])
						}
						this.agents = newagents
					}
				}
				//check if combat is over
				if(this.agents.length == 0){ //if everyone died, it was a tie
					game.game.gamestate.mode = "world";
					game.game.gamestate.reset_combat_state();
					return
				}
				gameover = true
				for(let a = 0; a < this.agents.length; a++){
					//if everyone alive is on the same team, there is a clear winner
					if(this.agents[a].team != this.agents[0].team){
						gameover = false
					}
				}
				if(gameover){
					//if there's only one team left
					if(this.agents[0].team != "player"){
						this.submode = "lose screen";
					}else{
						this.submode = "win screen";
					}
					return
				}
				//find out which agent is next
				let anyready = false;
				for(let a = 0; a < this.agents.length; a++){
					if(this.agents[a].initiative >= 50){
						anyready=true;
						break;
					}
				}
				this.agents.sort(function(a, b){return a.initiative - b.initiative}); //sort by initiative
				this.agents.reverse(); //bring the highest initiative to the start
				while(this.current_agent.initiative < 50){
					for(let a = 0; a < this.agents.length; a++){
						this.agents[a].initiative += this.agents[a].speed;
					}
					this.agents.sort(function(a, b){return a.initiative - b.initiative}); //sort by initiative
					this.agents.reverse(); //bring the highest initiative to the start
				}
				this.current_agent.initiative -= 50;
				this.submode = "move select";
			},
			get current_agent(){
				return this.agents[0]; //assumes that turnstep has been called correctly after each agent acts.
			},
			misc_data: {},
			queued_move: null
		}
	},
	init: function(){
		let state = this.gamestate;
		drawn_buttons.push(new drawn_button(new rectangle(0, 900, 250, 100), 
					function(state){return state.mode == "combat" && state.combat_state.submode == "move select" && state.combat_state.current_agent.player_controlled == true;}, 
					function(state){
						if(state.combat_state.current_agent.basicattack.condition(state)){
							if(state.combat_state.current_agent.basicattack.requires_target){
								state.combat_state.queued_move = state.combat_state.current_agent.basicattack;
								state.combat_state.submode = "target select";
							}else{
								state.combat_state.current_agent.basicattack.callback(state);
								state.combat_state.turnstep();
							}
						}
					}, 
					function(state){return state.mode == "combat" && state.combat_state.submode == "move select" && state.combat_state.current_agent.player_controlled == true;}, 
					new rectangle(0, 900, 250, 100),
					[0, 0, 0],
					[0, 0, 0],
					function(state){return "test words";}));
	},
	draw: function(){
		game.draw.clear();
		game.draw.rect(new rectangle(0, 0, this.WIDTH, this.HEIGHT), [0, 0, 0]);
		for(let b = 0; b < drawn_buttons.length; b++){
			if(drawn_buttons[b].draw_condition(this.gamestate)){
				game.draw.rect(drawn_buttons[b].clickrect, drawn_buttons[b].color);
				game.draw.textbox(drawn_buttons[b].words(this.gamestate), drawn_buttons[b].draw_rect, drawn_buttons[b].text_color);
			}
		}
		for(let b = 0; b < fill_bars.length; b++){
			if(fill_bars[b].condition(this.gamestate)){
				game.draw.rect(fill_bars[b].rect, fill_bars[b].border_color);
				let dir = fill_bars[b].fill_direction;
				if(dir == "ltr"){
					game.draw.filled_rect(new rectangle(fill_bars[b].rect.x + 1, fill_bars[b].rect.y + 1, Math.max(Math.floor((fill_bars[b].rect.width - 2) * fill_bars[b].get_fill(this.gamestate)), 0), fill_bars[b].rect.height - 2), fill_bars[b].fill_color);
				}else if(dir == "rtl"){
					let fill = fill_bars[b].get_fill(this.gamestate);
					game.draw.filled_rect(new rectangle(fill_bars[b].rect.x + 1 + Math.floor(fill_bars[b].rect.width - (fill_bars[b].rect.width * fill)), fill_bars[b].rect.y + 1, Math.floor((fill_bars[b].rect.width - 2) * fill_bars[b].fill), fill_bars[b].height - 2), fill_bars[b].fill_color);
				}else if(dir == "td"){
					game.draw.filled_rect(new rectangle(fill_bars[b].rect.x + 1, fill_bars[b].rect.y + 1, fill_bars[b].width - 2, Math.floor((fill_bars[b].rect.height - 2) * fill_bars[b].get_fill(this.gamestate))), fill_bars[b].fill_color);
				}else if(dir == "bu"){
					let fill = fill_bars[b].get_fill(this.gamestate);
					game.draw.filled_rect(new rectangle(fill_bars[b].rect.x + 1, fill_bars[b].rect.y + 1 + Math.floor(fill_bars[b].rect.height - (fill_bars[b].rect.height * fill)), fill_bars[b].rect.width - 2, Math.floor((fill_bars[b].rect.height - 2) * fill)));
				}
			}
		}
		if(this.gamestate.mode == "combat"){
			if (this.gamestate.combat_state.submode != "win screen" && this.gamestate.combat_state.submode != "lose screen"){
				for(let a = 0; a < this.gamestate.combat_state.agents.length; a++){
					game.draw.img(this.gamestate.combat_state.agents[a].icon, 50 * a, 0, 50, 50);
					game.draw.filled_rect(new rectangle(50 * a, 50, 50 * (this.gamestate.combat_state.agents[a].hp / this.gamestate.combat_state.agents[a].maxhp), 10), [255, 0, 0]);
					game.draw.rect(new rectangle(50 * a, 50, 50, 10), [0, 0, 0]);
				}
			}else if(this.gamestate.combat_state.submode == "win screen"){
				game.draw.textbox("YOU WIN!", new rectangle(0, 0, 1000, 1000), [0, 0, 0])
			}else if(this.gamestate.combat_state.submode == "lose screen"){
				game.draw.filled_rect(new rectangle(0, 0, 1000, 1000), [0, 0, 0]);
				game.draw.textbox("YOU LOSE", new rectangle(0, 0, 1000, 1000), [128, 0, 0]);
			}
			
			if(this.gamestate.combat_state.submode == "target select"){
				let targets = get_valid_targets(this.gamestate.combat_state.current_agent, this.gamestate.combat_state.agents, this.gamestate.combat_state.queued_move.cantargetfriendlyagents, this.gamestate.combat_state.queued_move.cantargethostileagents);
				for(let t = 0; t < targets.length; t++){
					game.draw.textbox(targets[t].name, new rectangle(0, 60 + (t * 100), 200, 100), [0, 0, 0]);
				}
			}
		}else if(this.gamestate.mode == "world"){
			let currentzoneid = this.gamestate.persistent_data.world_data.zone;
			for(let x = -10; x < 10; x++){
				for(let y = -10; y < 10; y++){
					if(game_assets.map_areas[currentzoneid] != undefined && game_assets.map_areas[currentzoneid].tiles[x + this.gamestate.persistent_data.world_data.position.x] != undefined && game_assets.map_areas[currentzoneid].tiles[x + this.gamestate.persistent_data.world_data.position.x][y + this.gamestate.persistent_data.world_data.position.y] != undefined){
						game.draw.img(game_assets.map_areas[currentzoneid].sprites[game_assets.map_areas[currentzoneid].tiles[x + this.gamestate.persistent_data.world_data.position.x][y + this.gamestate.persistent_data.world_data.position.y].type ?? "empty"], (x + 10) * 50, (y + 10) * 50, 50, 50);
					}else{
						game.draw.img(game_assets.map_areas[currentzoneid].sprites["empty"], (x + 10) * 50, (y + 10) * 50, 50, 50);
					}
				}
			}
			game.draw.img("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/220px-SNice.svg.png",  500, 500, 50, 50); //player
		}else if(this.gamestate.mode == "menu"){
			
		}
	},
	update: function(){
		if(this.gamestate.mode == "combat" && this.gamestate.combat_state.current_agent.player_controlled == false && this.gamestate.combat_state.submode != "win screen" && this.gamestate.combat_state.submode != "lose screen"){
			this.gamestate.combat_state.current_agent.ai(this.gamestate);
			this.gamestate.combat_state.turnstep();
		}
	},
	onClick: function(x, y){
		for(let b = 0; b < buttons.length; b++){
			if(buttons[b].rect.containspoint(x, y) && buttons[b].condition(this.gamestate)){
				buttons[b].callback(this.gamestate);
			}
		}
		if(this.gamestate.mode == "combat"){
			if(this.gamestate.combat_state.submode == "target select"){
				let targets = get_valid_targets(this.gamestate.combat_state.current_agent, this.gamestate.combat_state.agents, this.gamestate.combat_state.queued_move.cantargetfriendlyagents, this.gamestate.combat_state.queued_move.cantargethostileagents);
				for(let t = 0; t < targets.length; t++){
					if(new rectangle(0, 60 + (t * 100), 200, 100).containspoint(x, y)){
						this.gamestate.combat_state.queued_move.callback(this.gamestate, targets[t]);
						this.gamestate.combat_state.turnstep();
					}
				}
			}
		}
	},
	onKeyDown: function(keycode){
		if(this.gamestate.mode == "world"){
			let moved = false;
			switch(keycode){
				case 38:
					//up arrow
					if(get_tile_at_location(this.gamestate.persistent_data.world_data.zone, this.gamestate.persistent_data.world_data.position.x, this.gamestate.persistent_data.world_data.position.y - 1).walkable){
						this.gamestate.persistent_data.world_data.position.y -= 1;
						moved = true;
					}
					break;
				case 37:
					//left arrow
					if(get_tile_at_location(this.gamestate.persistent_data.world_data.zone, this.gamestate.persistent_data.world_data.position.x - 1, this.gamestate.persistent_data.world_data.position.y).walkable){
						this.gamestate.persistent_data.world_data.position.x -= 1;
						moved = true;
					}
					break;
				case 39:
					//right arrow
					if(get_tile_at_location(this.gamestate.persistent_data.world_data.zone, this.gamestate.persistent_data.world_data.position.x + 1, this.gamestate.persistent_data.world_data.position.y).walkable){
						this.gamestate.persistent_data.world_data.position.x += 1;
						moved = true;
					}
					break;
				case 40:
					//up arrow
					if(get_tile_at_location(this.gamestate.persistent_data.world_data.zone, this.gamestate.persistent_data.world_data.position.x, this.gamestate.persistent_data.world_data.position.y + 1).walkable){
						this.gamestate.persistent_data.world_data.position.y += 1;
						moved = true;
					}
					break;
			}
			if(moved){
				let tile = get_tile_at_location(this.gamestate.persistent_data.world_data.zone, this.gamestate.persistent_data.world_data.position.x, this.gamestate.persistent_data.world_data.position.y);
				if(tile.type == "trigger" || tile.type == "combat"){
					tile.callback();
				}
			}
		}
	}
});
buttons = [];
drawn_buttons = [];
fill_bars = [];
game_assets = {
	map_areas: {},
	tile_data: {
		walkable: {
			"wall": false,
			"floor": true,
			"empty": false
		}
	},
	enemy_tables: {
		
	},
	characters: {
		
	},
	moves: {
		
	},
	enemy_ais: {}
}
class click_button{
	constructor(rect, condition, callback){
		this.rect = rect;
		this.condition = condition;
		this.callback = callback;
	}
}

class drawn_button{
	constructor(clickrect, click_condition, click_callback, draw_condition, draw_rect, color, text_color, words){
		this.clickrect = clickrect;
		this.click_condition = click_condition;
		this.click_callback = click_callback;
		this.draw_condition = draw_condition;
		this.color = color;
		this.text_color = text_color;
		this.words = words;
		this.draw_rect = draw_rect;
		buttons.push(new click_button(clickrect, click_condition, click_callback));
	}
}

class progress_bar{
	constructor(rect, border_color, fill_color, fill_direction, get_fill, condition){
		this.rect = rect;
		this.border_color = border_color;
		this.fill_color = fill_color;
		this.fill_direction = fill_direction;
		this.get_fill = get_fill;
		this.condition = condition;
	}
}
class map_zone{
	constructor(id, tiles, sprites){
		this.id = id;
		this.tiles = tiles;
		this.sprites = sprites; //dict of tile type to sprite url
		game.game.gamestate.persistent_data.world_data.zone_states[id] = {}
		game_assets.map_areas[id] = this;
	}
	get save_data(){
		return game.gamestate.persistent_data.world_data.zone_states[this.id];
	}
}
class map_tile{
	constructor(type, xpos, ypos){
		this.x = xpos;
		this.y = ypos;
		this._type = type;
	}
	get walkable(){
		return game_assets.tile_data.walkable[this.type] ?? true;
	}
	get type(){
		return this._type;
	}
}
class door extends map_tile{
	constructor(xpos, ypos){
		super("closed door", xpos, ypos);
		this.opened = false;
	}
	get walkable(){
		return this.opened;
	}
	get type(){
		if(this.opened){
			return "open door";
		}
		return "closed door";
	}
}
class trigger extends map_tile{
	constructor(callback, xpos, ypos){
		super("trigger", xpos, ypos);
		this.callback = callback;
	}
}
class combat_trigger extends trigger{
	constructor(get_enemies_callback, xpos, ypos){
		super(function(){ start_combat(get_enemies_callback(game.game.gamestate));}, xpos, ypos);
		this._type = "combat";
	}
}

class combat_agent{
	constructor(name, atk, def, maxhp, speed, player_controlled, icon, team){
		this.name = name;
		this.atk = atk;
		this.def = def;
		this.maxhp = maxhp;
		this.hp = maxhp;
		this.speed = speed;
		this.initiative = 0;
		this.player_controlled = player_controlled;
		this.icon = icon;
		this.team = team;
	}
}

class player_character{
	constructor(name, icon, atk, def, maxhp, speed, basicattack, secondaryattack, otherattack, ultimateattack){
		this.name = name;
		this.icon = icon;
		this._atk = atk;
		this._def = def;
		this._maxhp = maxhp;
		this.hp = maxhp;
		this._speed = speed;
		this.basicattack = basicattack;
		this.secondaryattack = secondaryattack;
		this.otherattack = otherattack;
		this.ultimateattack = ultimateattack;
		this.level = 1;
		game_assets.characters[this.name] = this;
	}
	get atk(){
		return this._atk * ((19 + this.level) / 20);
	}
	get def(){
		return this._def * ((19 + this.level) / 20);
	}
	get maxhp(){
		return this._maxhp * ((19 + this.level) / 20);
	}
	get speed(){
		return this._speed * ((19 + Math.pow(this.level, 1/3)) / 20);
	}
}

class player_character_agent extends combat_agent{
	constructor(character){
		super(character.name, character.atk, character.def, character.maxhp, character.speed, true, character.icon, "player");
		this.basicattack = character.basicattack;
		this.secondaryattack = character.secondaryattack;
		this.otherattack = character.otherattack;
		this.ultimateattack = character.ultimateattack;
		this.hp = character.hp;
	}
}

class enemy_agent extends combat_agent{
	constructor(name, atk, def, maxhp, speed, icon, ai){
		super(name, atk, def, maxhp, speed, false, icon, "enemies");
		this.ai = ai;
	}
}

class combat_action{
	constructor(name, condition, callback, requires_target, cantargetfriendlyagents = false, cantargethostileagents = true){
		this.name = name;
		this.condition = condition;
		this.callback = callback;
		this.requires_target = requires_target;
		this.cantargetfriendlyagents = cantargetfriendlyagents;
		this.cantargethostileagents = cantargethostileagents;
		game_assets.moves[this.name] = this;
	}
}

function text_to_tile_dicts(t){
	var lines = t.toLowerCase().split('|');
	var longestline = 0;
	for(let l = 0; l < lines.length; l++){
		longestline = Math.max(longestline, lines[l].length);
	}
	var tiles = {}
	for(let x = 0; x < longestline; x++){
		tiles[x] = {}
		for(let y = 0; y < lines.length; y++){
			var newtile = undefined;
			if(lines[y][x] === "w"){
				newtile = new map_tile("wall", x, y);
			}else if(lines[y][x] === "f"){
				newtile = new map_tile("floor", x, y);
			}else if(lines[y][x] === "e"){
				newtile = new map_tile("empty", x, y);
			}
			tiles[x][y] = newtile;
		}
	}
	return tiles;
}
function get_tile_at_location(areacode, x, y){
	if(game_assets.map_areas[areacode] != undefined){
		if(game_assets.map_areas[areacode].tiles[x] != undefined){
			if(game_assets.map_areas[areacode].tiles[x][y] != undefined){
				return game_assets.map_areas[areacode].tiles[x][y];
			}
		}
	}
	return new map_tile("empty", x, y);
}
function start_combat(agents){
	game.game.gamestate.mode = "combat";
	game.game.gamestate.combat_state.agents = agents;
	for(let c = 0; c < game.game.gamestate.persistent_data.character_data.selectedcharacters.length; c++){
		game.game.gamestate.combat_state.agents.push(new player_character_agent(game_assets.characters[game.game.gamestate.persistent_data.character_data.selectedcharacters[c]]));
	}
	for(let a = 0; a < game.game.gamestate.combat_state.agents.length; a++){
		game.game.gamestate.combat_state.agents[a].initiative = Math.random() * game.game.gamestate.combat_state.agents[a].speed;
	}
}

function choice(list){
	index = Math.floor(Math.random() * list.length);
	return list[index];
}

function get_valid_targets(agent, agents, cantargetfriendlyagents, cantargethostileagents){
	let ret = [];
	for(let a = 0; a < agents.length; a++){
		if(agents[a].team == agent.team && cantargetfriendlyagents == true){
			ret.push(agents[a]);
		}else if(agents[a].team != agent.team && cantargethostileagents == true){
			ret.push(agents[a]);
		}
	}
	return ret;
}

function prepare_map_zones(){
new map_zone("starting", text_to_tile_dicts("wwwwwwwww|wfffwwwww|wfffffff|wfffwfwwfw|wwwwwfwwfw|eeeewfwwfw|eeeewffffw|eeeewwwwww"), {"wall": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Hadrian%27s_wall_at_Greenhead_Lough.jpg/181px-Hadrian%27s_wall_at_Greenhead_Lough.jpg", 
																																	"floor": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Parquet_flooring_in_Mus%C3%A9e_des_arts_d%C3%A9coratifs_de_Strasbourg.jpg/174px-Parquet_flooring_in_Mus%C3%A9e_des_arts_d%C3%A9coratifs_de_Strasbourg.jpg", 
																																	"empty": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Nothing.jpg",
																																	"closed door": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Qila-i-Kuhna_mosque_side_door.jpg/214px-Qila-i-Kuhna_mosque_side_door.jpg",
																																	"open door": "https://images.squarespace-cdn.com/content/v1/59d195afcf81e0a1cd99b680/1601019159275-XX23OOK1UW4E1V7QEOYY/ke17ZwdGBToddI8pDm48kDHPSfPanjkWqhH6pl6g5ph7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0mwONMR1ELp49Lyc52iWr5dNb1QJw9casjKdtTg1_-y4jz4ptJBmI9gQmbjSQnNGng/matthew-t-rader-zq4UnZoy5AQ-unsplash.jpg?format=1500w",
																																	"trigger": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Arcade_video_game_buttons.jpg/220px-Arcade_video_game_buttons.jpg",
																																	"combat": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Villainc.svg/220px-Villainc.svg.png"});
game_assets.map_areas["starting"].tiles[8][2] = new door(8, 2);
game_assets.map_areas["starting"].tiles[8][3] = new trigger(function(){game_assets.map_areas["starting"].tiles[8][2].opened = true;}, 8, 3);
game_assets.map_areas["starting"].tiles[7][6] = new combat_trigger(function(gamestate){
	let agents = [];
	while(Math.random() < 0.5 || agents.length == 0){
		let newagent = choice(game_assets.enemy_tables["starting"]);
		agents.push(new enemy_agent(newagent.name, newagent.atk, newagent.def, newagent.maxhp, newagent.speed, newagent.icon, newagent.ai));
	}
	return agents;
}, 7, 6);
}
prepare_map_zones();

function prepare_enemy_ais(){
	game_assets.enemy_ais["basic ai"] = function(state){
		let targets = get_valid_targets(this, state.combat_state.agents, false, true);
		let target = choice(targets);
		target.hp -= 5;
	}
}
prepare_enemy_ais();

function prepare_enemy_tables(){
	this.game_assets.enemy_tables["starting"] = [];
	this.game_assets.enemy_tables["starting"].push(new enemy_agent("dog", 5, 5, 50, 5, "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Brooks_Chase_Ranger_of_Jolly_Dogs_Jack_Russell.jpg/87px-Brooks_Chase_Ranger_of_Jolly_Dogs_Jack_Russell.jpg", game_assets.enemy_ais["basic ai"]));
	this.game_assets.enemy_tables["starting"].push(new enemy_agent("cat", 4, 4, 40, 8, "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Kittyply_edit1.jpg/220px-Kittyply_edit1.jpg", game_assets.enemy_ais["basic ai"]));
	this.game_assets.enemy_tables["starting"].push(new enemy_agent("hamster", 2, 2, 20, 4.5, "https://upload.wikimedia.org/wikipedia/commons/9/93/Cashew_sable_syrian_hamster.jpg", game_assets.enemy_ais["basic ai"]));
	this.game_assets.enemy_tables["starting"].push(new enemy_agent("snake", 6, 2, 30, 7, "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Southern_Ringneck_snake%2C_Diadophis_punctatus.jpg/220px-Southern_Ringneck_snake%2C_Diadophis_punctatus.jpg", game_assets.enemy_ais["basic ai"]));
}
prepare_enemy_tables();

function prepare_combat_actions(){
	new combat_action("test basic attack", function(state){return true;}, function(state, target){target.hp -= 5;}, true);
	new combat_action("test secondary attack", function(state){return true;}, function(state, target){return;}, false);
}
prepare_combat_actions();

function prepare_characters(){
	new player_character("kaiya", "https://img.favpng.com/25/9/9/spearman-s-rank-correlation-coefficient-rise-of-the-kings-wiki-curse-png-favpng-rLr6kZCWSCzvr9pCa7B9Enhej.jpg", 5, 5, 50, 5, game_assets.moves["test basic attack"], game_assets.moves["test secondary attack"], null, null);
}
prepare_characters();
