/**
 * A player being played by someone else.  Backend will call static
 * CRUD methods to update.
 */
function RemotePlayer(g, x, y, spritekey, frame) {
	Player.call(this, game, x, y, spritekey);
}
RemotePlayer.prototype = Object.create(Player.prototype);
RemotePlayer.prototype.constructor = RemotePlayer;

// All player lookup table.
RemotePlayer.players = {}

RemotePlayer.add = function(key, x, y) {
	var newPC = new RemotePlayer(game, x, y, 'dude');
	RemotePlayer.players[key] = newPC;
}

RemotePlayer.update = function(key, data) {
	pc = RemotePlayer.players[key];
	pc.x = data.x;
	pc.y = data.y;
	pc.body.velocity.x = data.vx;
	pc.body.velocity.y = data.vy;

	if (data.vx < 0) {
		pc.animations.play('left');
	}
	else if (data.vx > 0) {
		pc.animations.play('right');
	}
	else {
		pc.animations.stop();
	}
	pc.frame = data.frame;
}

RemotePlayer.remove = function(key) {
	RemotePlayer.players[key].kill();
	delete RemotePlayer.players[key];
}
