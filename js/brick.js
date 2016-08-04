function Brick(game, x, y, key, frame) {
	// TODO Implement small-mario brick bounce

}

Brick.spawnPart = function(x, y, frame, dir) {
	var part = new Phaser.Sprite(game, x, y, 'brickparts');
	game.physics.enable(part, Phaser.Physics.ARCADE);
	part.frame = frame;
	part.checkWorldBounds = true;
	part.outOfBoundsKill = true;
	part.angle = 45 * dir;
	part.body.gravity.y = 2000;
	part.body.velocity.y = -500;
	part.body.velocity.x = 150 * dir;
	game.world.add(part);	
}

Brick.explode = function(game, tile) {
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

	Brick.spawnPart(tile.worldX, tile.worldY, 0, -1);
	Brick.spawnPart(tile.worldX + 16, tile.worldY, 1, 1);
	Brick.spawnPart(tile.worldX, tile.worldY + 16, 2, -1);
	Brick.spawnPart(tile.worldX + 16, tile.worldY + 16, 3, 1);
}

