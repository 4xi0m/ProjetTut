var compteur = 0;

var express = require('express');
var colors = require('colors');
var app = express ();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", __dirname);

//use
app.use(bodyParser());

//routes
app.get('/', function(req, res){
	var myitems = [ {id : "1" , desc : "food"},{id : "2", desc :"maman"}, {id : "3", desc :"toto"}];
	res.render("angulartest",{
		title : "learning",
		items : myitems
	});

});

app.post("/add", function(req, res){
	var newItem = req.body.main.newItem;
	console.log(newItem);
});

app.listen(8000, function (){
	console.log('ready on port 8000'.green);
});










/*

var http = require('http');

var get = http.createServer(function (req, res){
	res.setHeader('Content-Type', 'application/json');
	compteur ++;
	console.log("get");
    res.end(JSON.stringify({ a: compteur }));
});
var page = http.createServer(function (req, res){
	res.render("angulartest.html");
});

page.listen(8000,"page");

get.listen(8000,"get");

*/