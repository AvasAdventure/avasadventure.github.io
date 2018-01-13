var playState = {
	preload: function() {
        var background = game.add.tileSprite(0, 0, 1920, 1079, 'game-board');

        //for fading
        this.fadeSprite = game.add.sprite(0, 0, 'black');
        this.fadeSprite.alpha = 0;
        this.fadeSprite.width = 1920;
        this.fadeSprite.height = 1079;

        //Load cards
        var jsons = [];
		for(let i = 0; i < deckAmount; i++){
            let deck = game.cache.getJSON('cards' + i);
			jsons = jsons.concat(deck);
        }
        this.deck = jsons;
        
        //end turn button
        var endTurnButton = game.add.button(0, 0, 'endturn-button', function(){
            if(playState.blockInput){return;}
            playState.endTurn();
        });
        endTurnButton.scale.set(.5,.5);

        //Draw pile
        var drawPileButton = game.add.button(1760, 540, 'card-back', function(){
            if(playState.blockInput){
                return;
            }
            playState.drawCard();
        });
        drawPileButton.width = cardWidth;
        drawPileButton.height = cardHeight;
        drawPileButton.anchor.set(0.5, 0.5);

        var dpile = [];
		for(let i = 0; i < this.deck.length; i++){
			dpile[i] = i;
		}
        this.drawPile = cardFunctions.shuffle(dpile);
        this.discardPile = [];
        this.discardPileSpr;
        this.p1pointCards = [];
        this.p2pointCards = [];
        this.playedPointSprites = [];
        this.shownHandCards = [];
        this.blockInput = false;
        
        //Replay sequence?!
        this.replaySequence = []; //0=draw, 1=action, 2=point
        this.replayCards = [];
        this.rsAction = [];
        this.rsPoints = 0;
        //Setup players
        ///playerTurn = true -> p1 else p2
        /*if(game.rnd.integerInRange(1, 2) == 1){
            this.playerTurn = true;
        }
        else{
            this.playerTurn = false;
        }*/
        this.playerTurn = true;
        this.p1hand = [];
        this.p2hand = [];
        
        this.dealCard(true, 4);
        this.dealCard(false, 4);
    },
    create: function() {
        
    },
    update: function() {

    },
    render: function() {
        game.debug.text('block input: ' + playState.blockInput, 32, 32);
        //game.debug.text("Time until event: " + game.time.events.duration, 32, 32);
    
    },

    dealCard: function(player, amount) {
        console.log(player + '-' + playState.playerTurn);
        for(let i = 0; i < amount; i++){
            if(player == playState.playerTurn){ //should i render it?
                console.log('render');
                game.time.events.add(500 * i, function() { //wait a bit before dealing next card
                    let card = playState.drawPile[0];
                    playState.drawPile.splice(0, 1);     
                    let handSize;
                    if(playState.playerTurn){
                        playState.p1hand.push(card);
                        handSize = playState.p1hand.indexOf(card);
                    }else{
                        playState.p2hand.push(card);
                        handSize = playState.p2hand.indexOf(card);
                    }
                    let cardSpr = cardFunctions.showCardSprite(card, 1760, 540, cardWidth, cardHeight);
                    playState.shownHandCards.push(cardSpr);
                    let newX = (385 + (cardWidth/2) * handSize);
                    let newY = 900;
                    game.add.tween(cardSpr).to({x: newX, y: newY}, 500, null, true, 0) //to hand
                    .onUpdateCallback(function(){
                        playState.blockInput = true;
                    }, this)
                    .onComplete.add(function(){
                        playState.blockInput = false;
                    }, this);
                    
                    cardFunctions.addInteractions(cardSpr);
                });
            }else{
                let card = playState.drawPile[0];
                playState.drawPile.splice(0, 1);
                if(player){
                    this.p1hand.push(card);
                }else{
                    this.p2hand.push(card);
                }
            }
        }
    },
    drawCard: function(){
        //todo check action count

        //Save replay
        playState.replaySequence.push(0); //0=draw, 1=action, 2=point

        this.dealCard(this.playerTurn, 1);
    },
    renderCards(){
        //Render hand
        let cards = [];
        let pointCards = [];
        let otherPointCards = 0;
        if(playState.playerTurn){
            cards = playState.p1hand;
            pointCards = playState.p1pointCards;
            otherPointCards = playState.p2pointCards.length;
        }else{
            cards = playState.p2hand;
            pointCards = playState.p2pointCards;
            otherPointCards = playState.p1pointCards.length;
        }
        otherPointCards -= playState.rsPoints;

        for(let i = 0; i < cards.length; i++){
            let cardSpr = cardFunctions.showCardSprite(cards[i], (385 + (cardWidth/2) * playState.shownHandCards.length), 900, cardWidth, cardHeight);
            playState.shownHandCards.push(cardSpr);
            cardSpr.moveDown(); //move under the fader
            cardFunctions.addInteractions(cardSpr);
        }
        for(let i = 0; i < pointCards.length; i++){
            let cardSpr = game.add.sprite(460 + (cardWidth/2) * (playState.playedPointSprites.length), game.world.centerY, 'card-back');
            cardSpr.anchor.set(0.5, 0.5);
            cardSpr.width = cardWidth;
            cardSpr.height = cardHeight;
            playState.playedPointSprites.push(cardSpr);
            cardSpr.moveDown(); //move under the fader
        }
        for(let i = 0; i < otherPointCards; i++){
            let cardSpr = game.add.sprite(535 + ((cardWidthSmall/2) * i), 186, 'card-back');
            cardSpr.anchor.set(0.5, 0.5);
            cardSpr.width = cardWidthSmall;
            cardSpr.height = cardHeightSmall;
            playState.playedPointSprites.push(cardSpr);
            cardSpr.moveDown(); //move under the fader
        }
    },
    updateHandCards(){
        for(let i = 0; i < playState.shownHandCards.length; i++){
            let card = playState.shownHandCards[i];
            let newX = (385 + (cardWidth/2) * i);
            let newY = 900;
            game.add.tween(card).to({x: newX, y: newY, width: cardWidth, height: cardHeight}, 500, null, true, 0)
            .onUpdateCallback(function(){
                playState.blockInput = true;
            }, this)
            .onComplete.add(function(){
                playState.blockInput = false;
            }, this);
        }
    },
    playPoints: function(card){
        //Check Actions
        //card = nr
    },
    playAction: function(card){
        //Check Actions
        //card = nr
        let cardData = playState.deck[card];
        console.log(cardData.description);
        switch(Number(cardData.action)) {
			case 0:
				//Homecoming
				cardActions.homecoming(cardData, 1);
				break;
			case 1:
				//Destroy one point card
				cardActions.destroyPointCard(cardData, 1);
				break;
			case 2:
				//Protect one point card
				cardActions.protectPointCard(cardData, 1);
				break;
			case 3:
				//Opponent skips a turn
				cardActions.skipTurn(cardData, 1);
				break;
			case 4:
				//Steal a hand card
				cardActions.stealHandCard(cardData, 1);
				break;
			case 5:
                //Draw two cards
                this.dealCard(this.playerTurn, 2);
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
        }
    },
    endTurn: function(){
        if(playState.blockInput){return;}
        playState.blockInput = true;
        let alphaTween = playState.fadeScreen(true);
        alphaTween.onComplete.add(function(){
            
            playState.playerTurn = !playState.playerTurn;

            //Remove all cards from the screen.
            for(let i = 0; i < playState.shownHandCards.length; i++){
                playState.shownHandCards[i].destroy();
            }
            playState.shownHandCards = [];
            for(let i = 0; i < playState.playedPointSprites.length; i++){
                playState.playedPointSprites[i].destroy();
            }
            playState.playedPointSprites = [];
            for(let i = 0; i < playState.replayCards.length; i++){
                playState.replayCards[i].destroy();
            }
            playState.replayCards = [];

            playState.renderCards();

            //Add text
            let playerText;
            if(!playState.playerTurn){
                playerText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Player 2', {fill: '#ffffff', fontSize: 100});
            }else{
                playerText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Player 1', {fill: '#ffffff', fontSize: 72});
            }
            playerText.anchor.set(0.5, 0.5);
            playerText.bringToTop();
            
            //NextButton
            let button = game.add.button(game.world.centerX, game.world.centerY,'next-button', function(){
                button.destroy();
                playerText.destroy();
                alphaTween = playState.fadeScreen(false);
                alphaTween.onComplete.add(function() {
                    playState.playReplay();
                    
                }, this);
            });
            button.anchor.set(0.5, 0.5);
        }, this);
    },
    fadeScreen: function(dir){
        playState.fadeSprite.bringToTop();
        if(dir){
            return game.add.tween(playState.fadeSprite).to({alpha: 1}, 500, null, true, 0);
        }else{
            return game.add.tween(playState.fadeSprite).to({alpha: 0}, 500, null, true, 0);
        }
    },
    playReplay: function(){
        let otherPointCardCount;
        if(playState.playerTurn){
            otherPointCardCount = playState.p2pointCards.length;
        }else{
            otherPointCardCount = playState.p1pointCards.length;
        }
        console.log(otherPointCardCount + '-' + playState.rsPoints);
        otherPointCardCount -= playState.rsPoints;
        let pointAmount = otherPointCardCount;
        let actionAmount = 0;
        let seq = playState.replaySequence;
        let rsAction = playState.rsAction;
        playState.rsPoints = 0;
        playState.rsAction = [];
        playState.replaySequence = [];

        for(let i = 0; i < seq.length; i++){
            game.time.events.add(800 * i, function() {
                switch(seq[i]){
                    case 0: //draw
                        var spr = game.add.sprite(1760, 540, 'card-back');
                        spr.width = cardWidth;
                        spr.height = cardHeight;
                        spr.anchor.set(0.5, 0.5);
                        playState.replayCards.push(spr);
                        var newX = game.world.centerX;
                        var newY = 0 - cardHeight;
                        var tween = game.add.tween(spr).to({x: newX, y: newY, width: cardWidthSmall, height: cardHeightSmall}, 500, null, true, 0)
                        .onUpdateCallback(function(){
                            playState.blockInput = true;
                        }, this)
                        .onComplete.add(function(){
                            playState.blockInput = false;
                        }, this);
                        break;
                    case 1: //action
                        var cardSpr = game.add.sprite(game.world.centerX, 0 - cardHeight, rsAction[actionAmount]);
                        cardSpr.width = cardWidthSmall;
                        cardSpr.height = cardHeightSmall;
                        cardSpr.anchor.set(0.5, 0.5);
                        playState.replayCards.push(cardSpr);
                        var actionX = game.world.centerX;
                        var actionY = game.world.centerY;
                        game.add.tween(cardSpr).to({x: actionX, y: actionY, width: cardWidth, height: cardHeight}, 500, null, true, 0) //to middle
                        .onUpdateCallback(function(){
                            playState.blockInput = true;
                        }, this)
                        .onComplete.add(function(){
                            game.time.events.add(500, function() { //dramatic 'play' effect
                                let backcard = cardFunctions.flipCard(cardSpr);
                                let backX = 160;
                                game.add.tween(backcard).to({x: backX, width: cardWidth, height: cardHeight}, 500, null, true, 0)  //to discard pile
                                .onUpdateCallback(function(){
                                    playState.blockInput = true;
                                }, this)
                                .onComplete.add(function(){
                                    if(playState.discardPileSpr == undefined){
                                        playState.discardPileSpr = game.add.sprite(160, game.world.centerY, 'card-back');
                                        playState.discardPileSpr.anchor.set(0.5, 0.5);
                                        playState.discardPileSpr.width = cardWidth;
                                        playState.discardPileSpr.height = cardHeight;
                                    }
                                    backcard.destroy();
                                    playState.blockInput = false;
                                }, this);
                            });
                        }, this);
                        
                        game.add.tween(cardSpr).to({width: cardWidthBig, height: cardHeightBig}, 500, null, true, 0); //scaling
                        actionAmount += 1;
                        break;
                    case 2: //point
                        var spr = game.add.sprite(game.world.centerX, 0 - cardHeight, 'card-back');
                        spr.width = cardWidth;
                        spr.height = cardHeight;
                        spr.anchor.set(0.5, 0.5);
                        playState.replayCards.push(spr);
                        var newXx = 535 + ((cardWidthSmall/2) * pointAmount);
                        var newYy = 186;
                        var tween = game.add.tween(spr).to({x: newXx, y: newYy, width: cardWidthSmall, height: cardHeightSmall}, 500, null, true, 0)
                        .onUpdateCallback(function(){
                            playState.blockInput = true;
                        }, this)
                        .onComplete.add(function(){
                            playState.blockInput = false;
                        }, this);
                        pointAmount += 1;
                        break;
                } 
            });
        }
    }
}

var cardFunctions = {
    shuffle: function(cards) {
        var currentIndex = cards.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = cards[currentIndex];
			cards[currentIndex] = cards[randomIndex];
			cards[randomIndex] = temporaryValue;
		}
		return cards;
    },
    showCardSprite: function(card, x, y){
        let countryIndex = this.getCountryIndex(card);
        let spriteIndex = this.getSpriteIndex(card);
        let spr = game.add.sprite(x, y, 'cards' + countryIndex, spriteIndex);
        spr.anchor.set(0.5, 0.5);
        return spr;
    },
    showCardSprite: function(card, x, y, width, height){
        let countryIndex = this.getCountryIndex(card);
        let spriteIndex = this.getSpriteIndex(card);
        let spr = game.add.sprite(x, y, 'cards' + countryIndex, spriteIndex);
        spr.anchor.set(0.5, 0.5);
        spr.width = width;
        spr.height = height;
        return spr;
    },
    highlightHandCard: function(card){
        for(let i = 0; i < playState.shownHandCards.length; i++){
            if(playState.shownHandCards[i] !== undefined){
                if(playState.shownHandCards[i] !== card){
                    playState.shownHandCards[i].tint = 0xaaaaaa;
                }
            }
        }
    },
    untintHand:function(){
        for(let i = 0; i < playState.shownHandCards.length; i++){       
            if(playState.shownHandCards[i] !== undefined){
                playState.shownHandCards[i].tint = 0xffffff;
                game.world.bringToTop(playState.shownHandCards[i]);
            }
        }
    },
    addInteractions: function(cardSpr){
        //CARD INPUTS
        cardSpr.inputEnabled = true;
        cardSpr.events.onInputDown.add(function (target, pointer) {
            if(playState.blockInput){
                return;
            }
            //todo Check Action count
            if(pointer.leftButton.isDown){
                let card;
                if(playState.playerTurn){
                    card = playState.p1hand[playState.shownHandCards.indexOf(target)];
                    playState.p1hand.splice(playState.p1hand.indexOf(card), 1);
                }else{
                    card = playState.p2hand[playState.shownHandCards.indexOf(target)];
                    playState.p2hand.splice(playState.p2hand.indexOf(card), 1);
                }
                
                playState.playAction(card);
                
                //Save replay
                playState.replaySequence.push(1); //0=draw, 1=action, 2=point
                playState.rsAction.push(cardSpr.key);

                playState.shownHandCards.splice(playState.shownHandCards.indexOf(target), 1);
                let actionX = game.world.centerX;
                let actionY = game.world.centerY;
                game.add.tween(cardSpr).to({x: actionX, y: actionY}, 500, null, true, 0) //to middle
                .onUpdateCallback(function(){
                    playState.blockInput = true;
                }, this)
                .onComplete.add(function(){
                    game.time.events.add(500, function() { //dramatic 'play' effect
                        let backcard = cardFunctions.flipCard(cardSpr);
                        let backX = 160;
                        game.add.tween(backcard).to({x: backX, width: cardWidth, height: cardHeight}, 500, null, true, 0)  //to discard pile
                        .onUpdateCallback(function(){
                            playState.blockInput = true;
                        }, this)
                        .onComplete.add(function(){
                            if(playState.discardPileSpr == undefined){
                                playState.discardPileSpr = game.add.sprite(160, game.world.centerY, 'card-back');
                                playState.discardPileSpr.anchor.set(0.5, 0.5);
                                playState.discardPileSpr.width = cardWidth;
                                playState.discardPileSpr.height = cardHeight;
                            }
                            backcard.destroy();
                            playState.blockInput = false;
                        }, this);
                    });
                }, this);
                
                game.add.tween(cardSpr).to({width: cardWidthBig, height: cardHeightBig}, 500, null, true, 0); //scaling
                playState.updateHandCards();
                cardFunctions.untintHand();
            }
            else if(pointer.rightButton.isDown){
                let card;
                if(playState.playerTurn){
                    card = playState.p1hand[playState.shownHandCards.indexOf(target)];
                    playState.p1hand.splice(playState.p1hand.indexOf(card), 1);
                    playState.p1pointCards.push(card);
                }else{
                    card = playState.p2hand[playState.shownHandCards.indexOf(target)];
                    playState.p2hand.splice(playState.p2hand.indexOf(card), 1);
                    playState.p2pointCards.push(card);
                }

                playState.playPoints(card);
                
                //Save replay
                playState.replaySequence.push(2); //0=draw, 1=action, 2=point
                playState.rsPoints += 1;

                playState.shownHandCards.splice(playState.shownHandCards.indexOf(target), 1);
                let pointsX = game.world.centerX;
                let pointsY = game.world.centerY;
                game.add.tween(cardSpr).to({x: pointsX, y: pointsY}, 500, null, true, 0) //to middle
                .onUpdateCallback(function(){
                    //Keep resetting the animationActive bool
                    playState.blockInput = true;
                }, this)
                .onComplete.add(function(){
                    game.time.events.add(500, function() { //dramatic 'play' effect
                        let backcard = cardFunctions.flipCard(cardSpr);
                        let backX;
                        if(playState.playerTurn){
                            backX = 460 + (cardWidth/2) * (playState.p1pointCards.length-1);
                        }else{
                            backX = 460 + (cardWidth/2) * (playState.p2pointCards.length-1);
                        }

                        game.add.tween(backcard).to({x: backX, width: cardWidth, height: cardHeight}, 500, null, true, 0) //to pointarea
                        .onUpdateCallback(function(){
                            playState.blockInput = true;
                        }, this)
                        .onComplete.add(function(){
                            playState.blockInput = false;
                        }, this);
                        playState.playedPointSprites.push(backcard);
                        playState.blockInput = false;
                    });
                }, this);
                game.add.tween(cardSpr).to({width: cardWidthBig, height: cardHeightBig}, 500, null, true, 0);
                playState.updateHandCards();
                cardFunctions.untintHand();
            }
        });
        cardSpr.events.onInputOver.add(function (target) {
            if(playState.blockInput){
                return;
            }
            game.world.bringToTop(target);
            game.add.tween(target).to({width: cardWidthBig, height: cardHeightBig}, 100, null, true, 0);
            cardFunctions.highlightHandCard(target);
        }, this);
        cardSpr.events.onInputOut.add(function (target) {
            cardFunctions.untintHand();
            target.width = cardWidth;
            target.height = cardHeight;
        }, this);
    },
    flipCard: function(card){
        let backcard = game.add.sprite(card.x, card.y, 'card-back');
        backcard.anchor.set(0.5, 0.5);
        backcard.width = card.width;
        backcard.height = card.height;
        card.destroy();
        return backcard;
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