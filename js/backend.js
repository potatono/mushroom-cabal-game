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
    // TODO Only one room for now
	var gameBackend = backend.database().ref("/rooms/chat/game")

	// Create an entry for our local player
	var key = gameBackend.push().key;
	this.ref = gameBackend.child(key);

	// Setup event handlers
	var self = this;
	gameBackend.on("child_added", function(data) { self.addPlayer(data) });
	gameBackend.on("child_changed", function(data) { self.changePlayer(data) });
	gameBackend.on("child_removed", function(data) { self.removePlayer(data) });
}

Backend.prototype = Object.create(Object.prototype);
Backend.prototype.constructor = Backend;

Backend.prototype.addPlayer = function(data) {
	// If the add isn't ourself, update RemotePlayer
	if (data.key != this.ref.key) {
		var val = data.val();
		RemotePlayer.add(data.key, val.x, val.y)
	}
}

Backend.prototype.changePlayer = function(data) {
	// If the update isn't ours, update RemotePlayer
	if (data.key != this.ref.key) {
		var val = data.val();
		RemotePlayer.change(data.key, val);
	}
}

Backend.prototype.removePlayer = function(data) {
	// If the remove isn't us, update RemotePlayer
	if (data.key != this.ref.key) {
		RemotePlayer.remove(data.key);
	}
}

// Regularly called from LocalPlayer to update database
Backend.prototype.update = function(player) {
	//console.log("BooP");
	this.ref.set({
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
	this.ref.remove();
	this.ref = null;
}

var backend = new Backend();


