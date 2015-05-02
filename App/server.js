var express = require('express');
var bodyParser = require('body-parser');
var io = require('socket.io');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));      // to support URL-encoded bodies
app.use(express.static(__dirname + '/'));





/*
 *
 *	ROUTING
 *
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
 *
 *	WEBRTC
 *
 */

io = io.listen(app.listen(8000));


io.sockets.on('connection', function (socket){

	var room = '';


	socket.on('askForHelp', function (client){
		console.log('help asked');
		room = client;
		socket.join(room);
		socket.broadcast.emit('helpAsked', room);
	});



	socket.on('help', function (client){
		console.log('help offered');
		room = client;
		socket.join(room);
		socket.in(room).emit('helpOffered', room);
	});


	socket.on('RTCOffer', function (sessionDescription){
		console.log('RTC offer');
		socket.in(room).emit('RTCOffer', sessionDescription);
	});



	socket.on('RTCAnswer', function (sessionDescription){
		console.log('RTC answer');
		socket.in(room).emit('RTCAnswer', sessionDescription);
	});


	socket.on('iceCandidate', function (ice){
		console.log('ice');
		socket.in(room).emit('iceCandidate', ice);
	});

});



