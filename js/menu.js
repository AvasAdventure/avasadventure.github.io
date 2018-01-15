var menuState = {
	create: function() {
		var background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
			background.anchor.set(0.5, 0.5);
// ava logo, dropping in from top with bounce
		var loadLogo = game.add.sprite(game.world.centerX, game.world.centerY - 300, 'ava_logo');
			loadLogo.anchor.set(0.5);
			loadLogo.scale.set(2, 2);
// start button
		var startButton = game.add.button(game.world.centerX, game.world.centerY, 'start-button', this.play, this);
			startButton.anchor.set(0.5, 0.5);
			startButton.scale.set(0.8, 0.8);
// options button
	},
	play: function() {
		game.state.start('play');
	},
	update: function() {

	}
}