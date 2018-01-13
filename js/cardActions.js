//cardData should be the JSON object.
var cardActions = {
	homecoming: function(cardData){
        console.log('homecoming');
	},
	destroyPointCard: function(cardData, repeatAmount){
		
	},
	protectPointCard: function(cardData, repeatAmount){

	},
	skipTurn: function(cardData, repeatAmount){

	},
	stealHandCard: function(cardData, repeatAmount){

	},
	drawTwoCards: function(cardData, repeatAmount, player){
		console.log('beep');
		playState.dealCard(player, 2);
	}
}