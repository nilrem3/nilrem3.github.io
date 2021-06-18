importScripts("chess.js");
class tourneyhelper{
	constructor(){
		this.gameover = true;
		this.game = new Chess();
		this.movesleft = 0;
		this.continuous = true;
	}
	start_match(ai1, ai2){
		this.game = new Chess();
		this.ai1 = this.ai1;
		this.ai2 = this.ai2;
		this.gameover = false;
		this.movesleft = 0;
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
				this.gameover = true;
				postMessage({winner:this.ai2.name, loser:this.ai1.name, tie:false});
			}else{
				this.gameover = true;
				postMessage({winner:this.ai1.name, loser:this.ai2.name, tie:false});
			}
			
		}else if(this.game.in_draw()){
			postMessage({winner:this.ai1.name, loser:this.ai2.name, tie:true});
		}
	}
	do_moves(num){
		this.movesleft = num;
	}
	do_move_thingy(){
		if(this.continuous && this.gameover == false){ 
			this.do_move();
		}
	}
}
helper = new tourneyhelper();
setInterval(helper.do_move_thingy, 10);
onmessage = function(e){
	helper.start_match(e.ai1, e.ai2);
}