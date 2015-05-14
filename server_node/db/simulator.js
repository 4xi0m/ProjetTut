var users = require("../model/user.js");
var client = new users.Client("client1@example.com", "28","Client", "one","2015-05-14 19:06:49");
var staff = new users.Staff("staff@example.com", "28","Staff", "one","2015-05-14 19:06:49");

function clientLogin (strEmail, strPassphrase, send_response){
	send_response(null, client);
}
module.exports.clientLogin = clientLogin;

function addClient (strEmail, strName, strFirstName, strPassphrase, send_response){
	send_response(null,client);
}
module.exports.addClient;

function staffLogin(strEmail, strPassphrase, send_response){
	send_response(null,staff);
}
module.exports.staffLogin =staffLogin;

function addStaff (strName, strFirstName, strEmail, strPassphrase, send_response){
	send_response(null, staff);
}
module.exports.addStaff= addStaff;