var compteur = 0;
;
var express = require('express');
var sessions = require('express-session');
var io = require('socket.io')
var colors = require('colors');
var app = express ();
var bodyParser = require("body-parser");
var $ = require('jquery');


//model

var database = require("./db/api.js");
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
    	//console.log("staff member");
        next();
    }else{
        //authen failed 
        res.redirect("/");
    }
}

function ClientIsAuthenticated(req,res,next){
    var sess = req.session;
    var client_to_verify = sess.user;
    if(client_to_verify && client_to_verify.client){
    	//console.log("client");
        next();
    }else{
        //authen failed 
        res.redirect("/");
    }
}
function notConnected (req,res,next){
	var sess = req.session;
	var user_to_verify = sess.user;
	if(user_to_verify){
		if( user_to_verify.client){
			res.redirect("/help")
		}else if(user_to_verify.staff){
			res.redirect("/work_space")
		}
	}else{
		next();
	}
    
   	
}


//routes
app.get('/', notConnected , function (req, res, next){
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
	var user = database.userLogin(email, password);
	console.log("facade, login ==== user : "+user);

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
		res.redirect("/");
	}
		//console.log("Trying to login : %s with %s".green, name, password);
});

//Staff functions 
app.get("/work_space", StaffIsAuthenticated, function (req, res, next){
	var staff_member = req.session.user;
	res.render("views/work_space",{
		staff_member : staff_member
	});
});
//Staff functions 
app.get("/help", ClientIsAuthenticated, function (req, res, next){
	var client = req.session.user;
	res.render("views/help",{
		client : client
	});
});


app.get("/userDisconnection", function (req,res,next){
	//killing session
	req.session.destroy(function (err){
		if(err){
			console.log(err);
		}else{
			res.redirect('/');
		}
	})
});

/*-----------Error handeling----------*/
/*
This code has to be here (after all other routes 
possible). Otherwise routes coded after that will
be ignored. 
*/
//404

app.use(function(req, res, next){
  res.status(404);
  //do a page
  res.type('txt').send('Not found yet');
});


//500 errors handeling
//not use so far (developing stage), we want to see the verbose of the 
//errors to de bug


/*-------------Startup----------------*/


var unicServer = app.listen(8000, function (){
	console.log('ready on port 8000'.green);
});







/*----------------------------------------------------------------------
---------------------------------WEBRTC---------------------------------
----------------------------------------------------------------------*/
//code : Matthieu


/*TODO : 
0)what is the 'client' filled ? what is it concretly? 

1)What happends when a oppérator connects after client asked help
2)Work on socket disconnection.
3)Localy store the the in comming calls ?



*/
io = io.listen(unicServer);


io.sockets.on('connection', function (socket){

	var room = '';


	socket.on('askForHelp', function (client){
		console.log('help asked');
		room = client;  //<== want is this ?
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
		socket.in(room).emit('RTCOffer', sessionDescription);//<== what is sessionDescription?
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
