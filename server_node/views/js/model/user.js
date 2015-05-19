function User (email, id, name, firstname, creationDate){

	this.email = email;
	this.name = name;
	this.firstname = firstname;
	this.creationDate = creationDate;
	this.id = id;

}

function Staff (email, id, name, firstname, creationDate){
	this.base = User;
	this.base(email, id, name, firstname, creationDate);
	this.staff = true;

}
Staff.prototype = new User;
Staff.prototype.toString = function () {
	return "Staff : "+ this.firstname+" "+this.name;
};//methode toString



function Client (email, id, name, firstname, creationDate){
	this.base = User;
	this.base(email, id, name, firstname, creationDate);
	this.client = true;

}
Client.prototype = new User; //héritage
Client.prototype.toString = function () {
	return "Client : "+ this.firstname+" "+this.name;
};//methode toString