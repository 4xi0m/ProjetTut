function User (email, name){

	this.email = email;
	this.name = name;
	this.id;

}



function Staff (email, name){
	this.base = User;
	this.base(email, name);
	this.staff = true;

}
Staff.prototype = new User;
Staff.prototype.toString = function () {
	return "Staff : "+ this.name;
};//methode toString



function Client (email,name){
	this.base = User;
	this.base(email, name);
	this.client = true;

}
Client.prototype = new User; //héritage
Client.prototype.toString = function () {
	return "Client : "+ this.name;
};//methode toString