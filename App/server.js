var express = require('express');
var bodyParser = require('body-parser');
var io = require('socket.io');
var app = express();
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static(__dirname + '/'));
var channel = null;
var nb = 0;




/*

ROUTAGE



*/
app.get('/admin', function(req, res) {
    res.sendFile(__dirname+'/pages/operatorLogin.html');
});

app.post('/admin', function(req, res) {
	if(req.body.pseudo == 'admin' && req.body.password == 'bonjour')	{
		res.sendFile(__dirname+'/pages/operatorPage.html');
	}
});



app.get('/client', function(req, res) {
    res.sendFile(__dirname+'/pages/clientLogin.html');
});

app.post('/client', function(req, res) {
	if(req.body.pseudo == 'client' && req.body.password == 'hello')	{
		res.sendFile(__dirname+'/pages/clientPage.html');
	}
});











/*


WEBRTC



*/
io = io.listen(app.listen(8000));


io.sockets.on('connection', function (socket){

	socket.on('askForHelp', function (client){

		log('S --> Help asked ', client);
		socket.broadcast.emit('helpAsked', client);

	});









	// Handle 'message' messages
	socket.on('message', function (message) {
		log('S --> got message: ', message);
		// channel-only broadcast..
		log('DEBUG >>>>>>>> '+message.channel);
		socket.broadcast.to(channel).emit('message', message);//PB broadcast.to(channel....).to(message.channel)
	});




	// Handle 'create or join' messages
	socket.on('create or join', function (room) {
		channel = room;
		var numClients = nb;
		log('S --> Room ' + room + ' has ' + numClients + ' client(s)');
		log('S --> Request to create or join room', room);
		// First client joining...
		if (numClients == 0){
			nb++;
			socket.join(room);
			socket.emit('created', room);
		} else if (numClients == 1) {
			nb++;
			// Second client joining...
			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);
		} else {
			// max two clients
			socket.emit('full', room);
		}
	});

	function log(){
		var array = [">>> "];
		for (var i = 0; i < arguments.length; i++) {
			array.push(arguments[i]);
		}
		socket.emit('log', array);
	}
});



