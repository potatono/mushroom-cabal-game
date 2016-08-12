function Controls(game) {
	// Set up keyboard controls
	this.keys = game.input.keyboard.createCursorKeys();
    this.keys.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    this.keys.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.keys.escape = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.keys.t = game.input.keyboard.addKey(Phaser.Keyboard.T);
    this.keys.e = game.input.keyboard.addKey(Phaser.Keyboard.E);

    for (var key in this.keys) {
    	var uckey = key.charAt(0).toUpperCase() + key.slice(1);
    	this.keys[key].onDown.add(this.onKey, this, 0, uckey, "Down");
    	this.keys[key].onUp.add(this.onKey, this, 0, uckey, "Up");
    }

    this.actor = player;
}

Controls.prototype.onKey = function(key, name, action) {
	var eventName = "on" + name + action;
	var cascade = true;

	if (this[eventName]) {
		cascade = !this[eventName](key);
	}
	
	if (cascade && this.actor && this.actor[eventName]) {
		this.actor[eventName](key, this.keys);
	}
}

Controls.prototype.changeActor = function(newActor) {
	if (this.actor !== newActor) {
		var oldActor = this.actor;

		if (this.actor && this.actor["onActorOut"]) {
			this.actor["onActorOut"](oldActor, this.keys);
		}

		this.actor = newActor;

		if (this.actor && this.actor["onActorIn"]) {
			this.actor["onActorIn"](oldActor, this.keys);
		}

		return true;
	}

	return false;
}

Controls.prototype.onEDown = function() {
	if (this.actor == menu)
		return this.changeActor(builder);
	else
		return this.changeActor(menu);
}

Controls.prototype.onEscapeDown = function() {
	return this.changeActor(player);
}

Controls.prototype.onSpaceDown = function() {
	return this.changeActor(builder)
}

Controls.prototype.onTDown = function() {
	document.getElementById('chat-input').focus();
}