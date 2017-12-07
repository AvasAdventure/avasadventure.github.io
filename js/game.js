var game = new Phaser.Game(1400, 1400, Phaser.CANVAS, 'ava-adventure', {preload: preload, create: create, update: update, setupGame: setupGame, playRound: playRound, drawCard: drawCard, showHand: showHand});
var playerStart;
var player1hand;
var player2hand;
var deck;
var card;
var playerActions = 2;

function preload() {
// load the card deck, hosted the JSON mocky for now
	game.load.json('card_deck', "http://www.mocky.io/v2/5a284ecb2f00008a3b0636ad");
	game.load.crossOrigins = 'anonymous';
	game.load.image('ava_v2', 'assets/ava_v2.png');
	game.load.image('draw-button', 'assets/draw-button.png');
	game.load.image('start-button', 'assets/start-button.png');
	game.load.image('showhand-button', 'assets/showhand-button.png');
	game.load.image('hidehand-button', 'assets/hidehand-button.png');
	game.load.image('endturn-button', 'assets/endturn-button.png');
}
function create() {
	startButton = game.add.button(game.world.centerX, game.world.centerY, 'start-button', setupGame, this);
	startButton.anchor.set(0.5, 0.5);
	game.add.text(1000, 100, 'RESULTS IN CONSOLE -->>', { fill: '#cccccc'});
}
function update() {
}
function setupGame() {
	console.log('setting up game')
	this.deck = game.cache.getJSON('card_deck');
	console.log(this.deck);
	this.player1hand = [];
	this.player2hand = [];
	// who starts first
	this.player1Turn = false;
	this.player2Turn = false;
	this.playerStart = this.game.rnd.integerInRange(1, 2);
	if( this.playerStart == 1) {
		this.player1Turn = true;
		alert('Player 1 starts!');
	} else {
		this.player2Turn = true;
		alert('Player 2 starts!');
	}
	startButton.destroy();
	playButton = game.add.button(game.world.centerX, game.world.centerY + 200, 'draw-button', playRound, this);
	playButton.anchor.set(0.5, 0.5);
	showHandButton = game.add.button(200, game.world.centerY + 400, 'showhand-button', showHand, this);
	showHandButton.anchor.set(0.5, 0.5);
	hideHandButton = game.add.button(200, game.world.centerY + 600, 'hidehand-button', hideHand, this);
	hideHandButton.anchor.set(0.5,0.5);
	endTurnButton = game.add.button(1200, game.world.centerY + 400, 'endturn-button', endTurn, this);
	endTurnButton.anchor.set(0.5, 0.5);
}
function playRound() {
	if(this.player1Turn && playerActions != 0){
		console.log('player1 draws: ');
		this.drawCard(this.player1hand);
		console.log(this.card.description);
		this.player1hand.splice(0, 0, this.card);
		playerActions = playerActions - 1;
		this.drawCard(this.player1hand);
		console.log('player 1 hand size :' + this.player1hand.length);
		console.log('Actions left: ' + playerActions);
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
	if (this.player1Turn) {
		for (var i = 0; i < this.player1hand.length; i++) {
			ava = game.add.sprite(i * 100, 100, 'ava_v2');
			ava.scale.setTo(0.2,0.2);
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
	console.log('did not showhand');
}
function hideHand() {
	console.log('Not implemented yet')
}	
function drawCard() {
		var i = Math.floor(Math.random()* this.deck.length);
		this.card = this.deck[i];
}
function endTurn() {
	if((this.player1Turn && playerActions != 0) || (this.player2Turn && playerActions !=0)) {
		alert('you still have moves left!1!!11!');
	} else if(this.player1Turn && playerActions == 0) {
		this.player1Turn = false;
		this.player2Turn = true;
		alert('player 1 turn ended \nplayer 2 turn starts');
	} else if(this.player2Turn && playerActions == 0){
		this.player2Turn = false;
		this.player1Turn = true;
		alert('player 2 turn ended \nplayer 1 turn starts');
	} else {
		console.log('something went wrong on endTurn');
	}
	playerActions = 2;
}