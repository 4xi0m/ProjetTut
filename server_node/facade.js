var express = require('express');
var sessions = require('express-session');
var bodyParser = require("body-parser");
var io = require('socket.io');
var colors = require('colors');
var app = express();



app.set("view engine", "ejs");
app.set("views", __dirname);								//+/view si on veux être propre
app.use(bodyParser.urlencoded({extended: true})); 		   	// to support URL-encoded bodies
app.use(sessions({secret : 'secret'}));						//session use (not secure at all)
app.use(express.static(__dirname + '/views'));				//static serving







//config values
var config_fields =require("./package.json").config;
var server = config_fields.server_hosting;
var server_port = config_fields.server_hosting_port;
//console.log(server);

//model



/*----------------------------------------------------------------------
---------------------------------MODEL---------------------------------
----------------------------------------------------------------------*/


var database = require("./db/api.js");
var userClass = require("./model/user.js");
var pendingCalls = new Array();








//
//	User / staff authentification functions
//

function StaffIsAuthenticated(req, res, next){
    var sess = req.session;
    var staff_member_to_verify = sess.user;
    if(staff_member_to_verify && staff_member_to_verify.staff)	{
        next();
    }
    //Authentification failed
    else	{
        res.redirect("/");
    }
}

function ClientIsAuthenticated(req, res, next){
    var sess = req.session;
    var client_to_verify = sess.user;
    if(client_to_verify && client_to_verify.client)	{
        next();
    }
    //Authentification failed
    else{
        res.redirect("/");
    }
}

function notConnected (req, res, next){
	var sess = req.session;
	var user_to_verify = sess.user;
	if(user_to_verify)	{
		if( user_to_verify.client)	{
			res.redirect("/help")
		}
		else if(user_to_verify.staff)	{
			res.redirect("/work_space")
		}
	}
	else	{
		next();
	}   	
}











/*----------------------------------------------------------------------
---------------------------------ROUTING---------------------------------
----------------------------------------------------------------------*/


//	Home page
app.get('/', notConnected , function (req, res, next){
	res.render("views/home_page", {});
});



//	Sign up page (1st visit)
app.get('/createAccount', notConnected, function (req, res, next){
	res.render("views/createAccount",{});
});



//	Sign up page (form filled)
app.post('/createAccount', notConnected, function (req , res ,next){
	var sess;
	var b = req.body;
	var strName = b.name;
	var strFirstName = b.firstname;
	var strEmail = b.email;
	var pass1 = b.password1;
	var pass2 = b.password2;

	var send_response = function (error, user){
		if (user){
			sess = req.session;
			sess.user = user;
			res.redirect('/help');
		}else{
			res.render("views/createAccount", {'error' : error});
		}
	}

	//security and good checking
	console.log("createAccount === name : "+strName+" firstname : "+strFirstName+" email : "+strEmail);
	console.log("more === pass1 : "+pass1+" pass2 : "+pass2);
	if(pass2 != pass1){
		res.render("views/createAccount", {'error' : 'deferent_pass'});
	}else{
		//enter in the data base
		database.addClient(strName, strFirstName, strEmail, pass2, send_response);
	}	

});



//	User connection page
app.post("/userConnection", function (req, res){
	var sess;
	var email = req.body.email;
	var password = req.body.password;

	var send_response = function (error,client){
		console.log("facade, login ==== user : "+client);
		if(client){
			sess=req.session;
			sess.user = client;
			if (sess.user instanceof userClass.Client){
				res.redirect('/help');
			}else {
				console.log("error at login dispach");
			}
			
		}else {
			res.redirect("/");
		}
	}
	//ask data base 
	database.clientLogin(email, password, send_response);	
});



//	Operator connection page
app.get("/opperatorLogin", function (req, res){
	res.render("views/opperatorLogin", {});
});



//	Operator connection page
app.post("/opperatorConnection", function (req, res){
	var sess;
	var email = req.body.email;
	var password = req.body.password;

	var send_response = function (error,staff){
		console.log("facade, login ==== user : "+staff);
		if(staff){
			sess=req.session;
			sess.user = staff;
			if(sess.user instanceof userClass.Staff){
				res.redirect('/work_space');
			}else {
				console.log("error at login dispach");
			}			
		}else {
			res.redirect("/opperatorLogin");
		}
	}
	//ask data base 
	database.staffLogin(email, password, send_response);

});



//	Staff sign up page (1st visit)
//en téhorie il faut être connceté non en staff ? 
app.get("/addOpperator",function (req, res){
	res.render("views/addOpperator", {});
});


//	Staff sign up page (form filled)
app.post("/addOpperator", function (req, res){
	var sess;
	var b = req.body;
	var strName = b.name;
	var strFirstName = b.firstname;
	var strEmail = b.email;
	var pass1 = b.password1;
	var pass2 = b.password2;

	var send_response = function (error, user){
		//console.error("addOpperator "+error);
		if (user){
			res.render('views/addOpperator', {'action': 'newWorkerAdded'});
		}else{
			res.render("views/addOpperator", {'error' : error});
		}
	}

	//security and good checking
	console.log("addOpperator === name : "+strName+" firstname : "+strFirstName+" email : "+strEmail);
	console.log("more === pass1 : "+pass1+" pass2 : "+pass2);
	if(pass2 != pass1){
		res.render("views/addOpperator", {'error' : 'diferent_pass'});
	}else{
		//enter in the data base
		database.addStaff(strName, strFirstName, strEmail, pass2, send_response);
	}	

});



//	Staff workspace page
app.get("/work_space", StaffIsAuthenticated, function (req, res, next){
	var staff_member = req.session.user;
	res.render("views/work_space",{
		staff_member : staff_member
	});
});



//	Client page 
app.get("/help", ClientIsAuthenticated, function (req, res, next){
	var client = req.session.user;
	res.render("views/help",{
		client : client
	});
});



//	User disconnection page
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


var unicServer = app.listen(server_port, function (){
	console.log('ready on port '.green+server_port.green);
});








/*----------------------------------------------------------------------
---------------------------------WEBRTC---------------------------------
----------------------------------------------------------------------*/
//code : Matthieu


io = io.listen(unicServer);


io.sockets.on('connection', function (socket){

	var room = '';
	var peersNumber = 0;


	socket.on('askForHelp', function (client){
		if(peersNumber == 0)	{
			console.log('help asked');
			room = client;					//	client = room name (md5(md5(client_mail) + timestamp))
			peersNumber++;
			pendingCalls.push(client);
			socket.join(room);
			socket.broadcast.emit('helpAsked', room);
		}
		else	{
			console.log('Error : too many peers in the room');
		}
	});



	socket.on('help', function (client){
		if(peersNumber == 1)	{
			console.log('help offered');
			room = client;
			peersNumber++;
			socket.join(room);
			socket.in(room).emit('helpOffered', room);
		}
		else	{
			console.log('Error : the client is already helped by another operator');
		}
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



	socket.on('stopConnection', function(e)	{
		console.log('Session terminated');
		room = '';
		peersNumber = 0;
		socket.in(room).emit('stopConnection');
	});
});
