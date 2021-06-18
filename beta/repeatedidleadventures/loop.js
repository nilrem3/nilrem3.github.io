function loop(){
	now = Date.now();
	diff = now - game.lastupdate;
	game.lastupdate = now;
	game.state.movedelay -= diff / 1000;
	game.state.timer -= diff / 1000;
	if(game.state.movedelay <= 0){
		game.instructionhandler.doinstruction();
	}
	if(game.state.timer <= 0){
		game.resetloop();
	}
}