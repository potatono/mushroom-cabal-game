/**
 * Common base class for RemotePlayer and LocalPlayer.
 */
function Player(game, x, y, spritekey, frame) {
	Phaser.Sprite.call(this, game, x, y, 'dude');

    game.physics.arcade.enable(this);

    //  Player physics properties. Give the little guy a slight bounce.
    this.body.bounce.y = 0.2;
    this.body.gravity.y = 2000;
    this.body.maxVelocity = 300;
    this.body.drag.x = 300;

    //  Our two animations, walking left and right.
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);

    game.add.existing(this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
	// Do not allow walking off the left of the map
	if (this.x < 1) {
		this.body.velocity.x = 0;
		this.x = 1;
	}

	// If we ran into a tile, check to see if we can activate it
	if (this.body.blocked.up) {
		this.bonk();
	}

	game.physics.arcade.overlap(player, Coin.group, this.collectCoin, null, this);
}

Player.prototype.collectCoin = function(player, coin) {
	// TODO Record collection
	coin.kill();
}

Player.prototype.bonk = function() {
	// TODO FIXME this needs to be tighter.  It should take into account which way
	// the player is facing and look at the front corner and then the back corner.
	var tile = game.map.getTileWorldXY(this.x, this.y-32,32,32, game.map.platforms);
	
	if (tile != null) {
		// If the tile has a sprite associated with it and it has an activate
		// method, call that.
		if (tile.sprite && tile.sprite.activate) {
			tile.sprite.activate();
		}
		// Otherwise if it's a brick, just remove it.  TODO REFACTOR
		else if (tile.index == 15) {
			// Remove it
			game.map.removeTile(tile.x, tile.y);

			// Add it back after awhile
			var timer = game.time.create(true);
			timer.add(
				10000 + Math.random() * 30000, 
				function(i, x, y) { game.map.putTile(i, x, y, game.map.platforms) }, 
				this,
				tile.index,
				tile.x,
				tile.y
			);
			timer.start();
		}
	}
}

