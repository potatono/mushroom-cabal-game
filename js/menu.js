function Menu(game) {
	this.group = game.add.group(null, 'menu', true);
	this.group.visible = false;

	var left = game.width/2-192;
	var top = game.height/2-192

	game.add.image(left, top, 'menu-bg', game.world, this.group);

  	var ti = game.cache.getImage('tilesprites');
  	var spriteCount = ti.width*ti.height/(32*32);
  	this.tiles = [];
  	

  	for (var i=0; i<spriteCount; i++) {
  		var x = i % 10 * 36 + left + 12;
  		var y = Math.floor(i/10) * 36 + top + 12;
  		game.add.sprite(x, y, 'tilesprites', i, this.group);
  		this.tiles.push({
  			'x': x,
  			'y': y,
  			'index': i + 1
  		});
  	}

  	this.selected = 0;

  	this.selector = game.add.sprite(0, 0, 'selector', 0, this.group);
}


Menu.prototype.select = function(delta) {
	this.selected += delta;

	while (this.selected < 0) 
		this.selected += this.tiles.length;

	while (this.selected >= this.tiles.length)
		this.selected -= this.tiles.length;

	var tile = this.tiles[this.selected];
	this.selector.x = tile.x;
	this.selector.y = tile.y;
	builder.index = tile.index;
}

Menu.prototype.onActorIn = function() {
	this.group.visible = true;
	this.select(0);
}

Menu.prototype.onActorOut = function() {
	this.group.visible = false;
}

Menu.prototype.onLeftDown = function() {
	this.select(-1);
}

Menu.prototype.onRightDown = function() {
	this.select(1);
}

Menu.prototype.onUpDown = function() {
	this.select(-10);
}

Menu.prototype.onDownDown = function() {
	this.select(10);
}
