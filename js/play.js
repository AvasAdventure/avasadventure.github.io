var playState = {
	preload: function() {
		//1193, 417
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
		restartButton = game.add.button(game.world.centerX, 40, 'restart-button', this.restartGame, this);
		restartButton.anchor.set(0.3, 0.3);
		restartButton.scale.set(0.5, 0.5);
		// area to play the point cards
		pointsArea = game.add.sprite(game.world.centerX/2, game.world.centerY - 100, 'points-area');
		pointsArea.anchor.set(0.5, 0.5);
		pointsArea.scale.set(0.8, 0.8); 

		pointsText = game.add.text(50, 220, 'Your Score: ', { fill: '#cccccc'});
		// ava 
		var avaShrug = game.add.sprite(1500, 200,'ava_shrug');
		avaShrug.anchor.set(0.3, 0.3);
		avaShrug.scale.set(0.5, 0.5);
		var wink = avaShrug.animations.add('wink');
		avaShrug.animations.play('wink', 1, true);		
	},
	create: function() {
		//sets up game. stores the JSON containing the card deck in the variable 'deck'
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
		this.player1score = 0;
		this.player1pointCards = [];
		this.player2hand = [];
		this.player2score = 0;
		this.player2pointCards = [];
		this.playerActions = maxPlayerActions;
		//Randomly decided who starts first.
		this.player1Turn = false;
		///this.player2Turn = false;
		//FOR DEBUG ALWAYS P1
		var playerStart = 1;//this.game.rnd.integerInRange(1, 2);
		if(playerStart == 1){
			this.player1Turn = true;
			alert('Player 1 starts!');
		}else{
			//this.player2Turn = true;
			alert('Player 2 starts!');
		}
		
//		console.clear();
		if(this.player1Turn){
			console.log('Player 1');
		}else{
			console.log('Player 2');
		}

		//add 4 starting cards
		for(var i = 0; i < 4; i++){
			this.addCardRandom(true);
		}
		for(var i = 0; i < 4; i++){
			this.addCardRandom(false);
		}
		
		this.showHand();
	},
	update: function() {

				//get mouse location
		/*if(game.input.activePointer.leftButton.isDown){
			console.log(game.input.activePointer.worldX + ', ' + game.input.activePointer.worldY);
		}*/
	},
	//Game Control
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
		if(!this.player1Turn && this.player2hand.length >= maxHandSize){
			alert('Your hand is full!');
			return;
		}

		this.playerActions -= 1;

		this.addCardRandom(this.player1Turn);
		this.showHand();
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
					cardWidth / 2 + i * cardWidth, 800, 
					'cards' + countryIndex, spriteIndex);
				this.shownCards[i].anchor.set(.5, .5);
				this.shownCards[i].inputEnabled = true;
				//Playing cards
				this.shownCards[i].events.onInputDown.add(function (target, pointer) {
					if(pointer.leftButton.isDown){
						this.playCardAction(this.player1hand[this.shownCards.indexOf(target)]);
						this.player1hand.splice(this.shownCards[i], 1);
						this.add.tween(this.shownCards[i]).to({y: 1980, x: 0}, 100, null, true, 10) 
					}
					else if(pointer.middleButton.isDown){
						this.playCardPoints(this.player1hand[this.shownCards.indexOf(target)]);
						this.player1hand.splice(this.shownCards[i], 1);
						this.add.tween(this.shownCards[i]).to({y: game.world.centerY -100, x: game.world.centerX - i * cardWidth }, 300, null, true, 10);
					}
				}, this);
				this.shownCards[i].events.onInputOver.add(function (target) {
					target.scale.set(1.2, 1.2);
					//console.log('i');
					//this.hoverspr = game.add.sprite(cardWidth / 2 + i * cardWidth/2, 800, 'cards' + countryIndex, spriteIndex);
					//console.log(hoverspr);
					//hoverspr.scale.set(1.2, 1.2);
				}, this);
				this.shownCards[i].events.onInputOut.add(function (target) {
					target.scale.set(1, 1);
					//this.hoverspr.destroy();
					//this.showHand();
				}, this);
			}
		} else {
			for (var i = 0; i < this.player2hand.length; i++) {
				let countryIndex = this.getCountryIndex(this.player2hand[i]);
				let spriteIndex = this.getSpriteIndex(this.player2hand[i]);
				this.shownCards[i] = game.add.sprite(
					cardWidth / 2 + i * cardWidth, 800, 
					'cards' + countryIndex, spriteIndex);
				this.shownCards[i].anchor.set(.5, .5);
				this.shownCards[i].inputEnabled = true;
				//Playing cards
				this.shownCards[i].events.onInputDown.add(function (target, pointer) {
					if(pointer.leftButton.isDown){
						this.playCardAction(this.player2hand[this.shownCards.indexOf(target)]);
						this.player2hand.splice(this.shownCards[i], 0);
						this.add.tween(this.shownCards[i]).to({y: 1980, x: 0}, 100, null, true, 10) 
					}
					else if(pointer.middleButton.isDown){
						this.playCardPoints(this.player2hand[this.shownCards.indexOf(target)]);
						console.log(this.shownCards[i]);
						this.player2hand.splice(this.shownCards[i], 0);
						this.add.tween(this.shownCards[i]).to({y: game.world.centerY, x: game.world.centerX}, 300, null, true, 10);	
					}
				}, this);
				this.shownCards[i].events.onInputOver.add(function (target) {
					target.scale.set(1.2, 1.2);
					//console.log('i');
					//this.hoverspr = game.add.sprite(cardWidth / 2 + i * cardWidth/2, 800, 'cards' + countryIndex, spriteIndex);
					//console.log(hoverspr);
					//hoverspr.scale.set(1.2, 1.2);
				}, this);
				this.shownCards[i].events.onInputOut.add(function (target) {
					target.scale.set(1, 1);
					//this.hoverspr.destroy();
					//this.showHand();
				}, this);
			}
		}
	},
	hideHand: function() {
		for(var i in this.shownCards){
			this.shownCards[i].destroy();
		}
	},
	endTurn: function() {
		// ends the player turn, 
		// first checks if there are actions left, 
		// switches between player turns and resets the playerActions to 2 actions.

		if((this.player1Turn && (this.playerActions != 0 && this.player1hand.length < maxHandSize)) 
		|| (!this.player1Turn && (this.playerActions != 0 && this.player2hand.length < maxHandSize))	) {
			alert('you still have moves left!1!!11!');
		} else if (this.player1Turn) {
			this.player1Turn = false;
			this.playerActions = 2;
			alert('player 1 turn ended \nplayer 2 turn starts');
		} else {
			this.player1Turn = true;
			this.playerActions = 2;
			alert('player 2 turn ended \nplayer 1 turn starts');
		}

//		console.clear();
		if(this.player1Turn){
			console.log('Player 1');
		}else{
			console.log('Player 2');
		}
		this.showHand();
	},
	restartGame: function() {
		game.state.start('menu');
	},

	//Playing cards
	// card is card number from current players hand
	playCardPoints: function(card, player){
		var scoreText;
		var cardData = this.deck[card];
		if(this.player1Turn){
 			this.player1score = this.player1score + Number(cardData.points);
 			this.player1pointCards.push(cardData.points);
		} else {
 			this.player2score = this.player2score + Number(cardData.points);
			this.player2pointCards.push(cardData.points);
		}
	},
//	totalScore: function(player) {
//		if(player) {
//			console.log(this.player1score);
//			pointsText = game.add.text(200, 220, this.player1score, { fill: '#cccccc'});			
// 		} else {
//			console.log(this.player2score);
//			pointsText = game.add.text(200, 220, this.player2score, { fill: '#cccccc'});
//		}
//},
	playCardAction: function(card){
		///It would be cool to use like 'eval(githubrepo/cardAction.js)' in the end. #Moddability :P

		var cardData = this.deck[card];
		console.log('Played a ' + cardData.description + ' action card!');
		
		switch(cardData.action) {
			case 0:
				//Homecoming
				cardActions.homecoming(cardData);
				break;
			case 1:
				//Destroy one point card
				cardActions.destroyPointCard(cardData);
				break;
			case 2:
				//Protect one point card
				cardActions.protectPointCard(cardData);
				break;
			case 3:
				//Opponent skips a turn
				cardActions.skipTurn(cardData);
				break;
			case 4:
				//Steal a hand card
				cardActions.stealHandCard(cardData);
				break;
			case 5:
				//Draw two cards
				cardActions.drawTwoCards(cardData);
				break;
			case 6:
				//
				break;
			case 7:
				//
				break;
			default:
				//blank
		}
	},

	//Game Functions
	// player = true -> p1
	// player = false -> p2
	addCardRandom: function(player) {
		var card = this.game.rnd.integerInRange(0, this.drawPile.length - 1);
		var card_ = this.drawPile[card];
		this.drawPile.splice(card, 1);
		//console.log('card: ' + card + ' = ' + this.deck.indexOf(card_) + '\ndrawPile - deck');
		card = this.deck.indexOf(card_);

		if(player){
			this.player1hand.push(card);
			//console.log('player hand size: ' + this.player1hand.length);
		}
		else{
			this.player2hand.push(card);
			//console.log('player hand size: ' + this.player2hand.length);
		}
	},
	// card is the card number from drawPile
	addCard: function(player, card) {
		var card_ = this.drawPile[card];
		this.drawPile.splice(card, 1);
		//console.log('card: ' + card + ' = ' + this.deck.indexOf(card_) + '\ndrawPile - deck');
		card = this.deck.indexOf(card_);

		if(player){
			this.player1hand.push(card);
			//console.log('player hand size: ' + this.player1hand.length);
		}
		else{
			this.player2hand.push(card);
			//console.log('player hand size: ' + this.player2hand.length);
		}
	},

	// player = true -> p1
	// player = false -> p2
	removeCardRandom: function(player){
		if(player){
			var card = this.game.rnd.integerInRange(0, this.player1hand.length - 1);
			var card_ = this.player1hand[card];
			this.player1hand.splice(card, 1);
			this.discardPile.push(card_);
		}
		else{
			var card = this.game.rnd.integerInRange(0, this.player2hand.length - 1);
			var card_ = this.player2hand[card];
			this.player2hand.splice(card, 1);
			this.discardPile.push(card_);
		}
	},
	// card is the card number from hand
	removeCard: function(player, card){
		if(player){
			var card_ = this.player1hand[card];
			this.player1hand.splice(card, 1);
			this.discardPile.push(card_);
		}
		else{
			var card_ = this.player2hand[card];
			this.player2hand.splice(card, 1);
			this.discardPile.push(card_);
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