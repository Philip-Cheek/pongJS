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

	this.score = false;
}


Ball.prototype.move = function(){
	this.score = false;

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
		this.score = true;
		this.reset();
	}


}

Ball.prototype.reset = function(){
	this.speedRate = .40;

	var ball = this.element;
	var padding = ball.parentElement.offsetWidth * .08;

	ball.style.top = padding;
	var newVelocities = this.calculateVelocites();

	if (this.direction == 'left'){
		ball.style.left = padding;
		this.direction = 'right'
	}else{
		ball.style.left = ball.parentElement.offsetWidth - padding;
		this.direction = 'left'
	}

	this.xVelocity = 0;
	this.yVelocity = 0;
}
Ball.prototype.getSpeed = function(){
	return this.element.offsetHeight * this.speedRate;
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