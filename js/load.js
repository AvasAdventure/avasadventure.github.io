var loadState = {
	preload: function() {
		//Load general assets here.
		game.load.crossOrigin = 'anonymous';
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
		game.load.image('return-button', 'assets/return-button.png');
		game.load.image('guide-button', 'assets/guide-button.png');
		game.load.image('action-guide', 'assets/action-guide.png');
		game.load.image('close-button', 'assets/close-button.png');
		game.load.image('wieken', 'assets/wieken.png');
		game.load.image('points-area', 'assets/pointsArea.png');
		game.load.image('menu-container', 'assets/menu-container.png');


		game.load.image('card-back', 'assets/card-back.png');
		game.load.image('game-board', 'assets/game-board.png');
		game.load.image('black', 'assets/black.png');
		game.load.image('next-button', 'assets/next-button.png');

		//Load the card deck list
		game.load.json('card-decks', deckStorageLink + "countries.json");
		
	},
	create: function() {
		game.state.start('secondLoad');
	}
}