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
		var percent = paddle.offsetHeight * 0.01;


		if (this.down){
			if (this.id = 'left'){
				console.log('down')
			}

			bottom = (paddle.parentElement.offsetHeight * 0.98) - paddle.offsetHeight;
			top =  paddle.offsetTop + (percent * this.rate);
			max = bottom.toString() + 'px';
			stop = 'down';
		}else if (this.up){
			if (this.id = 'left'){
				console.log('up')
			}
			top = paddle.offsetTop - (percent * this.rate);
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

		this.rate += .7;
	}else{
		this.rate = 1;
	}
}

Paddle.prototype.stop = function(dir){
	this.up = false;
	this.down = false;
	this.rate = 1;
}