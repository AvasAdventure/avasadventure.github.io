//Load all the actual cards into the game.
//I made this secondLoad to be able to load the spritesheet from the cached json.
var deckAmount = 0;
var secondLoadState = {
	preload: function() {
		//You can get all sprites by doing:
		//game.add.sprite(x, y, 'cards' + countryNR, index);
		// index = 0-10
		var decksData = game.cache.getJSON('card-decks', true);
		
		for(let i = 0; i < decksData.length; i++){
			//for example: https://raw.githubusercontent.com/AvasAdventure/Card-Decks/master/netherlands_cards.png
			game.load.json('cards' + i, deckStorageLink + decksData[i][0]);
			game.load.spritesheet('cards' + i, deckStorageLink + decksData[i][1], cardWidth, cardHeight, 11);
			deckAmount += 1;
		}
	},
	create: function() {
		game.state.start('menu');
	}
}