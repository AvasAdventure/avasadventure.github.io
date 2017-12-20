//Game Configuration
var deckStorageLink = "https://raw.githubusercontent.com/AvasAdventure/Card-Decks/master/";
var deckLength = 10; //should be 10 later
var maxPlayerActions = 2;
var maxHandSize = 5; //to turn off set to high nr.
var cardWidth = 181;
var cardHeight = 252;

//Start Phaser
var game = new Phaser.Game(1920, 1079, Phaser.CANVAS, '');

//Add Game States
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('secondLoad', secondLoadState);
game.state.add('menu', menuState);
game.state.add('options', optionsState);
game.state.add('play', playState);
game.state.add('restart', restartState);

//Start game
game.state.start('boot');