var loadState = {
	preload: function() {
		//Load general assets here.
		game.load.crossOrigin = 'anonymous';
		game.load.spritesheet('ava_shrug', 'assets/ava_shrug.png', 320, 413, 3);
		game.load.image('ava_logo', 'assets/ava_logo.png');
		game.load.image('card-back', 'assets/card-back.png');
		game.load.image('game-board', 'assets/game-board.png');
		game.load.image('black', 'assets/black.png');
		game.load.image('win-screen', 'assets/win-screen.png');
// buttons
		game.load.image('start-button', 'assets/start-button.png');
		game.load.image('endturn-button', 'assets/endturn-button.png');
		game.load.image('next-button', 'assets/next-button.png');
		game.load.image('return-button', 'assets/return-button.png');
		game.load.image('guide-button', 'assets/guide-button.png');
		game.load.image('action-guide', 'assets/action-guide.png');
		game.load.image('close-button', 'assets/close-button.png');
		game.load.image('menu-button', 'assets/menu-button.png');
		game.load.image('new-game', 'assets/new-game.png');

		//Load the card deck list
		game.load.json('card-decks', deckStorageLink + "countries.json");	
	},
	create: function() {
		game.state.start('secondLoad');
	}
}