var menuState = {
	create: function() {
		var background = game.add.tileSprite(0, 0, 1400, 1400, 'background');
 			millWieken = game.add.sprite(game.world.centerX + 500, game.world.centerY -290, 'wieken');
 			millWieken.anchor.set(0.5, 0.5);

 // fade in menu, containing start and options buttins	
		var menuContainer = game.add.sprite(game.world.centerX, game.world.centerY + 180, 'menu-container');
			menuContainer.anchor.set(0.5,0.5);
			menuContainer.alpha = 0;
			game.add.tween(menuContainer).to( { alpha: 1}, 10000, Phaser.Easing.Linear.None, true, 0, 0, false);
// ava logo, dropping in from top with bounce
		var loadLogo = game.add.sprite(game.world.centerX, game.world.centerY - 300, 'ava_logo');
			loadLogo.anchor.set(0.5);
			loadLogo.scale.set(2, 2,);
			game.add.tween(loadLogo).from( { y: - 200 }, 2000, Phaser.Easing.Bounce.Out, true);
// start button
		var startButton = game.add.button(game.world.centerX, game.world.centerY, 'start-button', this.play, this);
			startButton.anchor.set(0.5, 0.5);
			startButton.scale.set(0.8, 0.8);
			startButton.alpha = 0;
			game.add.tween(startButton).to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 2000, 0, false);
// options button
		var optionsButton = game.add.button(game.world.centerX, game.world.centerY + 300, 'options-button', this.options, this);
			optionsButton.anchor.set(0.5, 0.5);
			optionsButton.scale.set(0.8, 0.8);
			optionsButton.alpha = 0;
			game.add.tween(optionsButton).to( {alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 2000, 0, false);
	},
	options: function() {
		game.state.start('options');
	},
	play: function() {
		game.state.start('play');
	},
	update: function() {
 		millWieken.angle += 0.5;

	}
}