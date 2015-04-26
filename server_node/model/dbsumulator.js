var modelUser = require("./user.js");

function login(email, passWord){

	if(passWord == "1"){
		return new modelUser.Staff("chef@help.com", "chef le roi");
	}else if(passWord == "u"){
		return null;
	}else{
		return new modelUser.Client("type@example.com", "Delaide lemec");
	}	

}
module.exports.login = login;