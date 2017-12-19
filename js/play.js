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
		this.deck = combinedDeck;
		this.drawPile = combinedDeck;
		this.discardPile = [];
		//console.log(deckAmount);
		//console.log(this.deck);

		this.player1hand = [];
		this.player2hand = [];
		this.playerActions = 2;
		//Randomly decided who starts first.
		this.player1Turn = false;
		this.player2Turn = false;
		// integerInRange(1,2) picks a random integer between 1 and 2, so just 1 or 2 in this case.
		var playerStart = this.game.rnd.integerInRange(1, 2);
		if(playerStart == 1){
			this.player1Turn = true;
			alert('Player 1 starts!');
		}else{
			this.player2Turn = true;
			alert('Player 2 starts!');
		}
		
		//console.clear();
		if(this.player1Turn){
			console.log('Player 1');
		}else{
			console.log('Player 2');
		}
	},
	playRound: function() {
		// button that calls drawCard, first checks which player turn and if there are actions left. 
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
			//console.log(this.card.description);
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
		if(this.playerActions == 0){
			alert('No more moves left, please end your turn');
			return;
		}
		this.playerActions -= 1;
			
		console.log(this.drawPile);
		var card = this.game.rnd.integerInRange(0, this.deck.length);
		//try find one that wasnt drawn yet if needed.
		while(!this.drawPile.includes(this.deck[card])){
			card = this.game.rnd.integerInRange(0, this.deck.length);
		}
		//remove from the avaliable draw pile
		this.drawPile.splice(this.drawPile.indexOf(this.deck[card]), 1);
		//var card = this.deck[i];
		console.log('player draws: ' + this.deck[card].description + ', which is: ' + card);
		console.log('actions left: ' + this.playerActions);

		if(this.player1Turn){
			this.player1hand.push(card);
			console.log('player hand size: ' + this.player1hand.length);
		}
		else if(this.player2Turn){
			this.player2hand.push(card);
			console.log('player hand size :' + this.player2hand.length);
		}
	},
	showHand: function() {
		this.hideHand();
		//console.clear();
// adds cards to the screen, depending on the length of the player hand.
		this.shownCards = [];
		if (this.player1Turn) {
			for (let i = 0; i < this.player1hand.length; i++) {
				let countryIndex = this.getCountryIndex(this.player1hand[i]);
				let spriteIndex = this.getSpriteIndex(this.player1hand[i]);
				//console.log('country: ' + countryIndex + ', sprite: ' + spriteIndex);
				this.shownCards[i] = game.add.sprite(
					181 / 2 + i * 181, 800, 
					'cards' + countryIndex, spriteIndex);
				this.shownCards[i].anchor.set(.5, .5);
				this.shownCards[i].scale.set(1, 1);
			}
			console.log('showing player 1 hand');
		} else if (this.player2Turn) {
			for (var i = 0; i < this.player2hand.length; i++) {
				let countryIndex = this.getCountryIndex(this.player2hand[i]);
				let spriteIndex = this.getSpriteIndex(this.player2hand[i]);
				//console.log('country: ' + countryIndex + ', sprite: ' + spriteIndex);
				this.shownCards[i] = game.add.sprite(
					181 / 2 + i * 181, 800, 
					'cards' + countryIndex, spriteIndex);
				this.shownCards[i].anchor.set(.5, .5);
			}
			console.log('showing player 2 hand');
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
		//console.clear();
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
		console.log('input: ' + number);
		var x = number;
		var count = -1;
		while(x >= 0){
			//console.log('trigger: ' + x + ' ' + count);
			count += 1;
			x -= deckLength;
			//console.log('_' + x);
		}
		//console.log('country: ' + count);
		return Number(count);
	},
	getSpriteIndex: function(number){
		//should range from 0-deckLength
		var x = number;
		while(x >= deckLength){
			x -= deckLength;
		}
		return Number(x);
	}
}