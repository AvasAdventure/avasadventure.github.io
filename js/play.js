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
        var endTurnButton = game.add.button(120, 120, 'endturn-button', function(){
            if(playState.blockInput){return;}
            playState.endTurn();
        });
        endTurnButton.scale.set(1.5,1.5);
        // return to main menu button
        var returnButton = game.add.button(25, 25, 'return-button', function(){
            if(!playState.isInputEnabled()){return;}
            else {
                playState.state.start('menu');
            }   
        });
        // quick guide button
        var guideButton = game.add.button(1700, 25, 'guide-button', function() {
            if(!playState.isInputEnabled()){return;}
            playState.allowInput(false);
            actionGuide = game.add.sprite(game.world.centerX, game.world.centerY, 'action-guide');
            actionGuide.anchor.set(0.5,0.5);
            var closeButton = game.add.button(game.world.centerX, 900, 'close-button', function() {
                actionGuide.destroy();
                closeButton.destroy();
                playState.allowInput(true)
            });
            closeButton.anchor.set(0.5,0.5);
        });
        //Draw pile
        var drawPileButton = game.add.button(1760, 540, 'card-back', function(){
            if(playState.blockInput){
                return;
            }
            if(!playState.isInputEnabled()){return;}
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
        this.p1Score = [];
        this.p1ScoreSum = [];
        this.p1Protect = 0;
        this.p1Homecomingcards = [];
        this.p2Score = [];
        this.p2ScoreSum = [];
        this.p2Protect = 0;
        this.p2hand = [];
        this.p1handSprites = game.add.group();
        this.p2handSprites = game.add.group();
        this.animatingSprites = game.add.group();

        this.endGame = false;
        this.skipNextTurn = false;
        this.countDown = 5;
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
            let actions = this.checkActions();
            if(!actions) {'no more actions left'}
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
            } else {

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
            } 
    },

    cardClick: function(sprite, pointer){
        if(!playState.isInputEnabled()){return;}
        let actions = this.checkActions();
        if(!actions) {
            console.log('no more actions left')
        } else {
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
                maxPlayerActions -= 1;
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
                maxPlayerActions -= 1;
                });
            }
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
        let cardData = playState.deck[cardNr];
        let cardPoints = Number(cardData.points);
        let cardCountry = cardData.country;
        let cardCountryPoints = [cardCountry, cardPoints];
        if(playState.playerTurn) {  
            this.p1pointCards.push(cardCountryPoints);
            console.log('player 1 points length: ' + this.p1pointCards.length);
            console.log('player 1 protection: ' + this.p1Protect);
        } else {
            this.p2pointCards.push(cardCountryPoints);
            console.log('player 2 points length: ' + this.p2pointCards.length);
            console.log('player 2 protection: ' + this.p2Protect);
//            this.p2Score.reduce((a,b)=>a+b, 0);
        }
    },
    getScore: function() { 
        for (var i = 0; i < this.p1pointCards.length;i++) {
        // counts all the english cards, country '2'
            if (this.p1pointCards[i][0] == "2") {
                this.p1Score.push(this.p1pointCards[i][1]);
                console.log(this.p1pointCards[i][1]);
            } else {
                console.log('not english')
                return; 
            }
        }
        for (var j = 0; j < this.p2pointCards.length;j++) {
        // counts all the english cards, country '2'
            if (this.p2pointCards[j][0] == "2") {
                this.p2Score.push(this.p2pointCards[j][1]);
                console.log(this.p2pointCards[j][1]);
            } else {
                console.log('not english')
                return; 
            }
        }
        console.log(this.p1pointCards);
        console.log(this.p1Score);
        console.log(this.p2pointCards);
        console.log(this.p2Score);
    },
    calcWinner: function(p1Score, p2Score) {
        // sum of scores
        this.p1ScoreSum = this.p1Score.reduce((a,b)=>a+b, 0);
        console.log('player 1 score: ' + this.p1ScoreSum);
        this.p2ScoreSum = this.p2Score.reduce((a,b)=>a+b, 0);
        console.log('player 2 score: ' + this.p2ScoreSum);
        let winText;
            if (this.p1ScoreSum > this.p2ScoreSum ) {
                let alphaTween = playState.fadeScreen(true);
                winText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Player 1 Won!', {fill: '#ffffff', fontSize: 72});
                winText.anchor.set(0.5,0.5);
                let button = game.add.button(game.world.centerX, game.world.centerY,'restart-button', function(){
                    game.state.start('menu');
                    alphaTween = playState.fadeScreen(false);
                    alphaTween.onComplete.add(function() {
                    playState.allowInput(true);
                    }, this);
                button.anchor.set(0.5, 0.5);
                });
                button.anchor.set(0.5, 0.5);        
            } else if (this.p1ScoreSum < this.p2ScoreSum) {
                let alphaTween = playState.fadeScreen(true);
                winText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Player 2 Won!', {fill: '#ffffff', fontSize: 72});
                winText.anchor.set(0.5,0.5);
                let button = game.add.button(game.world.centerX, game.world.centerY,'restart-button', function(){
                    game.state.start('menu');
                    alphaTween = playState.fadeScreen(false);
                    alphaTween.onComplete.add(function() {
                    playState.allowInput(true);
                    }, this);
                });
                button.anchor.set(0.5, 0.5);
            } else {
                let alphaTween = playState.fadeScreen(true);
                winText = game.add.text(game.world.centerX, game.world.centerY - 200, 'DRAW!', {fill: '#ffffff', fontSize: 72});
                winText.anchor.set(0.5,0.5);
                let button = game.add.button(game.world.centerX, game.world.centerY,'restart-button', function(){
                    game.state.start('menu');
                    alphaTween = playState.fadeScreen(false);
                    alphaTween.onComplete.add(function() {
                    playState.allowInput(true);
                    }, this);
                button.anchor.set(0.5, 0.5);
            });
        }
    },
    playAction: function(cardNr){
        let cardData = playState.deck[cardNr];
        console.log(cardData);
        switch (Number(cardData.action)) {
            case 0:
                this.homeComing();
                break;
            case 1:
                //Destoy point card
                this.destroyPointCard();
                break;
            case 2:
                //Protect card
                this.protectCard();
                break;
            case 3:
                this.skipTurn();
                break;
            case 4:
                this.stealCard();
                break;
            case 5:
                //Draw two cards
                playState.drawCard(playState.playerTurn, 2);
                break;
        }
    },
    homeComing: function() {
        if (!this.endGame) {
            this.endGame = true;
            console.log('set coundDown to ' + this.endGame); 
            window.alert('HOME COMING HAS BEEN PLAYED, TURNS REMAINING: ' + this.countDown);
        } else {
        
        }
    },
    protectCard: function() {
        if(this.playerTurn && (this.p1pointCards.length > this.p1Protect)) {
            this.p1Protect += 1;
            console.log('Amount of pointcard protected: ' + this.p1Protect);
        } else if(!this.playerTurn && (this.p2pointCards.length > this.p2Protect)){
            this.p2Protect += 1;
            console.log('Amount of pointcard protected: ' + this.p2Protect);
        } else {
            console.log('something went wrong');
        }
    },
    destroyPointCard: function(p1Protect, p2Protect, card) {
        if (this.playerTurn && this.p2pointCards != 0 && this.p2Protect == 0) {
            let destroyIndex = Math.floor(Math.random() * (this.p2pointCards.length - this.p2Protect));
            let destroyData = this.p2pointCards[destroyIndex];
            this.p2pointCards.splice(destroyData, 1);
            this.p2pointSprites.removeChildAt(destroyIndex[1]);
        } else if (this.playerTurn && this.p2Protect != 0) {
// decrease p2protect by 1, it has protected one card
            console.log('player 2 protected one card!')
            this.p2Protect -= 1;
        } else if (!this.playerTurn && this.p1pointCards != 0 && this.p1Protect == 0) {
            let destroyIndex = Math.floor(Math.random() * (this.p1pointCards.length - this.p1Protect));
            let destroyData = this.p1pointCards[destroyIndex];
            this.p1pointCards.splice(destroyData, 1);
            this.p1pointSprites.removeChildAt(destroyIndex);
        } else if (!this.playerTurn && this.p1Protect != 0) {
            console.log('player 1 protected one card!')
            this.p1Protect -= 1;
        } else {
            console.log('dun goofed')
        }
    },
    skipTurn: function() {
        if(!this.skipNextTurn) {
            this.skipNextTurn = true;
        } else {
            window.alert('Opponent is already skipping next turn.')
        }
    },
    stealCard: function() {
        if(this.playerTurn && this.p2handSprites.length != 0) {
            let stealIndex = Math.floor(Math.random() * this.p2handSprites.length);
            let stealData = this.p2handSprites.getChildAt(stealIndex);
            this.p2handSprites.removeChildAt(stealIndex);
            this.p1handSprites.addChild(stealData);
        } else if (!this.playerTurn && this.p1handSprites.length != 0) {
            let stealIndex = Math.floor(Math.random() * this.p1handSprites.length);
            let stealData = this.p1handSprites.getChildAt(stealIndex);
            this.p1handSprites.removeChildAt(stealIndex);
            this.p2handSprites.addChild(stealData);
        } else {
            console.log('no cards to steal');
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
        if(this.endGame) {
            this.countDown -= 1;
            console.log('turns left: ' +this.countDown);
        }
        if(this.countDown <= 0) {
           var scores = this.getScore();
           console.log(scores);
           this.calcWinner();
        } else {
            if(!this.skipNextTurn){maxPlayerActions = 2}else{this.skipNextTurn = false};
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
        }    
    },
    fadeScreen: function(dir){
        playState.fadeSprite.bringToTop();
        if(dir){
            return game.add.tween(playState.fadeSprite).to({alpha: 1}, 500, null, true, 0);
        }else{
            return game.add.tween(playState.fadeSprite).to({alpha: 0}, 500, null, true, 0);
        }
    },
    checkActions: function(){
        if (maxPlayerActions != 0) {
            console.log('actions left: ' + maxPlayerActions);
            return true;
        } else {
            return false;
        }
    },

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
    showCardDetails: function() {

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