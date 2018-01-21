var loadState = {
	preload: function() {
		//Load general assets here.
		game.load.crossOrigin = 'anonymous';
		game.load.spritesheet('ava_shrug', 'assets/ava_shrug.png', 320, 413, 3);
		game.load.spritesheet('mute', 'assets/mute-button.png',133,132);
		game.load.image('ava_logo', 'assets/ava_logo.png');
		game.load.image('background', 'assets/background.png');
		game.load.image('card-back', 'assets/card-back.png');		
		game.load.image('drag-overlay-points', 'assets/drag-overlay-points.png');
		game.load.image('drag-overlay-action', 'assets/drag-overlay-action.png');
		game.load.image('game-board', 'assets/game-board.png');
		game.load.image('black', 'assets/black.png');
		game.load.image('win-screen', 'assets/win-screen.png');
// background
		game.load.spritesheet('board-background', 'assets/background-spritesheet.png', 1920, 1080, 5);
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
// event placeholders

		game.load.image('steal-event', 'assets/steal-event.png');
		game.load.image('strike-event', 'assets/strike-event.png');
		game.load.image('no-actions', 'assets/noactions-event.png');
		game.load.image('home-coming', 'assets/home-coming.png');

		//Sounds
		game.load.audio('menutheme', 'assets/audio/menutheme.wav');
		game.load.audio('background1', 'assets/audio/background1.wav');
		game.load.audio('background2', 'assets/audio/background2.wav');
		game.load.audio('background3', 'assets/audio/background3.wav');
		game.load.audio('buttonclick', 'assets/audio/buttonclick.wav');
		game.load.audio('card1', 'assets/audio/cardMove1.wav');
		game.load.audio('card2', 'assets/audio/cardMove2.wav');
		game.load.audio('card3', 'assets/audio/cardMove3.wav');

		//Load the card deck list
		game.load.json('card-decks', deckStorageLink + "countries.json");	
	},
	create: function() {
		console.log('loadState did load');
		game.state.start('secondLoad');
	}
}