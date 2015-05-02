var express = require('express');
var bodyParser = require('body-parser');
var io = require('socket.io');
var app = express();
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static(__dirname + '/'));



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

	var room = '';




	socket.on('askForHelp', function (client){
		room = client;
		log('S --> Help asked ', room);
		socket.join(room);
		socket.broadcast.emit('helpAsked', room);

	});



	socket.on('help', function (client){
		room = client;
		log('S --> Help offered ', room);
		socket.join(room);
		socket.in(room).emit('helpOffered', room);

	});


	socket.on('offer', function (sessionDescription){

		log('S --> RTCSessionDescription offer sent ', sessionDescription);
		socket.in(room).emit('offer', sessionDescription);

	});



	socket.on('answer', function (sessionDescription){

		log('S --> RTCSessionDescription answer sent ', sessionDescription);
		socket.in(room).emit('answer', sessionDescription);

	});


	socket.on('ice', function (ice){

		log('S --> Ice candidate ', ice);
		socket.in(room).emit('ice', ice);

	});



	function log(){
		var array = [">>> "];
		for (var i = 0; i < arguments.length; i++) {
			array.push(arguments[i]);
		}
		socket.emit('log', array);
	}
});



