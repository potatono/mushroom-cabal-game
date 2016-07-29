/**
 * Cha-ching!
 */
function Coin(game, x, y, key, frame) {
	Phaser.Sprite.call(this, game, x, y, 'coin');
	this.animations.add('spin', [0, 1, 2, 3], 8, true);
	this.animations.play('spin');
	
	game.physics.arcade.enable(this);
    this.body.bounce.y = 0.4;
    this.body.gravity.y = 600;
    this.body.collideWorldBounds = false;
    this.body.bounce.x = 1;

    // Add to collision detection group
    Coin.group.add(this);

    // Tween when rising out of the box
    this.rise = game.add.tween(this);
    this.rise.to({ y: y-48 }, 100, Phaser.Easing.Default, false, 0, 0, false);
    this.rise.onComplete.add(function() { this.body.velocity.x = 100; }, this);
    this.rise.start();
}

Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;

Coin.prototype.update = function() {
	game.physics.arcade.collide(this, game.map.platforms);
}

// Created by game create()
Coin.group = null;
