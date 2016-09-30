var Game = function(right, left, ball, lScore, rScore){
	this.leftPaddle = new Paddle(left);
	this.rightPaddle = new Paddle(right);

	this.ball = new Ball(ball, {
		'left': left,
		'right': right
	});

	this.lScore = {
		'score':0,
		'dom': document.getElementById(lScore)
	};

	this.rScore = {
		'score':0,
		'dom':document.getElementById(rScore)
	};

	this.enemy = new Enemy(this.leftPaddle, ball);
}

Game.prototype.score = function(side){
	var scoreSide;

	if (side == 'right'){
		scoreSide = 'rScore'
	}else{
		scoreSide = 'lScore';
	}

	this[scoreSide].score += 1;
	this[scoreSide].dom.innerHTML = this[scoreSide].score.toString();
}

Game.prototype.start = function(){
	var self = this;

	this.lScore.dom.innerHTML = '0';
	this.rScore.dom.innerHTML = '0';

	document.onkeydown = function(e){
		switch (e.keyCode){
			case 40:
				self.rightPaddle.down = true;
				break;
			case 38:
				self.rightPaddle.up = true;
				break;
			// case 83:
			// 	self.leftPaddle.down = true;
			// 	break;
			// case 87:
			// 	self.leftPaddle.up = true;
			// 	break;
		}
	}

	document.onkeyup = function(e){
		if (e.keyCode == 83 || e.keyCode == 87){
			self.leftPaddle.stop();
		}else if (e.keyCode == 40|| e.keyCode == 38){
			self.rightPaddle.stop();
		}
	}

	function updateFrame(){
		setTimeout(function() {
			window.requestAnimFrame(updateFrame);
			self.ball.move();
			self.rightPaddle.move();
			self.leftPaddle.move();

			if (self.ball.score){
				self.score(self.ball.direction);
			}else{
				self.enemy.decideDirection();
			}
    	}, 16.6);
    }

    updateFrame();
}