/**
 * Handles the communication with Firebase backend.  Database change events result in calls
 * to RemotePlayer.  LocalPlayer periodically calls update to update database.
 */
function Backend() {
    var config = {
      apiKey: "AIzaSyDByxK8G4vzJs_DDaB3YSkjBgCjA5Bxyvc",
      authDomain: "mushroom-cabal.firebaseapp.com",
      databaseURL: "https://mushroom-cabal.firebaseio.com",
      storageBucket: "mushroom-cabal.appspot.com",
    };
    var backend = firebase.initializeApp(config);

    this.chatRef = backend.database().ref("/rooms/chat/chat");
	this.tilesRef = backend.database().ref("/rooms/chat/tiles");

	// Create an entry for our local player
	var players = backend.database().ref("/rooms/chat/players")
	var key = players.push().key;
	this.playerRef = players.child(key);

	// Setup event handlers
	var self = this;
	players.on("child_added", function(data) { self.playerAdded(data) });
	players.on("child_changed", function(data) { self.playerChanged(data) });
	players.on("child_removed", function(data) { self.playerRemoved(data) });
	this.tilesRef.on("child_added", function(data) { self.tileAdded(data) });
	this.tilesRef.on("child_removed", function(data) { self.tileRemoved(data) });
	this.tilesRef.on("child_changed", function(data) { self.tileChanged(data) });
	this.chatRef.on("child_added", function(data) { self.chatAdded(data) });
	this.chatRef.on("child_removed", function(data) { self.chatRemoved(data) });
	this.chatRef.on("child_changed", function(data) { self.chatChanged(data) });

}

Backend.prototype = Object.create(Object.prototype);
Backend.prototype.constructor = Backend;

Backend.prototype.playerAdded = function(data) {
	// If the add isn't ourself, update RemotePlayer
	if (data.key != this.playerRef.key) {
		var val = data.val();
		RemotePlayer.add(data.key, val.x, val.y)
	}
}

Backend.prototype.playerChanged = function(data) {
	// If the update isn't ours, update RemotePlayer
	if (data.key != this.playerRef.key) {
		var val = data.val();
		RemotePlayer.change(data.key, val);
	}
}

Backend.prototype.playerRemoved = function(data) {
	// If the remove isn't us, update RemotePlayer
	if (data.key != this.playerRef.key) {
		RemotePlayer.remove(data.key);
	}
}

// Regularly called from LocalPlayer to update database
Backend.prototype.updatePlayer = function(player) {
	this.playerRef.set({
	    "x": player.x,
	    "y": player.y,
	    "vx": player.body.velocity.x,
	    "vy": player.body.velocity.y,
	    "frame": player.frame
	});
}

// Clean up entry as we exist so we don't leave a bunch of
// abandoned players on the map.
Backend.prototype.destroy = function() {
	this.playerRef.remove();
	this.playerRef = null;
}

Backend.prototype.tileAdded = Backend.prototype.tileChanged = function(data) {
	var pos = data.key.split(",");
	var val = data.val();
	game.map.putTileWorldXY(val, pos[0], pos[1], 32, 32, game.map.platforms);
}

Backend.prototype.tileRemoved = function(data, name) {
	var pos = data.key.split(",");
	game.map.removeTileWorldXY(pos[0], pos[1], 32, 32, game.map.platforms);
}

Backend.prototype.updateTile = function(x, y, index) {
	this.tilesRef.child(x + "," + y).set(index);
}


Backend.prototype.chatAdded = function(data) {
	chat.append(data.key, data.val());
}

Backend.prototype.chatChanged = function(data) {
	chat.update(data.key, data.val());
}

Backend.prototype.chatRemoved = function(data) {
	chat.remove(data.key);
}

Backend.prototype.chatSay = function(data) {
	this.chatRef.push(data);
}



