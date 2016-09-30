var Enemy = function(gamePaddle, ballID){
	this.paddle = gamePaddle;
	this.ball = ballID;
}

Enemy.prototype.decideDirection = function(){
	var pPos = getElementPos(this.paddle.id);
	var bPos = getElementPos(this.ball);

	var up = bPos.mid < pPos.top;

	var down = bPos.mid > pPos.bottom;
	document.getElementById('testline').style.top = bPos.mid;
	console.log(up, down)

	if (!up && !down){
		this.paddle.rate *= .8;
	}else{
		this.paddle.up = up;
		this.paddle.down = down;
	}
}

function getElementPos(elementID){
	var element = document.getElementById(elementID);
	return {'top': element.offsetTop, 'bottom': element.offsetTop + element.offsetHeight, 'mid': element.offsetTop + (element.offsetHeight/2)}
}

