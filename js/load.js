var loadState = {
	preload: function() {
		/*
	// load the card deck, hosted the JSON mocky for now
		game.load.json('card_deck', "assets/card_deck.json");*/

		//Load general assets here.
		game.load.crossOrigins = 'anonymous';
		game.load.image('background', 'assets/background.png');
		game.load.image('ava_v2', 'assets/ava_v2.png');
		game.load.spritesheet('ava_shrug', 'assets/ava_shrug.png', 320, 413, 3);
		game.load.image('ava_logo', 'assets/ava_logo.png');
		game.load.image('draw-button', 'assets/draw-button.png');
		game.load.image('start-button', 'assets/start-button.png');
		game.load.image('options-button', 'assets/options-button.png');
		game.load.image('showhand-button', 'assets/showhand-button.png');
		game.load.image('hidehand-button', 'assets/hidehand-button.png');
		game.load.image('endturn-button', 'assets/endturn-button.png');
		game.load.image('restart-button', 'assets/restart-button.png');
		game.load.image('wieken', 'assets/wieken.png');
		game.load.image('menu-container', 'assets/menu-container.png');
		//Load the card deck list.
		//game.load.spritesheet('cards', 'assets/card-deck.png', 181, 252, 11);
		game.load.json('card-decks', deckStorageLink + "countries.json");
	},
	create: function() {
		game.state.start('secondLoad');
		console.log('loadState did load');
	}
}