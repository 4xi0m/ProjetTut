var static = require('node-static');
var http = require('http');
var url = require('url');
// Create a node-static server instance
var file = new(static.Server)();
var auth = false;

// We use the http module’s createServer function and
// rely on our instance of node-static to serve the files
var app = http.createServer(function (req, res) {
	file.serve(req, res);
	var page = url.parse(req.url).pathname;
	/*if (page == '/login') {
		res.writeHead(200, {"Content-Type": "text/plain"});
	    res.write('Vous êtes dans la cave à vins, ces bouteilles sont à moi !');
	    res.end();
	}*/
}).listen(8181);
// Use socket.io JavaScript library for real-time web applications
var io = require('socket.io').listen(app);




// Let's start managing connections...
io.sockets.on('connection', function (socket){
	if(auth == true)	{
		socket.emit('ok');
	}


	// Handle 'message' messages
	socket.on('login', function (pseudo, password) {
		if(pseudo == 'admin' && password == 'bonjour')	{
			log('OKOKOK');
			auth = true;
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