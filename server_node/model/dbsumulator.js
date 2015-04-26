var modelUser = require("./user.js");

function login(email, passWord){

	if(email== "admin@admin.fr"){
		return new modelUser.Staff("chef@help.com", "chef le roi");
	}else if(email == "null"){
		return null;
	}else{
		return new modelUser.Client("type@example.com", "Delaide lemec");
	}	

}
module.exports.login = login;