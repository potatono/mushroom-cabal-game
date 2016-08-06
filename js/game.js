var game;
var player;
var builder;
var menu;

// Called in input.html to start the game.  TODO migrate to a window.load or document.ready event.
function start() {
	game = new Phaser.Game(800, 512, Phaser.AUTO, '', { 
		preload: preload, 
		create: create, 
		render: render 
	});
	window.addEventListener("beforeunload", destroy);
}

// Called by Phaser.Game init to preload assets
function preload() {
	game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('coinbox', 'assets/coinbox.png', 32, 32);
  game.load.spritesheet('coin', 'assets/coin.png', 32, 32);
  game.load.tilemap('objects', 'assets/map1-1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/map-tiles.png');
  game.load.spritesheet('tilesprites', 'assets/map-tiles.png', 32, 32);
  game.load.spritesheet('brickparts', 'assets/brick.png', 16, 16);
  game.load.image('selector', 'assets/selector.png', 32, 32);
  game.load.image('menu-bg', 'assets/menu-bg.png');
}

// Called by Phaser.Game init to set up the game
function create() {
  // Enable physics
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Tile the background image
  game.add.tileSprite(0, 0, 212*32, game.cache.getImage('sky').height, 'sky');

  // Load the map built in Tiled
  createMap();

  // Set up groups for collision detection
  Coin.group = game.add.group();
  Coin.group.enableBody = true;

  // Set up our player
  player = new LocalPlayer(game, 32, 128, 'dude');

  // Setup our chat input (TODO move)
  createChatInput();

  // TODO REFACTOR move to contorls
  var key = game.input.keyboard.addKey(Phaser.Keyboard.P);
  key.onUp.add(function() { game.paused = !game.paused }, game);

  menu = new Menu(game);
  builder = new Builder(game);
  game.controls = new Controls(game);
}

// Load the map we created in Tiled
function createMap() {
	game.map = game.add.tilemap('objects');
	game.map.addTilesetImage('items', 'tiles');

	// Set up our layer for tiles.
	game.map.platforms = game.map.createLayer('World 1-1');
	game.map.platforms.resizeWorld();
	game.map.platforms.wrap = true;
	
	// Define which tiles result in collisions nwith the player
  game.map.setCollisionBetween(14, 16);	
  game.map.setCollisionBetween(21, 22);
  game.map.setCollisionBetween(27, 28);
  game.map.setCollisionByIndex(10);
  game.map.setCollisionByIndex(13);
  game.map.setCollisionByIndex(17);
  game.map.setCollisionBetween(40, 43);

  // Upgrade the coinbox tiles to sprites since they're animated
  game.map.createFromTiles(14, 1, 'coinbox', game.map.platforms, game.world, { customClass: Coinbox });
}

// Create the chat input box TODO move me into separate class..
function createChatInput() {
	var input = document.createElement("input");
    input.id = "chat-input";
    input.addEventListener("focus", function() { game.input.keyboard.enabled = false; });
    input.addEventListener("focusout", function() { game.input.keyboard.enabled = true; });
    input.addEventListener("blur", function() { game.input.keyboard.enabled = true; });
    input.addEventListener("keyup", function(e) { if (e.keyCode == 27) { game.canvas.focus(); }})
    input.tabIndex = 2;
    game.canvas.tabIndex = 1;
    // TODO REFACTOR move to contorls
    var key = game.input.keyboard.addKey(Phaser.Keyboard.T);
    key.onUp.add(function() { document.getElementById('chat-input').focus(); }, game);
    document.body.appendChild(input);
}

// Called on every frame when we render.  Used for debugging.
function render() {
	//game.debug.bodyInfo(player, 0, 100);
}

// Make sure we destroy players on the backend so we don't leave a bunch
// of abandoned players on the map
function destroy() {
	game.destroy();
	backend.destroy();
	game = null;
}
