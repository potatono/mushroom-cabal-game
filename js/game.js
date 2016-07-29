var game;
var player;
var platforms;
var cursors;
var ref;
var pcs = {};
var coinboxes;
var coinbox;
var coins;
var map;

function start() {
	game = new Phaser.Game(800, 512, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
	var gameBackend = backend.database().ref("/rooms/chat/game")
	var key = gameBackend.push().key;
	ref = gameBackend.child(key);
	window.addEventListener("beforeunload", destroy);
	gameBackend.on("child_added", addPC);
	gameBackend.on("child_changed", updatePC);
	gameBackend.on("child_removed", removePC);
}

function preload() {
	game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('coinbox', 'assets/coinbox.png', 32, 32);
    game.load.spritesheet('coin', 'assets/coin.png', 32, 32);
    game.load.tilemap('objects', 'assets/map1-1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles','assets/map-tiles.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

	game.add.tileSprite(0, 0, 212*32, game.cache.getImage('sky').height, 'sky');

  	map = game.add.tilemap('objects');
  	map.addTilesetImage('items', 'tiles');
  	platforms = map.createLayer('World 1-1');
  	platforms.resizeWorld();
  	platforms.wrap = true;
  	
  	map.setCollisionBetween(14, 16);
	map.setCollisionBetween(21, 22);
	map.setCollisionBetween(27, 28);
	map.setCollisionByIndex(10);
	map.setCollisionByIndex(13);
	map.setCollisionByIndex(17);
	map.setCollisionByIndex(40);
	map.setCollisionByIndex(41);
	map.setCollisionByIndex(42);
	map.setCollisionByIndex(43);

	coinboxes = game.add.group();
	coinboxes.enableBody = true;

    coins = game.add.group();
    coins.enableBody = true;

	map.createFromTiles(14, 1, 'coinbox', platforms, coinboxes, { customClass: Coinbox });
	
	//map.setTileIndexCallback(14, function (s) { console.log(s); }, this);
	coinbox = coinboxes.getAt(0);

    player = new Player(32, 128, true);

    game.camera.follow(player);


    cursors = game.input.keyboard.createCursorKeys();

    var input = document.createElement("input");
    input.id = "chat-input";
    input.addEventListener("focus", function() { game.input.keyboard.enabled = false; });
    input.addEventListener("focusout", function() { game.input.keyboard.enabled = true; });
    input.addEventListener("blur", function() { game.input.keyboard.enabled = true; });
    input.addEventListener("keyup", function(e) { if (e.keyCode == 27) { game.canvas.focus(); }})
    input.tabIndex = 2;
    game.canvas.tabIndex = 1;
    var key = game.input.keyboard.addKey(Phaser.Keyboard.T);
    key.onUp.add(function() { document.getElementById('chat-input').focus(); }, game);

    cursors.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

    document.body.appendChild(input);

    timer = game.time.create(false);
    timer.loop(100, sendPlayer, this);
    timer.start();
}

function update() {

}

function render() {
	game.debug.bodyInfo(coinbox, 0, 100);
}

function sendPlayer() {
	var data = {
		    "x": player.x,
		    "y": player.y,
		    "vx": player.body.velocity.x,
		    "vy": player.body.velocity.y,
		    "frame": player.frame
		};
	try {
		ref.set(data);
	}
	catch (e) {
		console.log(data);
	}
}

function destroy() {
	game.destroy();
	ref.remove();
	game = null;
	ref = null;
}

function addPC(data) {
	if (data.key != ref.key) {
		var val = data.val();
		var newPC = new Player(val.x, val.y, false);
		pcs[data.key] = newPC;
	}
}

function updatePC(data) {
	if (data.key != ref.key) {
		var val = data.val();
		var pc = pcs[data.key];
		pc.x = val.x;
		pc.y = val.y;
		pc.body.velocity.x = val.vx;
		pc.body.velocity.y = val.vy;

		if (val.vx < 0) {
			pc.animations.play('left');
		}
		else if (val.vx > 0) {
			pc.animations.play('right');
		}
		else {
			pc.animations.stop();
		}
		pc.frame = val.frame;
	}
}

function removePC(data) {
	if (data.key != ref.key) {
		pcs[data.key].kill();
		delete pcs[data.key];
	}
}


function Player(x, y, interactive) {
	Phaser.Sprite.call(this, game, x, y, 'dude');

	this.interactive = interactive;

    game.physics.arcade.enable(this);

    //  Player physics properties. Give the little guy a slight bounce.
    this.body.bounce.y = 0.2;
    this.body.gravity.y = 2000;
    //this.body.gravity.x = 20;
    //this.body.collideWorldBounds = true;
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

	game.physics.arcade.collide(this, platforms);

	if (this.x < 1) {
		this.body.velocity.x = 0;
		this.x = 1;
	}

	if (this.interactive) {
		if (cursors.left.isDown) {
			this.body.acceleration.x = -400;
			
			if (this.body.velocity.x > 0)
				this.body.acceleration.x *= 3;

			if (cursors.shift.isDown)
				this.body.velocity.x = Math.max(this.body.velocity.x, -500);
			else
				this.body.velocity.x = Math.max(this.body.velocity.x, -300);

			this.animations.play('left');
		}
		else if (cursors.right.isDown) {
			this.body.acceleration.x = 400;

			if (this.body.velocity.x < 0)
				this.body.acceleration.x *= 3;

			if (cursors.shift.isDown)
				this.body.velocity.x = Math.min(this.body.velocity.x, 500);
			else
				this.body.velocity.x = Math.min(this.body.velocity.x, 300);
			
			this.animations.play('right');
		}
		else {
			this.body.acceleration.x = 0;

			if (Math.abs(this.body.velocity.x) < 1) {
				this.body.velocity.x = 0;
				this.animations.stop();
				this.frame = 4;
			}
		}
	    
	    //  Allow the player to jump if they are touching the ground.
	    if (cursors.up.isDown && this.body.onFloor())
	    {
	        this.body.velocity.y = -850;
	    }

	    if (this.body.blocked.up) {
	    	var tile = map.getTileWorldXY(this.x, this.y-32,32,32,platforms);
	    	if (tile != null) {
	    		console.log(tile);
	    		console.log(tile.activate);
	    	}
	    }
	}

	game.physics.arcade.overlap(player, coins, this.collectCoin, null, this);
}

Player.prototype.collectCoin = function(player, coin) {
	coin.kill();
}


function Block(g, x, y, key, frame) {
	
}
Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;

Block.prototype.update = function() {}


function Coinbox(g, x, y, key, frame) {
	Phaser.Sprite.call(this, game, x, y, 'coinbox');
	this.animations.add('spin', [0, 1, 2, 3], 8, true);
	this.animations.play('spin');
	// platforms.add(this);
	// this.body.immovable = true;


	this.empty = false;

	this.bounce = game.add.tween(this);
	this.bounce.to({ y: y-20 }, 100, Phaser.Easing.Default, false, 0, 0, true);
}


Coinbox.prototype = Object.create(Phaser.Sprite.prototype);
Coinbox.prototype.constructor = Coinbox;

Coinbox.prototype.update = function() {
	// TODO FIXME I can't figure out how to do this the right way
	if (!this.empty && player.body.blocked.up && 
		player.x + player.width >= this.x && player.x <= this.x + this.width &&
		player.y >= this.y && player.y <= this.y + this.height + 10)
	{
		this.activate();
	}
		
}

Coinbox.prototype.activate = function() {
	this.animations.stop();
	this.empty = true;
	this.frame = 4;
	
	this.bounce.start();

	var timer = game.time.create(false);
	timer.add(10000 + Math.random() * 30000, this.refill, this);
	timer.start();

	var coin = new Coin(this.x, this.y);
}

Coinbox.prototype.refill = function() {
	this.empty = false;
	this.animations.play('spin');
}

function Coin(x, y) {
	Phaser.Sprite.call(this, game, x, y, 'coin');
	this.animations.add('spin', [0, 1, 2, 3], 8, true);
	this.animations.play('spin');
	
	game.physics.arcade.enable(this);
    this.body.bounce.y = 0.4;
    this.body.gravity.y = 600;
    this.body.collideWorldBounds = false;
    this.body.bounce.x = 1;

    coins.add(this);

    this.rise = game.add.tween(this);
    this.rise.to({ y: y-48 }, 100, Phaser.Easing.Default, false, 0, 0, false);
    this.rise.onComplete.add(function() { this.body.velocity.x = 100; }, this);
    this.rise.start();
}

Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;

Coin.prototype.update = function() {
	game.physics.arcade.collide(this, platforms);
}