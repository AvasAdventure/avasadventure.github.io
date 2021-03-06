//Game Configuration
var deckStorageLink = "cards/";//"https://raw.githubusercontent.com/AvasAdventure/Card-Decks/master/";
var deckLength = 10;
var maxPlayerActions = 2;
var maxHandSize = 10;
var cardSprWidth = 755;
var cardSprHeight = 1054;
var cardWidth = 230;
var cardHeight = 320;
var cardWidthSmall = 207;
var cardHeightSmall = 288;
var cardWidthBig = 294;
var cardHeightBig = 384;

//Start Phaser
var game = new Phaser.Game(1920, 1079, Phaser.CANVAS, '');

//Add Game States
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('secondLoad', secondLoadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

//Start game
game.state.start('boot');