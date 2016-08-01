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
	game.physics.arcade.collide(this, game.map.platforms);

	// Do not allow walking off the left of the map
	if (this.x < 1) {
		this.body.velocity.x = 0;
		this.x = 1;
	}

	if (this.y > game.world.height * 2) {
		this.y = 128;
		this.x = this.x - 128;
		this.body.velocity.y = -50;
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
	var tile = null;

	if (this.body.velocity > 0) {
		tile = game.map.getTileWorldXY(this.x + this.width, this.y-32, 32, 32, game.map.platforms) ||
			game.map.getTileWorldXY(this.x, this.y-32, 32, 32, game.map.platforms);
	}
	else {
		tile = game.map.getTileWorldXY(this.x, this.y-32, 32, 32, game.map.platforms) ||
			game.map.getTileWorldXY(this.x + this.width, this.y-32, 32, 32, game.map.platforms);
	}
	
	if (tile != null) {
		// If the tile has a sprite associated with it and it has an activate
		// method, call that.
		if (tile.sprite && tile.sprite.activate) {
			tile.sprite.activate();
		}
		// Otherwise if it's a brick, just explode it.
		// TODO, Make "little mario" brick mode
		else if (tile.index == 15) {
			Brick.explode(game, tile);
		}
	}
}

