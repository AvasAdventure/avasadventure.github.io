var playState = {
	preload: function() {
		var background = game.add.tileSprite(0, 0, 1920, 1079, 'game-board');
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
		/*pointsArea = game.add.sprite(game.world.centerX/2, game.world.centerY - 100, 'points-area');
		pointsArea.anchor.set(0.5, 0.5);
		pointsArea.scale.set(0.8, 0.8); 
		pointsText = game.add.text(50, 220, 'Your Score: ', { fill: '#cccccc'});*/
		// ava 
		/*
		var avaShrug = game.add.sprite(1500, 200,'ava_shrug');
		avaShrug.anchor.set(0.3, 0.3);
		avaShrug.scale.set(0.5, 0.5);
		var wink = avaShrug.animations.add('wink');
		avaShrug.animations.play('wink', 1, true);		*/
	},
	create: function() {
		//sets up game. stores the JSON containing the card deck in the variable 'deck'
		console.log('setting up game');
		//Combine all card decks into one big JSON
		this.deck = [];
		for(let i = 0; i < deckAmount; i++){
			let deck1 = game.cache.getJSON('cards' + i);
			this.deck = this.deck.concat(deck1);
		}
		var pile = [];
		for(let i = 0; i < this.deck.length; i++){
			pile[i] = i;
		}
		this.drawPile = this.shuffleDeck(pile);
		console.log(this.drawPile);

		this.discardPile = [];
		this.player1hand = [];
		this.player1score = 0;
		this.player1pointCards = [];
		this.player2hand = [];
		this.player2score = 0;
		this.player2pointCards = [];
		this.shownPointCards = [];
		this.playerActions = maxPlayerActions;
		//Randomly decided who starts first.
		//FOR DEBUG ALWAYS P1
		var playerStart = 1;//this.game.rnd.integerInRange(1, 2);
		if(playerStart == 1){
			this.player1Turn = true;
			alert('Player 1 starts!');
		}else{
			this.player1Turn = false;
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
			this.dealCard(true);
		}
		for(var i = 0; i < 4; i++){
			this.dealCard(false);
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

		this.dealCard(this.player1Turn);
		this.showHand();
	},
	showHand: function() {
		this.hideHand();
		// adds cards to the screen, depending on the length of the player hand.
		this.shownCards = [];
		let cardCount;
		if(this.player1Turn){
			cardCount = this.player1hand.length;
		}
		else{
			cardCount = this.player2hand.length;
		}

		for(let i = 0; i < cardCount; i++){
			let countryIndex;
			let spriteIndex;
			if(this.player1Turn){
				countryIndex = this.getCountryIndex(this.player1hand[i]);
				spriteIndex = this.getSpriteIndex(this.player1hand[i]);
			}else{
				countryIndex = this.getCountryIndex(this.player2hand[i]);
				spriteIndex = this.getSpriteIndex(this.player2hand[i]);
			}
			let spr =  game.add.sprite(
				cardSprWidth / 2 + i * cardSprWidth, 800, 
				'cards' + countryIndex, spriteIndex);
			spr.anchor.set(0.5, 0.5);
			spr.inputEnabled = true;
			this.shownCards[i] = spr;

			//Playing cards
			this.shownCards[i].events.onInputDown.add(function (target, pointer) {
				if(this.playerActions == 0){
					alert('No more moves left, please end your turn');
					return;
				}

				let i = this.shownCards.indexOf(target);
				if(pointer.leftButton.isDown){
					this.shownCards[i].scale.set(1, 1);
					let card; 
					if(this.player1Turn){
						card = this.player1hand[i];
					} else {
						card = this.player2hand[i];
					}
					this.playCardAction(card);
					this.shownCards[i].destroy();
				}
				else if(pointer.rightButton.isDown){
					let card;
					if(this.player1Turn){
						card = this.player1hand[i]
					}
					else{
						card = this.player2hand[i]
					}
					target.scale.set(1, 1);
					this.playCardPoints(card);
					this.shownPointCards.push(this.shownCards[i]);
					this.shownCards.splice(i, 1);

					let x; 
					let y = game.world.centerY - 100;
					if(this.player1Turn){
						x = this.player1pointCards.length * cardSprWidth;
					} else {
						x = this.player2pointCards.length * cardSprWidth;
					}

					this.add.tween(target).to({y: y, x: x}, 300, null, true, 10);	
					this.showHand();
				}
			}, this);
			this.shownCards[i].events.onInputOver.add(function (target) {
				target.scale.set(1.2, 1.2);
			}, this);
			this.shownCards[i].events.onInputOut.add(function (target) {
				target.scale.set(1, 1);
			}, this);
		}
	},
	hideHand: function() {
		for(var i in this.shownCards){
			this.shownCards[i].destroy();
		}
	},
	showPointCards: function(){
		for(var i in this.shownPointCards){
			this.shownPointCards[i].destroy();
		}
		if(this.player1Turn){
			//your cards
			for(let i = 0; i < this.player1pointCards.length; i++){
				//y: game.world.centerY -100, x: game.world.centerX - i * cardSprWidth
				let x = game.world.centerX - i * cardSprWidth;
				let y = game.world.centerY -100;
				let countryIndex = this.getCountryIndex(this.player1pointCards[i]);
				let spriteIndex = this.getSpriteIndex(this.player1pointCards[i]);
				let spr = game.add.sprite(x, y, 'cards' + countryIndex, spriteIndex);
				spr.anchor.set(0.5, 0.5);
				this.shownPointCards.push(spr);
			}
			//other player's cards (back side)
			for(let i = 0; i < this.player2pointCards.length; i++){
				this.shownPointCards.push(game.add.sprite(i * cardSprWidth, cardSprHeight, "card-back"));
			}
		}else{
			//your cards
			for(let i = 0; i < this.player2pointCards.length; i++){
				//y: game.world.centerY -100, x: game.world.centerX - i * cardSprWidth
				let x = game.world.centerX - i * cardSprWidth;
				let y = game.world.centerY -100;
				let countryIndex = this.getCountryIndex(this.player2pointCards[i]);
				let spriteIndex = this.getSpriteIndex(this.player2pointCards[i]);
				let spr = game.add.sprite(x, y, 'cards' + countryIndex, spriteIndex);
				spr.anchor.set(0.5, 0.5);
				this.shownPointCards.push(spr);
			}
			//other player's cards (back side)
			for(let i = 0; i < this.player1pointCards.length; i++){
				let spr = game.add.sprite(i * cardSprWidth, cardSprHeight/2, "card-back");
				spr.anchor.set(0.5, 0.5);
				this.shownPointCards.push(spr);
			}
		}
	},
	endTurn: function() {
		// ends the player turn, 
		// first checks if there are actions left, 
		// switches between player turns and resets the playerActions to 2 actions.

		if(( this.player1Turn && (this.playerActions != 0 && this.player1hand.length < maxHandSize)) 
		|| (!this.player1Turn && (this.playerActions != 0 && this.player2hand.length < maxHandSize)) ) {
			alert('you still have moves left!1!!11!');
			return;
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
		this.showPointCards();
	},
	restartGame: function() {
		game.state.start('menu');
	},

	//Playing cards
	// card is card number from current players hand
	playCardPoints: function(card){
		if(this.playerActions == 0){
			alert('No more moves left, please end your turn');
			return;
		}
		this.playerActions -= 1;

		if(this.player1Turn){
			var index = this.player1hand.indexOf(card);
			this.player1hand.splice(index, 1);
		} else {
			var index = this.player2hand.indexOf(card);
			this.player2hand.splice(index, 1);
		}
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
		if(this.playerActions == 0){
			alert('No more moves left, please end your turn');
			return;
		}
		this.playerActions -= 1;

		///It would be cool to use like 'eval(githubrepo/cardAction.js)' in the end. #Moddability :P
		if(this.player1Turn){
			var index = this.player1hand.indexOf(card);
			this.player1hand.splice(index, 1);
		} else {
			var index = this.player2hand.indexOf(card);
			this.player2hand.splice(index, 1);
		}
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
				break;

			this.showHand();
			this.showPointCards();
		}
	},

	//Game Functions
	// player = true -> p1
	// player = false -> p2
	dealCard: function(player) {
		var card = this.drawPile[0];
		this.drawPile.splice(0, 1);
		//console.log('card: ' + card + ' = ' + this.deck.indexOf(card_) + '\ndrawPile - deck');

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
	},
	shuffleDeck: function(array){
		var currentIndex = array.length, temporaryValue, randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}
}