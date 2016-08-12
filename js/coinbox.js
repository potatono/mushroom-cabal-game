/**
 * A question mark box. Initialized by createFromTile() in createMap()
 */
function Coinbox(game, x, y, key, frame) {
	Phaser.Sprite.call(this, game, x, y, 'coinbox');
	this.animations.add('spin', [0, 1, 2, 3], 8, true);
	this.animations.play('spin');

	// Get the tile that we were created from and connect it to us
	// That way our Player.bonk code can be nice and simple
	var tile = game.map.getTileWorldXY(x, y, 32, 32, frame);
	tile.sprite = this;

	this.empty = false;

	this.bounce = game.add.tween(this);
	this.bounce.to({ y: y-20 }, 100, Phaser.Easing.Default, false, 0, 0, true);
}

Coinbox.prototype = Object.create(Phaser.Sprite.prototype);
Coinbox.prototype.constructor = Coinbox;

Coinbox.prototype.activate = function() {
	if (!this.empty) {
		this.animations.stop();
		this.empty = true;
		this.frame = 4;
	
		this.bounce.start();

		var timer = game.time.create(false);
		timer.add(10000 + Math.random() * 30000, this.refill, this);
		timer.start();

		var coin = new Coin(game, this.x, this.y);
	}
}

Coinbox.prototype.refill = function() {
	this.empty = false;
	this.animations.play('spin');
}
