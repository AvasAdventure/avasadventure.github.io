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
            playState.drawCard(playState.playerTurn);
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
        this.p1pointSprites = game.add.group();
        this.p2pointCards = [];
        this.p2pointSprites = game.add.group();
        this.blockInput = false;
        
        //Replay sequence?!
        this.replaySequence = []; //0=draw, 1=action, 2=point
        this.replayCards = [];
        this.rsAction = [];
        this.rsPoints = 0;
        //Setup players
        ///playerTurn = true -> p1 else p2
        if(game.rnd.integerInRange(1, 2) == 1){
            this.playerTurn = true;
        }
        else{
            this.playerTurn = false;
        }
        this.playerTurn = true;
        this.p1hand = [];
        this.p2hand = [];
        this.p1handSprites = game.add.group();
        this.p2handSprites = game.add.group();
        this.animatingSprites = game.add.group();
    },
    create: function() {
        playState.p1handSprites.visible = playState.playerTurn;
        playState.p1pointSprites.visible = playState.playerTurn;
        playState.p2handSprites.visible = !playState.playerTurn;
        playState.p2pointSprites.visible = !playState.playerTurn;

        this.drawCard(true, 4, false);
        this.drawCard(false, 4, false);

        this.p1handSprites.inputEnableChildren = true;
        this.p1handSprites.onChildInputDown.add(this.cardClick, this);
        this.p1handSprites.onChildInputOver.add(this.cardHoverOver, this);
        this.p1handSprites.onChildInputOut.add(this.cardHoverOut, this);
        this.p2handSprites.inputEnableChildren = true;        
        this.p2handSprites.onChildInputDown.add(this.cardClick, this);
        this.p2handSprites.onChildInputOver.add(this.cardHoverOver, this);
        this.p2handSprites.onChildInputOut.add(this.cardHoverOut, this);
    },
    update: function() {
        
    },
    render: function() {
        game.debug.text('input enabled: ' + playState.isInputEnabled(), 32, 32);
        //game.debug.text("Time until event: " + game.time.events.duration, 32, 32);
    },
    drawCard: function(player, amount = 1, saveReplay = true){
        for (let i = 0; i < amount; i++) {
            //Allowed?
            let handSize;
            if(player){
                handSize = playState.p1handSprites.length;
            }else{
                handSize = playState.p2handSprites.length;
            }
            if(handSize >= maxHandSize){
                console.log('not allowed');
                return;
            }

            //Get a card
            let card = playState.drawPile[0];
            playState.drawPile.splice(0, 1);
            
            //Animation if it's for the current player
            if(player == playState.playerTurn){
                game.time.events.add(500 * i, function() { //wait a bit before dealing next card
                    let handSize;
                    let cardSpr;
                    //get hand size and add to hand
                    if(playState.playerTurn){
                        handSize = playState.p1handSprites.length;
                        cardSpr = playState.p1handSprites.add(cardFunctions.showCardSprite(card, 1760, 540, cardWidth, cardHeight));
                    }else{
                        handSize = playState.p2handSprites.length;
                        cardSpr = playState.p2handSprites.add(cardFunctions.showCardSprite(card, 1760, 540, cardWidth, cardHeight));
                    }

                    //Move to the hand
                    let newX = (385 + (cardWidth/1.5) * handSize);
                    let newY = 900;
                    game.add.tween(cardSpr).to({x: newX, y: newY}, 500, null, true, 0)
                    .onUpdateCallback(function(){
                        playState.allowInput(false);
                    })
                    .onComplete.add(function(){
                        playState.allowInput(true);
                    });

                    //Save replay
                    if(saveReplay){
                        playState.replaySequence.push(0);
                    }
                });
            }else{
                //Add to hand
                let handSize;
                let cardSprite;
                if(player){
                    handSize = playState.p1handSprites.length;
                    cardSpr = playState.p1handSprites.add(cardFunctions.showCardSprite(card, 1760, 540, cardWidth, cardHeight));
                }else{
                    handSize = playState.p2handSprites.length;
                    cardSpr = playState.p2handSprites.add(cardFunctions.showCardSprite(card, 1760, 540, cardWidth, cardHeight));
                }

                //Move to the hand
                let newX = (385 + (cardWidth/1.5) * handSize);
                let newY = 900;
                cardSpr.x = newX;
                cardSpr.y = newY;
            }
        }
    },

    cardClick: function(sprite, pointer){
        if(pointer.leftButton.isDown){
            //Play as action card
            let card = sprite.cardNr;

            //Remove from hand
            sprite = playState.animatingSprites.add(sprite);
            
            //Move to center
            game.add.tween(sprite).to({x: game.world.centerX, y: game.world.centerY, width: cardWidthBig, height: cardHeightBig}, 500, null, true, 0)
            .onUpdateCallback(function(){
                playState.allowInput(false);
            });

            //Save replay
            playState.replaySequence.push(1);
            playState.rsAction.push(card);

            //Play action
            playState.playAction(sprite.cardNr);

            game.time.events.add(1000, function() { //wait a sec
                let backcard = cardFunctions.flipCard(sprite);
                let backX = 160;
                game.add.tween(backcard).to({x: backX, width: cardWidth, height: cardHeight}, 500, null, true, 0)
                .onUpdateCallback(function(){
                    playState.allowInput(false);
                }, this)
                .onComplete.add(function(){
                    if(playState.discardPileSpr == undefined){
                        playState.discardPileSpr = game.add.sprite(160, game.world.centerY, 'card-back');
                        playState.discardPileSpr.anchor.set(0.5, 0.5);
                        playState.discardPileSpr.width = cardWidth;
                        playState.discardPileSpr.height = cardHeight;
                    }
                    backcard.destroy();
                    playState.allowInput(true);
                }, this);
            });
            
        }else if(pointer.rightButton.isDown){
            //Play as action card
            let card = sprite.cardNr;

            //Remove from hand
            sprite = playState.animatingSprites.add(sprite);
            
            //Move to center
            game.add.tween(sprite).to({x: game.world.centerX, y: game.world.centerY, width: cardWidthBig, height: cardHeightBig}, 500, null, true, 0)
            .onUpdateCallback(function(){
                playState.allowInput(false);
            })
            .onComplete.add(function(){
                let backcard = cardFunctions.flipCard(sprite);
                if(playState.playerTurn){
                    backcard = playState.p1pointSprites.add(backcard);
                }else{
                    backcard = playState.p2pointSprites.add(backcard);
                }

                let backX;
                if(playState.playerTurn){
                    backX = 460 + (cardWidth/1.5) * (playState.p1pointSprites.length-1);
                }else{
                    backX = 460 + (cardWidth/1.5) * (playState.p2pointSprites.length-1);
                }

                game.add.tween(backcard).to({x: backX, width: cardWidth, height: cardHeight}, 500, null, true, 0)
                .onUpdateCallback(function(){
                    playState.allowInput(false);
                }, this)
                .onComplete.add(function(){
                    playState.allowInput(true);
                }, this);

                //Save replay
                playState.replaySequence.push(2); //0=draw, 1=action, 2=point
                playState.rsPoints += 1;

                //Play action
                playState.playPoints(sprite.cardNr);
            });
        }
    },
    cardHoverOver: function(sprite){
        //bigger size
        game.add.tween(sprite).to({width: cardWidthBig, height: cardHeightBig}, 100, null, true, 0);
        //render on top
        sprite.bringToTop();
    },
    cardHoverOut: function(sprite){
        //normal size
        game.add.tween(sprite).to({width: cardWidth, height: cardHeight}, 100, null, true, 0);
        //sort correctly again
        if(playState.playerTurn){
            playState.p1handSprites.sort('x');
        }else{
            playState.p2handSprites.sort('x');
        }
    },
    playPoints: function(cardNr){
        //
    },
    playAction: function(cardNr){
        let cardData = playState.deck[cardNr];
        switch (Number(cardData.action)) {
            case 0:
                //Homecoming
                break;
            case 1:
                //Destoy point card
                break;
            case 2:
                //Protect card
                break;
            case 3:
                //Skip a turn
                break;
            case 4:
                //Steal card
                break;
            case 5:
                //Draw two cards
                playState.drawCard(playState.playerTurn, 2);
                break;
        }
    },
    allowInput: function(state){
        playState.p1handSprites.inputEnableChildren = state;
        playState.p1handSprites.forEach(element => {
            element.inputEnabled = state;
        });
        playState.p1pointSprites.inputEnableChildren = state;
        playState.p1pointSprites.forEach(element => {
            element.inputEnabled = state;
        });
        playState.p2handSprites.inputEnableChildren = state;
        playState.p2handSprites.forEach(element => {
            element.inputEnabled = state;
        });
        playState.p2pointSprites.inputEnableChildren = state;
        playState.p2pointSprites.forEach(element => {
            element.inputEnabled = state;
        });
    },
    isInputEnabled: function(){
        if(playState.playerTurn){
            return playState.p1handSprites.inputEnableChildren && playState.p1pointSprites.inputEnableChildren;
        }else{
            return playState.p2handSprites.inputEnableChildren && playState.p2pointSprites.inputEnableChildren;
        }
        
    },

    endTurn: function(){
        if(!playState.isInputEnabled()){return;}
        playState.allowInput(false);

        let alphaTween = playState.fadeScreen(true);
        alphaTween.onComplete.add(function(){
            //switch turns
            playState.playerTurn = !playState.playerTurn;

            //hide all cards
            playState.p1handSprites.visible = playState.playerTurn;
            playState.p1pointSprites.visible = playState.playerTurn;
            playState.p2handSprites.visible = !playState.playerTurn;
            playState.p2pointSprites.visible = !playState.playerTurn;

            playState.animatingSprites.removeAll(true);

            //Add text
            let playerText;
            if(!playState.playerTurn){
                playerText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Player 2', {fill: '#ffffff', fontSize: 100});
            }else{
                playerText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Player 1', {fill: '#ffffff', fontSize: 72});
            }
            playerText.anchor.set(0.5, 0.5);

            //NextButton
            let button = game.add.button(game.world.centerX, game.world.centerY,'next-button', function(){
                button.destroy();
                playerText.destroy();
                alphaTween = playState.fadeScreen(false);
                alphaTween.onComplete.add(function() {
                    //playState.playReplay();
                    playState.allowInput(true);
                }, this);
            });
            button.anchor.set(0.5, 0.5);
        });

    },
    fadeScreen: function(dir){
        playState.fadeSprite.bringToTop();
        if(dir){
            return game.add.tween(playState.fadeSprite).to({alpha: 1}, 500, null, true, 0);
        }else{
            return game.add.tween(playState.fadeSprite).to({alpha: 0}, 500, null, true, 0);
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
    showCardSprite: function(card, x, y, width, height){
        let countryIndex = this.getCountryIndex(card);
        let spriteIndex = this.getSpriteIndex(card);
        let spr = game.add.sprite(x, y, 'cards' + countryIndex, spriteIndex);
        spr.anchor.set(0.5, 0.5);
        spr.width = width;
        spr.height = height;
        spr.cardNr = card;
        return spr;
    },
    flipCard: function(card){
        let backcard = game.add.sprite(card.x, card.y, 'card-back');
        backcard.anchor.set(0.5, 0.5);
        backcard.width = card.width;
        backcard.height = card.height;
        backcard.cardNr = card.cardNr;
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