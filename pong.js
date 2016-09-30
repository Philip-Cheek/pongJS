var Paddle = function(id){
	this.up = false;
	this.down = false;
	this.rate = 1;

	this.id = id;
	this.element = document.getElementById(id);
}

Paddle.prototype.move = function(){
	if (this.up || this.down){
		var top, stop, max, bottom;
		var paddle = this.element;

		if (this.down){
			var percent = paddle.offsetHeight * 0.03;
			bottom = (paddle.parentElement.offsetHeight * 0.98) - paddle.offsetHeight;
			top =  paddle.offsetTop + (percent * this.rate);
			max = bottom.toString() + 'px';
			stop = 'down';
		}else if (this.up){
			console.log('we should go up');
			top = paddle.offsetTop - (1 * this.rate);
			stop = 'up';
			max = '0px';
		}
		
		if (this.down && Math.abs(top) <= bottom){
			paddle.style.top = top.toString() + 'px';
		}else if (this.up && top >= 0){
			paddle.style.top = top.toString() + 'px';
		}else{
			paddle.style.top = max;
			this[stop] = false;
		}

		this.rate += 2;
	}else{
		console.log("ratereset?")
		this.rate = 1;
	}
}

Paddle.prototype.stop = function(dir){
	this.up = false;
	this.down = false;
	this.rate = 1;
}


var Ball = function(id, paddleInfo, speedRate, angle, direction, velocities){
	this.element = document.getElementById(id);
	this.lPaddle = document.getElementById(paddleInfo.left);
	this.rPaddle = document.getElementById(paddleInfo.right);

	if (!speedRate){
		this.speedRate = .40;
	}else{
		this.speedRate = speedRate;
	}

	if (!angle){
		this.maxAngle = Math.PI/6;
	}else{
		this.maxAngle = angle;
	}

	if (!direction){
		this.direction = 'right';
	}else{
		this.direction = 'right';
	}

	this.xVelocity;
	this.yVelocity;
}


Ball.prototype.move = function(){
	var ball = this.element;
	var paddle;

	if (this.direction == 'right'){
		paddle = this.rPaddle;
	}else{
		paddle = this.lPaddle;
	}

	if (!this.xVelocity || !this.yVelocity){
		var setVelocities = this.calculateVelocites();
		this.xVelocity = setVelocities.x;
		this.yVelocity = setVelocities.y;
	}

	var collision = this.detectCollision(paddle);
	var neg = 1

	if (this.direction == 'left'){
		neg *= -1;
	}

	var xChange = ball.offsetLeft + (this.xVelocity * neg);
	var yChange = ball.offsetTop + (this.yVelocity);
	var fWidth = ball.offsetWidth * 2;


	if (xChange <= ball.parentElement.offsetWidth + fWidth && xChange >= -fWidth){
		ball.style.left = xChange;
		ball.style.top = yChange;
	}else{
		console.log('this would be score')
	}


}

Ball.prototype.getSpeed = function(){
	return this.element.offsetHeight * this.speedRate;
}

Ball.prototype.startMoving = function(from){
	var ball = this.element;
	console.log('go')

	var speed = this.initSpeed;
	var initVelocities = this.calculateVelocites();

	ball.style.top = ball.parentElement.offsetHeight * Math.random();

	var xVelocity = initVelocities.x;
	var yVelocity = initVelocities.y;

	var neg = 1;
	var self = this;
	var to = 'right';

	
	if (from == 'right'){
		neg *= -1;
		to = 'left'
	}

	var collision = function(){
		return self.detectCollision(document.getElementById(to), speed, {
			'x': xVelocity, 
			'y': yVelocity
		});
	}
	
	this.animations.ball = setInterval(function(){
		var xChange = ball.offsetLeft + (xVelocity * neg);
		var yChange = ball.offsetTop + (yVelocity);

		var fWidth = ball.offsetWidth * 2;
		var collide = collision();

		if (collide.status){
			if (collide.side == 'paddle'){
				neg *= -1;
	
				var temp = from;
				from = to;
				to = temp;
			}
	
			xVelocity = collide.x;
			yVelocity = collide.y;

			var course = 0;

			if (course == 'bottom'){
				course -= 1;
			}else if (course == 'top'){
				course += 1;
			}

			ball.style.left = ball.offsetLeft + (xVelocity * neg);
			ball.style.top = ball.offsetTop + (yVelocity) + course;

		}else if (xChange <= ball.parentElement.offsetWidth + fWidth && xChange >= -fWidth){
			ball.style.left = xChange;
			ball.style.top = yChange;

		}else{
			clearInterval(self.animations.ball);
			delete self.animations.ball;

			self.reset();
		}
	}, 10);
}

Ball.prototype.calculateVelocites = function(paddle){
	var speed = this.getSpeed();
	var nDegree;

	if (paddle){	
		var intersect = paddle.offsetHeight - (ball.offsetTop - paddle.offsetTop);
		nDegree = (intersect - (paddle.offsetHeight/2))/(paddle.offsetHeight/2);
		if (this.speedRate < .6){	
			this.speedRate += (Math.abs(nDegree)/6);
		}
	}else{
		nDegree = Math.random();
		
		if ((Math.random() * 2) < 1){
			nDegree *= -1;
		}
	}

	var newAngle = (nDegree * this.maxAngle);

	return {
		'x': speed * Math.cos(newAngle),
		'y': speed * Math.sin(newAngle) * -1,
	}

}

Ball.prototype.detectCollision = function(paddle, oldV){
	var speed = this.getSpeed();
	var top = ball.offsetTop <= 1;
	var bottom = ball.offsetTop >= ball.parentElement.offsetHeight -  12;

	if (top || bottom){
		var type;

		if (bottom){
			type = 'bottom'
		}else{
			type = 'top'
		}

		this.yVelocity *= -1;

		return {'status': true, 'side': type}
	}


	var underTop = paddle.offsetTop <= ball.offsetTop
	var aboveBottom = (paddle.offsetTop + paddle.offsetHeight) >= (ball.offsetTop + ball.offsetHeight);
	var horizontalAlign;

	if (paddle.id == 'left'){
		horizontalAlign = paddle.offsetLeft + paddle.offsetWidth >= ball.offsetLeft 
	}else if (paddle.id == 'right'){
		horizontalAlign = paddle.offsetLeft <= ball.offsetLeft + ball.offsetWidth;
	}
	
	if (underTop && aboveBottom && horizontalAlign){
		var velocities = this.calculateVelocites(paddle);
		this.xVelocity = velocities.x;
		this.yVelocity = velocities.y;

		if (this.direction == 'right'){
			this.direction = 'left';
		}else{
			this.direction = 'right';
		}
	}	
}

var Game = function(right, left, ball){
	this.leftPaddle = new Paddle(left);
	this.rightPaddle = new Paddle(right);
	this.ball = new Ball(ball, {
		'left': left,
		'right': right
	});
}

Game.prototype.start = function(){
	var self = this;

	document.onkeydown = function(e){
		switch (e.keyCode){
			case 40:
				self.rightPaddle.down = true;
				break;
			case 38:
				self.rightPaddle.up = true;
				break;
			case 83:
				self.leftPaddle.down = true;
				break;
			case 87:
				self.leftPaddle.up = true;
				break;
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

			self.rightPaddle.move();
			self.leftPaddle.move();
			self.ball.move();

			// self.ball.move();
    	}, 16);
    }

    updateFrame();
}

window.onload = function(){
	var game = new Game('right', 'left', 'ball');
	game.start();
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();