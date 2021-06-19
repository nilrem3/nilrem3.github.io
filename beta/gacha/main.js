game = new jgame(document.getElementById("test-canvas"), 
{
	FPS:50, 
	TPS:50, 
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
			}
		},
		mode: "world", //combat, world, menu
		combat_state: {
			submode: "moveselect" //moveselect, targetselect, animation
		}
	},
	init: function(){
		
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
			if(this.gamestate.combat_state.submode == "targetselect"){
				
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
		
	},
	onClick: function(x, y){
		for(let b = 0; b < buttons.length; b++){
			if(buttons[b].rect.containspoint(x, y) && buttons[b].condition(this.gamestate)){
				buttons[b].callback(this.gamestate);
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
				if(tile.type == "trigger"){
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
	}
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
function start_combat(enemies){
	
}
new map_zone("starting", text_to_tile_dicts("wwwwwwwww|wfffwwwww|wfffffff|wfffwfwwfw|wwwwwfwwfw|eeeewfwwfw|eeeewffffw|eeeewwwwww"), {"wall": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Hadrian%27s_wall_at_Greenhead_Lough.jpg/181px-Hadrian%27s_wall_at_Greenhead_Lough.jpg", 
																																	"floor": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Parquet_flooring_in_Mus%C3%A9e_des_arts_d%C3%A9coratifs_de_Strasbourg.jpg/174px-Parquet_flooring_in_Mus%C3%A9e_des_arts_d%C3%A9coratifs_de_Strasbourg.jpg", 
																																	"empty": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Nothing.jpg",
																																	"closed door": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Qila-i-Kuhna_mosque_side_door.jpg/214px-Qila-i-Kuhna_mosque_side_door.jpg",
																																	"open door": "https://images.squarespace-cdn.com/content/v1/59d195afcf81e0a1cd99b680/1601019159275-XX23OOK1UW4E1V7QEOYY/ke17ZwdGBToddI8pDm48kDHPSfPanjkWqhH6pl6g5ph7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0mwONMR1ELp49Lyc52iWr5dNb1QJw9casjKdtTg1_-y4jz4ptJBmI9gQmbjSQnNGng/matthew-t-rader-zq4UnZoy5AQ-unsplash.jpg?format=1500w",
																																	"trigger": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Arcade_video_game_buttons.jpg/220px-Arcade_video_game_buttons.jpg",
																																	"combat": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Villainc.svg/220px-Villainc.svg.png"});
game_assets.map_areas["starting"].tiles[8][2] = new door(8, 2);
game_assets.map_areas["starting"].tiles[8][3] = new trigger(function(){game_assets.map_areas["starting"].tiles[8][2].opened = true;}, 8, 3);
game_assets.map_areas["starting"].tiles[7][6] = new combat_trigger(function(gamestate){}, 7, 6);