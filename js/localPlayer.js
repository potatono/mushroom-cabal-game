/**
 * Local interactive player.  Adds in the keyboard controls and sends updates 
 * to Backend
 */
function LocalPlayer(game, x, y, key, frame) {
	Player.call(this, game, x, y, key);

	// Set up keyboard controls
	this.cursors = game.input.keyboard.createCursorKeys();
    this.cursors.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    this.cursors.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.cursors.escape = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

    this.cursors.left.onDown.add(this.onLeft, this);
    this.cursors.right.onDown.add(this.onRight, this);
    this.cursors.up.onDown.add(this.onUp, this);
    this.cursors.down.onDown.add(this.onDown, this);
    this.cursors.space.onDown.add(this.onSpace, this);
    this.cursors.escape.onDown.add(this.onEscape, this);

    // Set up regular updates to the backend
    this.timer = game.time.create(false);
    this.timer.loop(100, this.send, this);
    this.timer.start();

    // Have the game camera follow me
    game.camera.follow(this);

    this.checkForWorldBounds = true;
    this.facingRight = true;

    this.selector = new Phaser.Sprite(game, 0, 0, 'selector');
    this.selectorMode = false;

    game.world.add(this.selector);
}

LocalPlayer.prototype = Object.create(Player.prototype);
LocalPlayer.prototype.constructor = LocalPlayer;

LocalPlayer.prototype.update = function() {
	Player.prototype.update.call(this);

	if (!this.selectorMode) {
		if (this.cursors.left.isDown) {
			this.body.acceleration.x = -400;
			
			if (this.body.velocity.x > 0)
				this.body.acceleration.x *= 3;

			if (this.cursors.shift.isDown)
				this.body.velocity.x = Math.max(this.body.velocity.x, -500);
			else
				this.body.velocity.x = Math.max(this.body.velocity.x, -300);

			this.animations.play('left');
			this.facingRight = false;

		}
		else if (this.cursors.right.isDown) {
			this.body.acceleration.x = 400;

			if (this.body.velocity.x < 0)
				this.body.acceleration.x *= 3;

			if (this.cursors.shift.isDown)
				this.body.velocity.x = Math.min(this.body.velocity.x, 500);
			else
				this.body.velocity.x = Math.min(this.body.velocity.x, 300);
			
			this.animations.play('right');
			this.facingRight = true;
		}
		else {
			this.body.acceleration.x = 0;

			if (Math.abs(this.body.velocity.x) < 1) {
				this.body.velocity.x = 0;
				this.animations.stop();
				this.frame = 4;
			}
		}
	    
	    //  Allow the player to jump if they are touching the ground.
	    if (this.cursors.up.isDown && this.body.blocked.down)
	    {
	        this.body.velocity.y = -850;
	    }
	}
}

LocalPlayer.prototype.send = function() {
	backend.update(this);
}

LocalPlayer.prototype.dropBrick = function() {
	Brick.drop(
		this.selector.x,
		this.selector.y
	);
}

LocalPlayer.prototype.onSpace = function() {
	if (!this.selectorMode) {
		this.selectorMode = true;
		this.selector.visible = true;
		this.selector.x = game.math.snapToFloor(this.x + this.width, 32);
		this.selector.y = game.math.snapToFloor(this.y + this.height, 32);
	}
	else {
		this.dropBrick()
	}
}

LocalPlayer.prototype.onEscape = function() {
	this.selectorMode = false;
	this.selector.visible = false;
}

LocalPlayer.prototype.onLeft = function() {
	this.selector.x -= 32;
}

LocalPlayer.prototype.onRight = function() {
	this.selector.x += 32;
}

LocalPlayer.prototype.onUp = function() {
	this.selector.y -= 32;
}

LocalPlayer.prototype.onDown = function() {
	this.selector.y += 32;
}