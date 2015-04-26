var compteur = 0;

var express = require('express');
var sessions = require('express-session');
var colors = require('colors');
var app = express ();
var bodyParser = require("body-parser");
var $ = require('jquery');


//model

var database = require("./model/dbsumulator.js");
var userClass = require("./model/user.js");


//call management
var pendingAlerts = new Array();


app.set("view engine", "ejs");
app.set("views", __dirname);//+/view si on veux être propre

//use
app.use(bodyParser());

//session use (not secure at all)
app.use(sessions({secret : 'secret'}));


//static serving
app.use(express.static(__dirname + '/views'));

function StaffIsAuthenticated(req,res,next){
    var sess = req.session;
    var staff_member_to_verify = sess.user;
    //console.log("StaffIsAUtheenticated : "+staff_member_to_verify.staff);
    if(staff_member_to_verify && staff_member_to_verify.staff){
    	console.log("staff member");
        next();
    }else{
        //authen failed 
        res.render("views/home_page");
    }
}
function UserIsAthenticated (req, res, next){
	var sess = req.session;
    //var user_member_to_verify = sess.user;
	if(1){
    	console.log("user at least");
        next();
    }else{
        //authen failed 
        res.render("views/home_page");
    }
}
function ClientIsAuthenticated(req,res,next){
    var sess = req.session;
    var client_to_verify = sess.user;
    if(client_to_verify && client_to_verify.client){
    	console.log("client");
        next();
    }else{
        //authen failed 
        res.render("views/home_page");
    }
}
function renderWorkSpace (req, res, worker){
	res.render("views/work_space",{
		staff_member : worker
	});

}

//routes
app.get('/', function(req, res){
	//var myitems = [ {id : "1" , desc : "food"},{id : "2", desc :"maman"}, {id : "3", desc :"toto"}];
	res.render("views/home_page",{
		/*title : "learning",
		items : myitems*/
	});

});



app.post("/userConnection", function (req, res){
	var login =1;
	var sess;
	var email = req.body.email;
	var password = req.body.password;

	//ask data base 
	var user = database.login(email, password);

	if(user){
		sess=req.session;
		//security parameter for the session
		sess.user = user;
		if(sess.user instanceof userClass.Staff){
			res.redirect('/work_space');
		}else if (sess.user instanceof userClass.Client){
			res.redirect('/help');
		}else {
			console.log("error at login dispach");
		}
		
	}else {
		res.render("views/home_page",{});
	}
		//console.log("Trying to login : %s with %s".green, name, password);
});

//Staff functions 
app.get("/work_space", StaffIsAuthenticated, function (req, res, next){
	var staff_member = req.session.user;
	renderWorkSpace(req, res, staff_member);
});
//Staff functions 
app.get("/help", ClientIsAuthenticated, function (req, res, next){
	var client = req.session.user;
	res.render("views/help",{
		client : client
	});
});


app.get("/userDisconnection", UserIsAthenticated, function (req,res,next){
	//killing session
	req.session.destroy(function (err){
		if(err){
			console.log(err);
		}else{
			res.redirect('/');
		}
	})
});


//Ajax text
app.get("/test", function(req,res){
	res.render("test");
});
var http = require('http');

app.get("/needHelp",function (req, res) {
    
    pendingAlerts.push(req.session.user);
    var room = pendingAlerts.indexOf(req.session.user);
    console.log('Alert receive, room :'+room);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('_testcb(\'{"room": "'+room+'"}\')');
});

app.get("/updatePendingAlerts", function (req, res){
	console.log('update');
	res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(pendingAlerts));
});
app.get("/helpSomeone", function (req, res){
	
	var room = '0';
	console.log('alert taken for room : '+room);
	var data = {room :  room};
	data = JSON.stringify(data);
	res.writeHead(200, {'Content-Type': 'applicatio,/json'});
    res.end(data);
});



/*-------------Startup----------------*/


app.listen(8000, function (){
	console.log('ready on port 8000'.green);
});







/*----------------------------------------------------------------------
---------------------------------WEBRTC---------------------------------
----------------------------------------------------------------------*/

var webRTCstatic = require('node-static');
var webRTChttp = require('http');
// Create a node-static server instance
var file = new(webRTCstatic.Server)();
var channel = null;
var nb = 0;
// We use the http module’s createServer function and
// rely on our instance of node-static to serve the files
var webRTCapp = webRTChttp.createServer(function (req, res) {
	file.serve(req, res);
}).listen(8181);
// Use socket.io JavaScript library for real-time web applications
var io = require('socket.io').listen(webRTCapp);



// Let's start managing connections...
io.sockets.on('connection', function (socket){
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

	socket.on('creat', function (room){
		channel = room;
		log('S --> Request to creat room', room);	
		socket.join(room);
		socket.emit('created', room);
	});

	socket.on('join', function (room){
		channel = room;
		log('S --> Request to join room', room);
		log('S --> Room ' + room + 'is now full');		
		io.sockets.in(room).emit('join', room);
		socket.join(room);
		socket.emit('joined', room);

	});


	function log(){
		var array = [">>> "];
		for (var i = 0; i < arguments.length; i++) {
			array.push(arguments[i]);
		}
		socket.emit('log', array);
	}
});

