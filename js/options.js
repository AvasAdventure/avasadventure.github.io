var triggered = false;
var optionsState = {
	preload: function() {
		//game.load.json('card-decks', deckStorageLink + "countries.json");
	},
	create: function() {
		var backButton = game.add.button(0, 0, 'start-button', this.back, this);
		backButton.scale.set(0.8, 0.8);

		
	},
	update: function() {
		if(!triggered){
			triggered = true;
			game.add.sprite(game.world.centerX, game.world.centerY, 'cards' + 0, 0);
		}
	},
	back: function() {
		game.state.start('menu');
	},
}