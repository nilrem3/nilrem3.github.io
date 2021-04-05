class ai{
	constructor(name, getpreferredmove){
		this.name = name;
		this._getpreferredmove = getpreferredmove;
	}
	getpreferredmove(moves, board){
		return this._getpreferredmove(moves, board);
	}
}
class drawmanager{
	constructor(){
		this.canvas = document.getElementById("canvas");
		
	}
	draw(){
		var board = manager.game;
		var ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, 800, 800);
		for(let x = 0; x < 8; x++){
			for(let y = 0; y < 8; y++){
				if((x + y) % 2 == 0){
					ctx.fillStyle = "#FFFFFF";
				}else{
					ctx.fillStyle = "#000000"; 
				}
				ctx.fillRect(100 * x, 100 * y, 100, 100);
				
				ctx.font = "50px Georgia";
				let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
			let symbols = {"k": "♔", "q": "♕", "r": "♖", "b": "♗", "n": "♘", "p": "♙"};
			    let piece = board.get(letters[x] + (8 - y));
				if(piece != null){
					ctx.fillStyle = {"w": "#FF0000", "b": "#0000FF"}[piece.color];
					ctx.fillText(symbols[piece.type], 100 * (x + 0.25), 100 * (y + 0.75));
				}
			}
		}
		var table = document.getElementById("elodisplay");
		var aidata = [];
		for(const prop in manager.elorankings){
			aidata.push({name:prop, elo:manager.elorankings[prop], games:manager.gamesplayed[prop]});
		}
		aidata.sort(function(a, b){
			if(a.elo < b.elo){
				return 1;
			}else if(a.elo > b.elo){
				return -1
			}
			return 0;
		});
		var html = "<tr><td>Name</td><td>Elo</td><td>Games played</td>";
		html += "<tr>";
		for(let i = 0; i < aidata.length; i++){
			html += "<tr><td>" + aidata[i].name + "</td><td>" + Math.floor(aidata[i].elo) + "</td><td>" + aidata[i].games + "</td></tr>";
		}
		table.innerHTML = html;
	}
}
class tourneymanager{
	constructor(){
		this.elorankings = {};
		this.ais = {};
		this.winlossratios = {};
		this.gamesplayed = {};
		this.gameover = true;
		this.game = new Chess();
		this.movesleft = 0;
		this.continuous = false;
	}
	add_ai(ai){
		if(ai.name in this.ais){
			return false;
		}else{
			this.ais[ai.name] = ai;
			if(!(ai.name in this.elorankings)){
				this.elorankings[ai.name] = 1500;
				this.gamesplayed[ai.name] = 0;
				this.winlossratios[ai.name] = {};
				for(const prop in this.ais){
					this.winlossratios[prop][ai.name] = {"wins": 0, "losses": 0, "ties": 0};
					this.winlossratios[ai.name][prop] = {"wins": 0, "losses": 0, "ties": 0};
				}
			}
		}
	}
	start_match(ainame1, ainame2){
		this.game = new Chess();
		this.ai1 = this.ais[ainame1];
		this.ai2 = this.ais[ainame2];
		this.gameover = false;
		this.movesleft = 0;
		drawmanager.draw();
	}
	do_move(){
		if(this.gameover){
			return;
		}
		var preferredmove = "";
		if(this.game.turn() == 'w'){
			preferredmove = this.ai1.getpreferredmove(this.game.moves({verbose: true}), new Chess(this.game.fen()));
		}else{
			preferredmove = this.ai2.getpreferredmove(this.game.moves({verbose: true}), new Chess(this.game.fen()));
		}
		this.game.move(preferredmove);
		if(this.game.in_checkmate() || this.game.in_stalemate()){
			this.gameover = true;
			this.movesleft = 1;
			if(this.game.turn() == 'w'){
				this.do_elo(this.ai2, this.ai1);
				this.winlossratios[this.ai1.name][this.ai2.name]["wins"] += 1; //first index is white player, second is black player
				this.winlossratios[this.ai2.name][this.ai1.name]["losses"] += 1;
			}else{
				this.do_elo(this.ai1, this.ai2);
			}
			
		}else if(this.game.in_draw()){
			this.winlossratios[this.ai1.name][this.ai2.name]["ties"] += 1; //first index is white player, second is black player
			this.winlossratios[this.ai2.name][this.ai1.name]["ties"] += 1;
			this.do_elo(this.ai1, this.ai2, true);
			this.gameover = true;
			this.movesleft = 1;
		}
		drawmanager.draw();
	}
	do_moves(num){
		this.movesleft = num;
	}
	do_move_thingy(){
		if(this.movesleft > 0 || this.continuous){ 
			if(this.continuous){
				this.movesleft = 5;
			}
			if(this.continuous && this.gameover){
				manager.save();
				var ailist = []
				for(const prop in this.ais){
					ailist.push(this.ais[prop].name);
				}
				var first = choose(ailist);
				var second = choose(ailist);
				//make ais with less games played more likely
				if(manager.gamesplayed[first.name] > manager.gamesplayed[second.name]){
					first = choose(ailist);
				}else if(manager.gamesplayed[second.name] > manager.gamesplayed[first.name]){
					second = choose(ailist);
				}
				this.start_match(first, second);
				console.log(first + " vs " + second);
			}
			this.do_move();
			this.movesleft -= 1;
			if(this.movesleft == 0){
				console.log("Done!");
			}
		}
	}
	do_elo(winner, loser, tie=false){
		this.gamesplayed[winner.name] += 1;
		this.gamesplayed[loser.name] += 1;
		var ea = 1/(1 + Math.pow(10, ((this.elorankings[loser.name] - this.elorankings[winner.name]) / 400)));
		var eb = 1/(1 + Math.pow(10, ((this.elorankings[winner.name] - this.elorankings[loser.name]) / 400)));
		var ka = 10 + (90 / Math.log2(this.gamesplayed[winner.name] + 1));		
		var kb = 10 + (90 / Math.log2(this.gamesplayed[loser.name] + 1));
		var k = (ka + kb) / 2;
		var rpa = 0;
		var rpb = 0;
		if(tie == false){
			rpa = k * (1 - ea);
			rpb = k * (0 - eb);
		}else{
			rpa = k * (0.5 - ea);
			rpb = k * (0.5 - eb);
		}
		console.log(winner.name + " gained " + rpa + "elo");
		console.log(loser.name + " gained " + rpb + "elo");
		this.elorankings[winner.name] += rpa;
		this.elorankings[loser.name] += rpb;
		this.save();
	}
	save(){
		window.localStorage.setItem("rankings", JSON.stringify(this.elorankings));
		window.localStorage.setItem("gamesplayed", JSON.stringify(this.gamesplayed));
		window.localStorage.setItem("winlossratios", JSON.stringify(this.winlossratios));
	}
	load(){
		this.elorankings = JSON.parse(window.localStorage.getItem("rankings"));
		this.gamesplayed = JSON.parse(window.localStorage.getItem("gamesplayed"));
		this.winlossratios = JSON.parse(window.localStorage.getItem("winlossratios"));
	}
	continuoustourney(){
		this.continuous = true;
	}
	stopcontinuoustourney(){
		this.continuous = false;
	}
}
drawmanager = new drawmanager();
manager = new tourneymanager();
manager.load();
manager.add_ai(new ai("completely random", function(moves, board){
	return choose(moves);
}));
manager.add_ai(new ai("completely random*", function(moves, board){
	for(let i = 0; i < moves.length; i++){
		board.move(moves[i]);
		if(board.in_checkmate()){
			board.undo();
			return moves[i];
		}
		board.undo();
	}
	return choose(moves);
}));	
manager.add_ai(new ai("first possible move", function(moves, board){
	return moves[0]; 
}));
manager.add_ai(new ai("last possible move", function(moves, board){
	return moves[moves.length - 1];
}));
manager.add_ai(new ai("capture, then random", function(moves, board){
	for(let i = 0; i < moves.length; i++){
		if(moves[i].flags.includes("c") || moves[i].flags.includes("e")){
			return moves[i];
		}
	}
	return choose(moves);
}));
manager.add_ai(new ai("checkmate, check, capture, random", function(moves, board){
	for(let i = 0; i < moves.length; i++){
		board.move(moves[i]);
		if(board.in_checkmate()){
			board.undo();
			return moves[i];
		}else{
			board.undo();
		}
	}
	for(let i = 0; i < moves.length; i++){
		board.move(moves[i]);
		if(board.in_check()){
			board.undo();
			return moves[i];
		}else{
			board.undo();
		}
	}
	for(let i = 0; i < moves.length; i++){
		if(moves[i].flags.includes("c") || moves[i].flags.includes("e")){
			return moves[i];
		}
	}
	return choose(moves);
}));
manager.add_ai(new ai("pawn lover d3", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			yours = 1;
			let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						if(piece.type == "p"){
							if(piece.color == color){
								mine += 1;
							}else{
								yours += 1;
							}
						}
					}
				}
			}
			return mine / yours;
		}, 1, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return 1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return -1;
			}else if(a.flags.includes("p")){
				return -1; //promotions are usually bad
			}else if(b.flags.includes("p")){
				return 1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("pawn lover d4", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			yours = 1;
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						if(piece.type == "p"){
							if(piece.color == color){
								mine += 1;
							}else{
								yours += 1;
							}
						}
					}
				}
			}
			return mine / yours;
		}, 2, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return 1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return -1;
			}else if(a.flags.includes("p")){
				return -1; //promotions are usually bad
			}else if(b.flags.includes("p")){
				return 1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("population minimizer d3", function(moves, board){
		return treesearchmoves(board, function(board, color){
			points = 64
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						points -= 1;
					}
				}
			}
			return points;
		}, 1, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return 1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return -1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("population minimizer d4", function(moves, board){
		return treesearchmoves(board, function(board, color){
			points = 64
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						points -= 1;
					}
				}
			}
			return points;
		}, 2, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return 1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return -1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("population maximizer d3", function(moves, board){
		return treesearchmoves(board, function(board, color){
			points = 0;
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						points += 1;
					}
				}
			}
			return points;
		}, 1, board.turn(), moves);
}));
manager.add_ai(new ai("population maximizer d4", function(moves, board){
		return treesearchmoves(board, function(board, color){
			points = 0;
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						points += 1;
					}
				}
			}
			return points;
		}, 2, board.turn(), moves);
}));
manager.add_ai(new ai("regular piece values d3*", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			yours = 1;
			if(board.in_checkmate()){
				if(board.turn() == color){
				return -Infinity;
				}else{
					return Infinity;
				}
			}
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						values = {"p": 1, "r": 5, "n": 3, "b": 3, "k": 0, "q": 9};
						if(piece.color == color){
							mine += values[piece.type];
						}else{
							yours += values[piece.type];
						}
					}
				}
			}
			return mine / yours;
		}, 1, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return 1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return -1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("regular piece values d4*", function(moves, board){
		return treesearchmoves(board, function(board, color){
			var mine = 1;
			var yours = 1;
			if(board.in_checkmate()){
				if(board.turn() == color){
				return -Infinity;
				}else{
					return Infinity;
				}
			}
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						values = {"p": 1, "r": 5, "n": 3, "b": 3, "k": 0, "q": 9};
						if(piece.color == color){
							mine += values[piece.type];
						}else{
							yours += values[piece.type];
						}
					}
				}
			}
			return mine - yours;
		}, 2, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return 1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return -1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("regular piece values d5*", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			yours = 1;
			if(board.in_checkmate()){
				if(board.turn() == color){
				return -Infinity;
				}else{
					return Infinity;
				}
			}
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						values = {"p": 1, "r": 5, "n": 3, "b": 3, "k": 0, "q": 9};
						if(piece.color == color){
							mine += values[piece.type];
						}else{
							yours += values[piece.type];
						}
					}
				}
			}
			return mine / yours;
		}, 3, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return 1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return -1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("equivalent piece values d3*", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			yours = 1;
			if(board.in_checkmate()){
				if(board.turn() == color){
				return -Infinity;
				}else{
					return Infinity;
				}
			}
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						values = {"p": 1, "r": 1, "n": 1, "b": 1, "k": 0, "q": 1};
						if(piece.color == color){
							mine += values[piece.type];
						}else{
							yours += values[piece.type];
						}
					}
				}
			}
			return mine - yours;
		}, 1, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return 1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return -1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("equivalent piece values d4*", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			yours = 1;
			if(board.in_checkmate()){
				if(board.turn() == color){
				return -Infinity;
				}else{
					return Infinity;
				}
			}
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						values = {"p": 1, "r": 1, "n": 1, "b": 1, "k": 0, "q": 1};
						if(piece.color == color){
							mine += values[piece.type];
						}else{
							yours += values[piece.type];
						}
					}
				}
			}
			return mine - yours;
		}, 2, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return 1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return -1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("reversed regular piece values d3*", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			yours = 1;
			if(board.in_checkmate()){
				if(board.turn() == color){
				return -Infinity;
				}else{
					return Infinity;
				}
			}
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						values = {"p": 9, "r": 3, "n": 5, "b": 5, "k": 0, "q": 1};
						if(piece.color == color){
							mine += values[piece.type];
						}else{
							yours += values[piece.type];
						}
					}
				}
			}
			return mine - yours;
		}, 1, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return 1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return -1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("reversed regular piece values d4*", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			yours = 1;
			if(board.in_checkmate()){
				if(board.turn() == color){
				return -Infinity;
				}else{
					return Infinity;
				}
			}
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						values = {"p": 9, "r": 3, "n": 5, "b": 5, "k": 0, "q": 1};
						if(piece.color == color){
							mine += values[piece.type];
						}else{
							yours += values[piece.type];
						}
					}
				}
			}
			return mine - yours;
		}, 2, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return 1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return -1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("maximize occupied white squares d3", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						if(board.square_color(letters[x] + (8 - y)) == "light"){
							mine += 1;
						}
					}
				}
			}
			return mine;
		}, 1, board.turn(), moves);
}));
manager.add_ai(new ai("maximize occupied white squares d4", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						if(board.square_color(letters[x] + (8 - y)) == "light"){
							mine += 1;
						}
					}
				}
			}
			return mine;
		}, 2, board.turn(), moves);
}));
manager.add_ai(new ai("checkmate, capture, check, random", function(moves, board){
	for(let i = 0; i < moves.length; i++){
		board.move(moves[i]);
		if(board.in_checkmate()){
			board.undo();
			return moves[i];
		}else{
			board.undo();
		}
	}
	for(let i = 0; i < moves.length; i++){
		if(moves[i].flags.includes("c") || moves[i].flags.includes("e")){
			return moves[i];
		}
	}
		for(let i = 0; i < moves.length; i++){
		board.move(moves[i]);
		if(board.in_check()){
			board.undo();
			return moves[i];
		}else{
			board.undo();
		}
	}
	return choose(moves);
}));
manager.add_ai(new ai("dark square lover d3", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			yours = 1;
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						if(board.square_color(letters[x] + (8 - y)) == "dark"){
							if(piece.color == color){
								mine += 1;
							}else{
								yours += 1;
							}
						}
					}
				}
			}
			return mine / yours;
		}, 1, board.turn(), moves);
}));
manager.add_ai(new ai("dark square lover d4", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			yours = 1;
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						if(board.square_color(letters[x] + (8 - y)) == "dark"){
							if(piece.color == color){
								mine += 1;
							}else{
								yours += 1;
							}
						}
					}
				}
			}
			return mine / yours;
		}, 2, board.turn(), moves);
}));
manager.add_ai(new ai("forward march d3", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 0;
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						if(color == "w"){
							if(piece.color == color){
								mine += 8 - y;
							}
						}else{
							if(piece.color == color){
								mine += y + 1;
							}
						}
					}
				}
			}
			return mine;
		}, 0, board.turn(), moves, function(a, b){
			if(a.flags.includes("b")){ //double pawn pushes are likely.
				return 1;
		    }else if(b.flags.includes("b")){
				return -1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("forward march d4", function(moves, board){
		return treesearchmoves(board, function(board, color){
			let mine = 1;
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 -y));
					if(piece != null){
						if(color == "w"){
							mine -= y;
						}else{
							mine += y;
						}
					}
				}
			}
			return mine;
		}, 2, board.turn(), moves, function(a, b){
			if(a.flags.includes("b")){ //double pawn pushes are likely.
				return 1;
		    }else if(b.flags.includes("b")){
				return -1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("regular piece values of opponent d3*", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			yours = 1;
			let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
			values = {"p": 1, "r": 5, "n": 3, "b": 3, "k": 0, "q": 9};
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						if(piece.color != color){
							mine += values[piece.type];
						}else{
							yours += values[piece.type];
						}
					}
				}
			}
			return mine - yours;
		}, 1, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return -1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return 1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("regular piece values of opponent d4*", function(moves, board){
		return treesearchmoves(board, function(board, color){
			mine = 1;
			yours = 1;
			for(let x = 0; x < 8; x++){
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						values = {"p": 1, "r": 5, "n": 3, "b": 3, "k": 0, "q": 9};
						if(piece.color != color){
							mine += values[piece.type];
						}else{
							yours += values[piece.type];
						}
					}
				}
			}
			return mine - yours;
		}, 2, board.turn(), moves, function(a, b){
			if(a.flags.includes("c") || a.flags.includes("e")){
				return -1;
		    }else if(b.flags.includes("c") || b.flags.includes("e")){
				return 1;
			}
			return 0;
		});
}));
manager.add_ai(new ai("maximize empty columns d4*", function(moves, board){
		return treesearchmoves(board, function(board, color){
			var points = 0;
			if(board.in_checkmate()){
				if(board.turn() == color){
					return -Infinity;
				}else{
					return Infinity;
				}
			}
			for(let x = 0; x < 8; x++){
				let col = 0;
				for(let y = 0; y < 8; y++){
					let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
					let piece = board.get(letters[x] + (8 - y));
					if(piece != null){
						col += 1;
					}
				}
				if(col == 0){
					points += 1;
				}
			}
			return points;
		}, 2, board.turn(), moves);
}));
manager.add_ai(new ai("limit opponent's choice", function(moves, board){
	best = Infinity;
	bmov = [];
	for(let i = 0; i < moves.length; i++){
		board.move(moves[i]);
		score = board.moves().length;
		if(score < best){
			best = score;
			bmov = [];
			bmov.push(moves[i]);
		}else if(score == best){
			bmov.push(moves[i]);
		}
	}
	return choose(bmov);
}));
manager.add_ai(new ai("limit own choice d2", function(moves, board){
	return treesearchmoves(board, function(board, color){
		if(board.turn() == color){
			return -board.moves().length;
		}else{
			least = Infinity;
			let moves = board.moves();
			for(let i = 0; i < moves.length; i++){
				board.move(moves[i]);
				score = board.moves().length;
				if(score < least){
					least = score;
				}
			}
			return least;
		}
	}, 0, board.turn(), moves);
}));
function choose(choices){
	var index = Math.floor(Math.random() * choices.length);
	return choices[index];
}
function treesearchmoves(board, evaluate, depth, color, moves, sortfunc=function(a, b){
			return 0; //if no sort function is provided, don't sort.
		}){
	positionhash = {};
	var best = -Infinity;
	var bmov = [];
	for(let i = 0; i < moves.length; i++){
		board.move(moves[i]);
		var score = treesearch(board, evaluate, depth, color, -Infinity, Infinity, positionhash, sortfunc);
		if(score > best){
			best = score;
			bmov = [];
			bmov.push(moves[i]);
		}else if(score == best){
			bmov.push(moves[i]);
		}
		board.undo();
	}
	return choose(bmov);
}
function treesearch(board, evaluate, depth, color, alpha=-Infinity, beta=Infinity, poshash={}, sortfunc=function(a, b){
			return 0; //if no sort function is provided, don't sort
		}){
	var fen = board.fen();
	if(fen in poshash){
		return poshash[fen];
	}
	if(depth == 0){
		score = evaluate(board, color);
		poshash[fen] = score;
		return score;
	}
	if(color == board.turn()){
		var value = -Infinity;
		let moves = board.moves({verbose: true});
		//good move guessing: do captures first
		moves.sort(sortfunc);
		for(let i = 0; i < moves.length; i++){
			board.move(moves[i]);
			value = Math.max(value, treesearch(board, evaluate, depth - 1, color, alpha, beta, poshash, sortfunc));
			alpha = Math.max(alpha, value);
			board.undo();
			if(alpha >= beta){
				break;
			}
		}
		return value;
	}else{
		var value = Infinity;
		let moves = board.moves({verbose: true});
		//good move guessing: do captures first
		moves.sort(sortfunc);
		for(let i = 0; i < moves.length; i++){
			board.move(moves[i]);
			value = Math.min(value, treesearch(board, evaluate, depth - 1, color, alpha, beta, poshash, sortfunc));
			beta = Math.min(beta, value);
			board.undo();
			if(beta <= alpha){
				break;
			}
		}
		return value;
	}
}
function domovethingy(){
	manager.do_move_thingy();
}
window.setInterval(domovethingy, 10);
var helper1 = new Worker("worker.js");
helper1.onmessage = function(e){
	manager.do_elo(e.ai1, e.ai2, e.tie);
	console.log("helper game finished!");
	var ailist = []
	for(const prop in manager.ais){
		ailist.push(manager.ais[prop].name);
	}
	var first = choose(ailist);
	var second = choose(ailist);
	console.log("starting helper game: " + first.name + " vs " + second.name);
	helper1.postMessage(choose(manager.ais), choose(manager.ais));
}
var ailist = []
for(const prop in manager.ais){
	ailist.push(manager.ais[prop].name);
}
var first = choose(ailist);
var second = choose(ailist);
console.log("starting helper game: " + first.name + " vs " + second.name);	
helper1.postMessage(choose(manager.ais), choose(manager.ais));