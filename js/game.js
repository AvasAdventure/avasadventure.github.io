var game = new Phaser.Game(1400, 1400,Phaser.CANVAS, 'ava-adventure', {preload: preload, create: create, update: update, setupGame: setupGame, playRound: playRound, drawCard: drawCard, showHand: showHand});
var playerStart;
var player1hand;
var player2hand;
var loadScreen;
var deck;
var card;
var spaceButton;
var playerActions = 2;	
var millWieken;

function preload() {
// load the card deck, hosted the JSON mocky for now
	game.load.json('card_deck', "assets/card_deck.json");
	game.load.crossOrigins = 'anonymous';
	game.load.image('background', 'assets/background-2.png');
	game.load.image('ava_v2', 'assets/ava_v2.png');
	game.load.image('ava_logo', 'assets/ava_logo.png');
	game.load.image('draw-button', 'assets/draw-button.png');
	game.load.image('start-button', 'assets/start-button.png');
	game.load.image('showhand-button', 'assets/showhand-button.png');
	game.load.image('hidehand-button', 'assets/hidehand-button.png');
	game.load.image('endturn-button', 'assets/endturn-button.png');
	game.load.image('restart-button', 'assets/restart-button.png');
	game.load.image('options-button', 'assets/options-button.png');
	game.load.image('wieken', 'assets/wieken.png');
	game.load.image('menu-container', 'assets/menu-container.png');
}
function create() {
	background = game.add.tileSprite(0, 0, 1400, 1400, 'background');
 	millWieken = game.add.sprite(game.world.centerX + 500, game.world.centerY -290, 'wieken');
 	millWieken.anchor.set(0.5, 0.5);
 // fade in menu, containing start and options buttins	
	menuContainer = game.add.sprite(game.world.centerX, game.world.centerY + 180, 'menu-container');
	menuContainer.anchor.set(0.5,0.5);
	menuContainer.alpha = 0;
	game.add.tween(menuContainer).to( { alpha: 1}, 10000, Phaser.Easing.Linear.None, true, 0, 0, false);
// ava logo, dropping in from top with bounce
	loadLogo = game.add.sprite(game.world.centerX, game.world.centerY - 300, 'ava_logo');
	loadLogo.anchor.set(0.5);
	loadLogo.scale.set(2, 2,);
 	game.add.tween(loadLogo).from( { y: -200 }, 2000, Phaser.Easing.Bounce.Out, true);

//  start button
	startButton = game.add.button(game.world.centerX, game.world.centerY, 'start-button', setupGame, this);
	startButton.anchor.set(0.5, 0.5);
	startButton.scale.set(0.8, 0.8);
	startButton.alpha = 0;
	game.add.tween(startButton).to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 2000, 0, false);
// options button !does not do anything yet
	optionsButton = game.add.button(game.world.centerX, game.world.centerY + 250, 'options-button', showOptions, this);
	optionsButton.anchor.set(0.5, 0.5);
	optionsButton.scale.set(0.8, 0.8);
	optionsButton.alpha = 0;
	game.add.tween(optionsButton).to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 2000, 0, false);
//	game.add.text(1000, 100, 'RESULTS IN CONSOLE -->>', { fill: '#cccccc'});
	game.add.text(1000, 1375, '© Humble Bumble 2017', { fill: '#ffffff'});
}

function update() {
	millWieken.angle += 0.5; 
}
function setupGame() {
// sets up game. stores the JSON containing the card deck in the variable 'deck'
	console.log('setting up game');
	this.deck = game.cache.getJSON('card_deck');
	console.log(this.deck);
	this.player1hand = [];
	this.player2hand = [];
// randomly decided who starts first.
	this.player1Turn = false;
	this.player2Turn = false;
// integerInRange(1,2) picks a random integer between 1 and 2, so just 1 or 2 in this case.
	this.playerStart = this.game.rnd.integerInRange(1, 2);
	if( this.playerStart == 1) {
		this.player1Turn = true;
		alert('Player 1 starts!');
	} else {
		this.player2Turn = true;
		alert('Player 2 starts!');
	}
// removes menu and buttons needs a better solution
	startButton.destroy();
	loadLogo.destroy();
	optionsButton.destroy();
	menuContainer.destroy();
// adds UI buttons
// first adds the playButton, which call drawcard on click.
	playButton = game.add.button(700, game.world.centerY + 600, 'draw-button', playRound, this);
	playButton.anchor.set(0.3, 0.3);
	playButton.scale.set(0.5, 0.5);
// button to show player hand, 
	showHandButton = game.add.button(200, game.world.centerY + 600, 'showhand-button', showHand, this);
	showHandButton.anchor.set(0.3, 0.3);
	showHandButton.scale.set(0.5, 0.5);
// button to hide player hand
	hideHandButton = game.add.button(450, game.world.centerY + 600, 'hidehand-button', hideHand, this);
	hideHandButton.anchor.set(0.3,0.3);
	hideHandButton.scale.set(0.5, 0.5);
// button to end turn
	endTurnButton = game.add.button(1200, game.world.centerY + 600, 'endturn-button', endTurn, this);
	endTurnButton.anchor.set(0.3, 0.3);
	endTurnButton.scale.set(0.5, 0.5);
}
function playRound() {
// button that calls drawCard, first checks which player turn an if there are actions left. 
	if(this.player1Turn && playerActions != 0){
		console.log('player1 draws: ');
		this.drawCard(this.player1hand);
		console.log(this.card.description);
		this.player1hand.splice(0, 0, this.card);
		playerActions = playerActions - 1;
		this.drawCard(this.player1hand);
		console.log('player 1 hand size :' + this.player1hand.length);
		console.log('actions left: ' + playerActions);
	} else if (this.player2Turn && playerActions != 0){
		console.log('player2 draws: ');
		this.drawCard(this.player2hand);
		console.log(this.card.description);
		this.player2hand.splice(0,0, this.card);
		playerActions = playerActions - 1;
		this.drawCard(this.player2hand);
		console.log('player 2 hand size: ' + this.player2hand.length);
		console.log('Actions left: ' + playerActions);
	} else {
		alert('No more moves left, please end your turn');
	}
}
function showHand() {
// adds cards to the screen, depending on the length of the player hand.
	if (this.player1Turn) {
		for (var i = 0; i < this.player1hand.length; i++) {
			ava = game.add.sprite(i * 100, 1000, 'ava_v2');
			ava.scale.setTo(0.4,0.4);
		}
		console.log('showing player 1 hand');
	} else if (this.player2Turn) {
		for (var i = 0; i < this.player2hand.length; i++) {
			ava = game.add.sprite(i * 100, 100, 'ava_v2');
			ava.scale.setTo(0.2,0.2);
		}
		console.log('showing player 2 hand');
	} else {
		console.log('something went wrong on showHand');
	}
}
function showOptions() {
// what options?
	console.log('option button click registered');
}

function hideHand() {
// 
	if(this.player1Turn) {
		for (var i = 1; i < (this.player1hand.length + 1); i++) {
			console.log('hid player 1 hand');
		}
	} else if (this.player2Turn) {
		for (var i = 1; i  (this.player2hand.length + 1); i++) {

			console.log('hid player 2 hand');
		}	
	} else {
		console.log('something went wrong on hideHand');
	}
}	
function drawCard() {
// math.random calls a float between 0 and 1, this is multiplied with the length of the deck, and rounded up to the nearest integer.
		var i = Math.floor(Math.random()* this.deck.length);
		this.card = this.deck[i];
}
function endTurn() {
// engs the player turn, first checks if there are actions left, switches between player turns and resets the playerActions to 2 actions.
	if((this.player1Turn && playerActions != 0) || (this.player2Turn && playerActions !=0)) {
		alert('you still have moves left!1!!11!');
	} else if(this.player1Turn && playerActions == 0) {
		this.player1Turn = false;
		this.player2Turn = true;
		playerActions = 2;
		alert('player 1 turn ended \nplayer 2 turn starts');
	} else if(this.player2Turn && playerActions == 0){
		this.player2Turn = false;
		this.player1Turn = true;
		playerActions = 2;
		alert('player 2 turn ended \nplayer 1 turn starts');
	} else {
		console.log('something went wrong on endTurn');
	}
}