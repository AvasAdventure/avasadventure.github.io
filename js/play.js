var playState = {
	preload: function() {
		background = game.add.tileSprite(0, 0, 1400, 1400, 'background');
 		millWieken = game.add.sprite(game.world.centerX + 500, game.world.centerY -290, 'wieken');
 		millWieken.anchor.set(0.5, 0.5);
// adds UI buttons
// first adds the playButton, which call drawcard on click.
		playButton = game.add.button(700, game.world.height - 75, 'draw-button', this.playRound, this);
		playButton.anchor.set(0.3, 0.3);
		playButton.scale.set(0.5, 0.5);
// button to show player hand, 
		showHandButton = game.add.button(200, game.world.height - 75, 'showhand-button', this.showHand, this);
		showHandButton.anchor.set(0.3, 0.3);
		showHandButton.scale.set(0.5, 0.5);
// button to hide player hand
		hideHandButton = game.add.button(450, game.world.height - 75, 'hidehand-button', this.hideHand, this);
		hideHandButton.anchor.set(0.3,0.3);
		hideHandButton.scale.set(0.5, 0.5);
// button to end turn
		endTurnButton = game.add.button(1200, game.world.height - 75, 'endturn-button', this.endTurn, this);
		endTurnButton.anchor.set(0.3, 0.3);
		endTurnButton.scale.set(0.5, 0.5);
// button to restart game
		restartButton = game.add.button(90, 40, 'restart-button', this.restartGame, this);
		restartButton.anchor.set(0.3, 0.3);
		restartButton.scale.set(0.5, 0.5);

// ava 
		var avaShrug = game.add.sprite(game.world.centerX - 500, game.world.centerY + 50,'ava_shrug');
		avaShrug.anchor.set(0.3, 0.3);
		avaShrug.scale.set(0.2, 0.2);
		var wink = avaShrug.animations.add('wink');
		avaShrug.animations.play('wink', 1, true);
	},
	create: function() {
// sets up game. stores the JSON containing the card deck in the variable 'deck'
		console.log('setting up game');
		this.deck = game.cache.getJSON('card_deck');
		console.log(this.deck);
		this.player1hand = [];
		this.player2hand = [];
		this.playerActions = 2;
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
	},
	playRound: function() {
		// button that calls drawCard, first checks which player turn an if there are actions left. 
		if(this.player1Turn && this.playerActions != 0){
			console.log('player1 draws: ');
			this.drawCard(this.player1hand);
			console.log(this.card.description);
			this.player1hand.splice(0, 0, this.card);
			this.playerActions = this.playerActions - 1;
			this.drawCard(this.player1hand);
			console.log('player 1 hand size :' + this.player1hand.length);
			console.log('actions left: ' + this.playerActions);
		} else if (this.player2Turn && this.playerActions != 0){
			console.log('player2 draws: ');
			this.drawCard(this.player2hand);
			console.log(this.card.description);
			this.player2hand.splice(0,0, this.card);
			this.playerActions = this.playerActions - 1;
			this.drawCard(this.player2hand);
			console.log('player 2 hand size: ' + this.player2hand.length);
			console.log('Actions left: ' + this.playerActions);
		} else {
			alert('No more moves left, please end your turn');
		}
	},
	drawCard: function() {
// math.random calls a float between 0 and 1, this is multiplied with the length of the deck, and rounded up to the nearest integer.
		var i = Math.floor(Math.random()* this.deck.length);
		this.card = this.deck[i];		
	},
	showHand: function() {
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
	},
	hideHand: function() {

	},
	endTurn: function() {
// ends the player turn, first checks if there are actions left, switches between player turns and resets the playerActions to 2 actions.
		if((this.player1Turn && this.playerActions != 0) || (this.player2Turn && this.playerActions !=0)) {
			alert('you still have moves left!1!!11!');
		} else if(this.player1Turn && this.playerActions == 0) {
			this.player1Turn = false;
			this.player2Turn = true;
			this.playerActions = 2;
			alert('player 1 turn ended \nplayer 2 turn starts');
		} else if(this.player2Turn && this.playerActions == 0){
			this.player2Turn = false;
			this.player1Turn = true;
			this.playerActions = 2;
			alert('player 2 turn ended \nplayer 1 turn starts');
		} else {
			console.log('something went wrong on endTurn');
		}
	},
	restartGame: function() {
		game.state.start('menu');
	},
	update: function() {
		millWieken.angle += 0.5;
	}
}