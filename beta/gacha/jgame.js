class jgame{
	constructor(canvas, game){
		this.canvas = canvas; //document element canvas
		this.ctx = canvas.getContext('2d');
		this.game = game; //game object with methods that jgame will call.
		
		//other variables
		this.WIDTH = game.WIDTH ?? 1000;
		this.HEIGHT = game.HEIGHT ?? 1000;
		this.FPS = game.FPS ?? 50;
		this.TPS = game.TPS ?? 50;
		this.TEXT_SIZING_ACCURACY = game.TEXT_SIZING_ACCURACY ?? 0.01;
		this.SKIP_FRAMES = game.SKIP_FRAMES ?? true;
		document.getElementById("title").innerHTML = game.TITLE ?? "jgame";
		
		this.updatemilliseconds = 0;
		this.drawmilliseconds = 0;
		this.lasttime = Date.now();
		
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		
		
		this.canvasx = canvas.offsetLeft + canvas.clientLeft;
		this.canvasy = canvas.offsetTop + canvas.clientTop;
		var game_to_recieve_event = this;
		
		function clickevent(event){
			game_to_recieve_event.onClick(event.pageX, event.pageY);
		}
		
		this.canvas.addEventListener('click', clickevent);
		
		this.ctx.width = this.WIDTH;
		this.ctx.height = this.HEIGHT;
		
		this.draw._ctx = this.ctx;
		this.draw.game = this;
		
		
		this.framesdropped = 0;
		
		this.initialized = false;
		
		function keyevent(event){
			game_to_recieve_event.onKeyDown(event);
		}
		
		window.addEventListener('keydown', keyevent);
		
		setTimeout(tick, 0);
	}
	tick(){
		if(!this.initialized){
			if(this.game.init != undefined){
				this.game.init();
			}
			this.initialized = true;
		}
		var now = Date.now();
		this.updatemilliseconds += now - this.lasttime;
		this.drawmilliseconds += now - this.lasttime;
		this.lasttime = now;
		
		while(this.updatemilliseconds >= 1000 / this.TPS){
			this.updatemilliseconds -= 1000 / this.TPS;
			if (this.game.update != undefined){
				this.game.update();
			}
		}
		if(this.drawmilliseconds >= 1000 / this.FPS){
			this.drawmilliseconds -= 1000 / this.FPS;
			if(this.drawmilliseconds > 1000 / this.FPS){
				if(this.SKIP_FRAMES){
					console.log("Running behind, dropping " + this.drawmilliseconds / (1000 / this.FPS) + " frames!");
					this.framesdropped += this.drawmilliseconds / (1000 / this.FPS);
					this.drawmilliseconds = 0;
				}
			}
			if(this.game.draw != undefined){
				this.game.draw();
			}
		}
		var delay = Math.max(Math.min((1000 / this.FPS) - this.drawmilliseconds, (1000 / this.TPS) - this.updatemilliseconds), 0);
		if(delay == 0){
			//console.log("Jgame cannot keep up! Either the update or the draw function is taking a long time!");
		}
		setTimeout(tick, delay + 1);
	}
	draw = {
		_ctx: undefined,
		game: undefined,
		word_widths: {},
		image_cache: {},
		get ctx(){
			return this._ctx;
		},
	    rect: function(rect, color=[255, 255, 255]){
			fillstyle = color_to_fillstyle(color);
			this.ctx.strokeStyle = fillstyle;
			this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
		},
		filled_rect: function(rect, color=[255, 255, 255]){
			fillstyle = color_to_fillstyle(color);
			this.ctx.fillStyle = fillstyle;
			this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
		},
		textbox: function(string, rect, color=[255, 255, 255]){
			fillstyle = color_to_fillstyle(color);
			this.ctx.fillStyle = fillstyle;
			var min = 0;
			var max = rect.height;
			var px = Math.floor((min + max) / 2);
			this.ctx.font = px + 'px serif';
			while(Math.abs(1 - (max / min)) > 1 + this.game.TEXT_SIZING_ACCURACY){
				if(this.textFitsInRect(this.ctx, string, rect)){
					min = px;
				}else{
					max = px;
				}
				px = Math.floor(min + ((max - min) / 2));
				this.ctx.font = px + 'px serif';
			}
			this.ctx.font = min + 'px serif';
			var lines = this.getLines(this.ctx, string, rect.width);
			var y = rect.y;
			for(let line = 0; line < lines.length; line++){
				let m = this.ctx.measureText(lines[line]);
				y += m.actualBoundingBoxAscent;
				this.ctx.fillText(lines[line], rect.x, Math.floor(y), rect.width);
				y += m.actualBoundingBoxDescent;
			}
		},
		clear: function(){
			this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		},
		getLines: function(ctx, texttoprint, maxWidth) {
			var words = texttoprint.split(" ");
			var lines = [];
			var currentLine = words[0];
			var width = 0;
			var space_width = ctx.measureText(" ").width;
			this.word_widths[ctx.font] = this.word_widths[ctx.font] ?? {};
			for (var i = 1; i < words.length; i++) {
				var word = words[i];
				var word_width = this.word_widths[ctx.font][word] ?? ctx.measureText(word).width;
				this.word_widths[ctx.font][word] = word_width;
				if (width + space_width + word_width < maxWidth) {
					currentLine += " " + word;
					width += space_width + word_width
				} else {
					lines.push(currentLine);
					currentLine = word;
					width = 0;
				}
			}
			lines.push(currentLine);
			return lines;
		},
		textFitsInRect: function(ctx, string, rect){
			var lines = this.getLines(ctx, string, rect.width);
			var height = 0;
			for(let line in lines){
				var m = ctx.measureText(lines[line]);
				height += m.actualBoundingBoxAscent;
				height += m.actualBoundingBoxDescent;
				if(height > rect.height){
					return false;
				}
			}
			return true;
		},
		img: function(imagename, x, y, width=undefined, height=undefined){
			if(this.image_cache[imagename] == undefined){
				var imgtodraw = new Image();
				var ctx_to_draw = this.ctx;
				var cache = this.image_cache
				imgtodraw.src = imagename;
				imgtodraw.onload = () => {	
					ctx_to_draw.drawImage(imgtodraw, x, y, width ?? imgtodraw.width, height ?? imgtodraw.height);
					cache[imgtodraw.src] = imgtodraw;
				};
			}else{
				var imagetodraw = this.image_cache[imagename];
				this.ctx.drawImage(imagetodraw, x, y, width ?? imagetodraw.width, height ?? imagetodraw.height);
			}
		}
	}
	onClick(x, y){
		if(this.game.onClick != undefined){
			this.game.onClick(x - this.canvasx, y - this.canvasy);
		}
	}
	onKeyDown(e){
		if(this.game.onKeyDown != undefined){
			var code = e.keyCode;
			this.game.onKeyDown(code);
		}
	}
}
function color_to_fillstyle(color){
	fillstyle = 'white';
	if(color.length == 4){
		fillstyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";
	}else{
		fillstyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 1)";
	}
	return fillstyle;
}
function tick(){
	game.tick();
}


class rectangle{
	constructor(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	containspoint(x, y){
		return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
	}
}