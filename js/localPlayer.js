/**
 * Local interactive player.  Adds in the keyboard controls and sends updates 
 * to Backend
 */
function LocalPlayer(game, x, y, key, frame) {
	Player.call(this, game, x, y, key);

	// Set up keyboard controls
	this.cursors = game.input.keyboard.createCursorKeys();
    this.cursors.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

    // Set up regular updates to the backend
    this.timer = game.time.create(false);
    this.timer.loop(100, this.send, this);
    this.timer.start();

    // Have the game camera follow me
    game.camera.follow(this);

    this.checkForWorldBounds = true;
}

LocalPlayer.prototype = Object.create(Player.prototype);
LocalPlayer.prototype.constructor = LocalPlayer;

LocalPlayer.prototype.update = function() {
	Player.prototype.update.call(this);

	if (this.cursors.left.isDown) {
		this.body.acceleration.x = -400;
		
		if (this.body.velocity.x > 0)
			this.body.acceleration.x *= 3;

		if (this.cursors.shift.isDown)
			this.body.velocity.x = Math.max(this.body.velocity.x, -500);
		else
			this.body.velocity.x = Math.max(this.body.velocity.x, -300);

		this.animations.play('left');

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

LocalPlayer.prototype.send = function() {
	backend.update(this);
}

