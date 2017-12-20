var playState = {
	preload: function() {
		background = game.add.tileSprite(0, 0, 1920, 1079, 'background');
 		millWieken = game.add.sprite(game.world.centerX + 500, game.world.centerY -290, 'wieken');
 		millWieken.anchor.set(0.5, 0.5);
// adds UI buttons
// first adds the drawButton, which call drawcard on click.
		drawButton = game.add.button(700, game.world.height - 75, 'draw-button', this.drawCard, this);
		drawButton.anchor.set(0.3, 0.3);
		drawButton.scale.set(0.5, 0.5);
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
		
		//Combine all card decks into one big JSON
		var combinedDeck = [];
		for(let i = 0; i < deckAmount; i++){
			let deck1 = game.cache.getJSON('cards' + i);
			combinedDeck = combinedDeck.concat(deck1);
		}
		//fill deck and drawpile
		this.deck = [];
		this.drawPile = [];
		for(var i in combinedDeck){
			this.deck.push(combinedDeck[i]);
			this.drawPile.push(combinedDeck[i]);
		}

		this.discardPile = [];
		this.player1hand = [];
		this.player2hand = [];
		this.playerActions = maxPlayerActions;
		//Randomly decided who starts first.
		this.player1Turn = false;
		this.player2Turn = false;
		var playerStart = this.game.rnd.integerInRange(1, 2);
		if(playerStart == 1){
			this.player1Turn = true;
			alert('Player 1 starts!');
		}else{
			this.player2Turn = true;
			alert('Player 2 starts!');
		}
		
		console.clear();
		if(this.player1Turn){
			console.log('Player 1');
		}else{
			console.log('Player 2');
		}
	},
	drawCard: function() {
		if(this.playerActions == 0){
			alert('No more moves left, please end your turn');
			return;
		}
		if(this.drawPile.length == 0){
			alert('No more cards in the Draw Pile.');
			return;
		}
		if(this.player1Turn && this.player1hand.length >= maxHandSize){
			alert('Your hand is full!');
			return;
		}
		if(this.player2Turn && this.player2hand.length >= maxHandSize){
			alert('Your hand is full!');
			return;
		}

		this.playerActions -= 1;

		var card = this.game.rnd.integerInRange(0, this.drawPile.length - 1);
		var card_ = this.drawPile[card];
		this.drawPile.splice(card, 1);
		console.log('card: ' + card + ' = ' + this.deck.indexOf(card_) + '\ndrawPile - deck');
		card = this.deck.indexOf(card_);
		
		if(this.player1Turn){
			this.player1hand.push(card);
			console.log('player hand size: ' + this.player1hand.length);
		}
		else if(this.player2Turn){
			this.player2hand.push(card);
			console.log('player hand size: ' + this.player2hand.length);
		}
	},
	showHand: function() {
		this.hideHand();
		// adds cards to the screen, depending on the length of the player hand.
		this.shownCards = [];
		if (this.player1Turn) {
			for (let i = 0; i < this.player1hand.length; i++) {
				let countryIndex = this.getCountryIndex(this.player1hand[i]);
				let spriteIndex = this.getSpriteIndex(this.player1hand[i]);
				this.shownCards[i] = game.add.sprite(
					181 / 2 + i * 181, 800, 
					'cards' + countryIndex, spriteIndex);
				this.shownCards[i].anchor.set(.5, .5);
				this.shownCards[i].scale.set(1, 1);
			}
		} else if (this.player2Turn) {
			for (var i = 0; i < this.player2hand.length; i++) {
				let countryIndex = this.getCountryIndex(this.player2hand[i]);
				let spriteIndex = this.getSpriteIndex(this.player2hand[i]);
				this.shownCards[i] = game.add.sprite(
					181 / 2 + i * 181, 800, 
					'cards' + countryIndex, spriteIndex);
				this.shownCards[i].anchor.set(.5, .5);
			}
		} else {
			console.log('something went wrong on showHand');
		}
	},
	hideHand: function() {
		for(var i in this.shownCards){
			this.shownCards[i].destroy();
		}
	},
	endTurn: function() {
// ends the player turn, first checks if there are actions left, switches between player turns and resets the playerActions to 2 actions.
		if((this.player1Turn && (this.playerActions != 0 && this.player1hand.length < maxHandSize)) 
		|| (this.player2Turn && (this.playerActions != 0 && this.player2hand.length < maxHandSize))	) {
			alert('you still have moves left!1!!11!');
		} else if (this.player1Turn) {
			this.player1Turn = false;
			this.player2Turn = true;
			this.playerActions = 2;
			alert('player 1 turn ended \nplayer 2 turn starts');
		} else if (this.player2Turn){
			this.player2Turn = false;
			this.player1Turn = true;
			this.playerActions = 2;
			alert('player 2 turn ended \nplayer 1 turn starts');
		} else {
			console.log('something went wrong on endTurn');
		}
		console.clear();
		if(this.player2Turn){
			console.log('Player 1');
		}else{
			console.log('Player 2');
		}
		this.hideHand();
	},
	restartGame: function() {
		game.state.start('menu');
	},
	update: function() {
		millWieken.angle += 0.5;
	},

	//Game Functions
	addCard: function(player) {
		if(player){

		}
		else{

		}
	},

	//Helper functions
	getCountryIndex: function(number) {
		var x = number;
		var count = -1;
		while(x >= 0){
			count += 1;
			x -= deckLength;
		}
		return Number(count);
	},
	getSpriteIndex: function(number){
		var x = number;
		while(x >= deckLength){
			x -= deckLength;
		}
		return Number(x);
	}
}