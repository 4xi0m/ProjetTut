var mysql = require('mysql');
var mySqlClient = mysql.createConnection({
	host	: "127.0.0.1", 
	user	: "api",
	password: "api",
	database: "WebRTC"
});

var selectQuery = 'select * from User';
mySqlClient.query(
	selectQuery,
	function select(error, results, fields){
		if (error) {
			console.log(error);
			mySqlClient.end();
			return;
		}

	if (results.length >0) {
		var firstResult = results[0];
		console.log('email: ' + firstResult['email']);
	}
	else
	{
		console.log("no information");


	}

	mySqlClient.end();
}
);