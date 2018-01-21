var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/cards', express.static(__dirname + '/cards'));
app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
})
server.listen(4444, function() {
	console.log('Listening on ' + server.address().port); 
});