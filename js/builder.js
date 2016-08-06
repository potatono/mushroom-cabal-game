function Builder(game) {
	Phaser.Sprite.call(this, game, 0, 0, 'tilesprites', 15);

	this.visible = false;
	game.add.existing(this);
	this.index = 15;
	this.alpha = 0.5;

	this.selector = game.add.sprite(0, 0, 'selector', 0);
	this.selector.visible = false;
}

Builder.prototype = Object.create(Phaser.Sprite.prototype);
Builder.prototype.constructor = Builder;

Builder.prototype.onSpaceDown = function() {
	// var tile = game.map.getTileWorldXY(this.x, this.y, 32, 32, game.map.platforms)
	// var newTile = game.map.putTileWorldXY(this.index, this.x, this.y, 32, 32, game.map.platforms);

	// if (tile != null) {
	// 	newTile.oldIndex = tile.index;
	// }

	backend.updateTile(this.x, this.y, this.index);
}

Builder.prototype.onActorOut = function() {
	this.visible = false;
	this.selector.visible = false;
}

Builder.prototype.onActorIn = function(oldActor) {
	if (oldActor == player) {
		this.selector.x = this.x = game.math.snapToFloor(player.x + player.width, 32);
		this.selector.y = this.y = game.math.snapToFloor(player.y + player.height, 32);
	}
	this.frame = this.index - 1;

	this.visible = true;
	this.selector.visible = true;
}

Builder.prototype.onLeftDown = function() {
	this.selector.x = this.x -= 32;
}

Builder.prototype.onRightDown = function() {
	this.selector.x = this.x += 32;
}

Builder.prototype.onUpDown = function() {
	this.selector.y = this.y -= 32;
}

Builder.prototype.onDownDown = function() {
	this.selector.y = this.y += 32;
}
