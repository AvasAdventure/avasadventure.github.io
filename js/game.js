// start Phaser
var game = new Phaser.Game(1440, 900, Phaser.CANVAS, '');
// add game states: 'boot', 'load', 'menu', 'options', 'play', 'finish'
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('options', optionsState);
game.state.add('play', playState);
game.state.add('restart', restartState);

game.state.start('boot');