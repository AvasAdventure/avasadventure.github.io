var bootState = {
	create: function() {
		game.state.start('load');
		console.log('bootState did load');
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
	}
}