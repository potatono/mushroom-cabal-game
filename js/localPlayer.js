/**
 * Local interactive player.  Adds in the keyboard controls and sends updates 
 * to Backend
 */
function LocalPlayer(game, x, y, key, frame) {
	Player.call(this, game, x, y, key);

    // Set up regular updates to the backend
    this.timer = game.time.create(false);
    this.timer.loop(100, this.send, this);
    this.timer.start();

    // Have the game camera follow me
    game.camera.follow(this);

    this.checkForWorldBounds = true;
    this.facingRight = true;
    this.running = false;
}

LocalPlayer.prototype = Object.create(Player.prototype);
LocalPlayer.prototype.constructor = LocalPlayer;

LocalPlayer.prototype.update = function() {
	Player.prototype.update.call(this);

	if (this.body.velocity.x != 0) {
		var dir = this.body.velocity.x / Math.abs(this.body.velocity.x);
		this.body.velocity.x = Math.min(Math.abs(this.body.velocity.x), this.running ? 500 : 300) * dir;
	}

	if (this.body.acceleration.x == 0 && Math.abs(this.body.velocity.x) < 1) {
		this.body.velocity.x = 0;
		this.animations.stop();
		this.frame = 4;
	}
}

LocalPlayer.prototype.onShiftDown = function() {
	this.running = true;
}

LocalPlayer.prototype.onShiftUp = function() {
	this.running = false;
}

LocalPlayer.prototype.onLeftDown = function() {
	this.body.acceleration.x = -400;
			
	if (this.body.velocity.x > 0) {
		this.body.acceleration.x *= 3;
	}

	this.animations.play('left');
	this.facingRight = false;
}

LocalPlayer.prototype.onRightDown = function() {
	this.body.acceleration.x = 400;

	if (this.body.velocity.x < 0) {
		this.body.acceleration.x *= 3;
	}
	
	this.animations.play('right');
	this.facingRight = true;	
}

LocalPlayer.prototype.onLeftUp = LocalPlayer.prototype.onRightUp = function(key, keys) {
	if (keys.left.isUp && keys.right.isUp)
		this.body.acceleration.x = 0;
}

LocalPlayer.prototype.onUpDown = function() {
    if (this.body.blocked.down)
    {
        this.body.velocity.y = -850;
    }
}

LocalPlayer.prototype.send = function() {
	backend.update(this);
}

LocalPlayer.prototype.onActorOut = function() {
	this.body.acceleration.x = 0;
	this.body.velocity.x = 0;
	this.animations.stop();
	this.frame = 4;	
}
